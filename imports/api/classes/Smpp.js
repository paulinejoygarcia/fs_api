import npmFuture from 'fibers/future';
import npmSmpp from 'smpp';

export default class Smpp {
    constructor(ip, port) {
        this.session = npmSmpp.connect('smpp://' + ip + ':' + port);
        this.connected = false;
    }

    bindTransceiver(systemId, password, systemType) {
        const params = {
            system_id: systemId,
            password: password,
            system_type: systemType,
        };
        let fut = new npmFuture();
        let that = this;
        that.session.bind_transceiver(params, function (pdu) {
            if (pdu.command_status == 0) {
                that.connected = true;
                that.onEnquireLink();
                fut.return(true);
            } else fut.return(false);
        });
        return fut.wait();
    }

    submitSm(from, to, message) {
        if (this.connected) {
            let fut = new npmFuture();
            this.session.submit_sm({
                destination_addr: ['+', to.replace(/\D/g, '')].join(''),
                source_addr: ['+', from.replace(/\D/g, '')].join(''),
                short_message: message,
                registered_delivery: 1,
            }, function (pdu) {
                if (pdu.command_status == 0) {
                    fut.return({
                        success: true,
                        data: pdu.message_id
                    });
                } else {
                    fut.return({ success: false });
                }
            });
            return fut.wait();
        }
    }

    deliverSmResponse(sequenceNo) {
        if (this.connected) {
            this.session.deliver_sm_resp({ sequence_number: sequenceNo });
        }
    }

    onDeliverSm(callback) {
        const that = this;
        if (that.connected) {
            that.session.on('deliver_sm', function (pdu) {
                if (typeof callback === 'function') callback.call(this, pdu);
                that.deliverSmResponse(pdu.sequence_number);
            });
        }
    }

    onEnquireLink() {
        const that = this;
        if (that.connected) {
            that.session.on('enquire_link', function (pdu) {
                that.session.send(pdu.response());
            });
        }
    }
}