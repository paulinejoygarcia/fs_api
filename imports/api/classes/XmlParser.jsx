import xmlParserModule from 'xml-parser';

import Util from './Utilities';

export default class XmlParser {
    constructor(accountId) {
        this.accountId = accountId;
    }

    setFreeswitch(freeswitch) {
        if (freeswitch && freeswitch.isConnected())
            this.freeswitch = freeswitch;
    }

    setSmppSender(func) {
        if (func && typeof func === 'function')
            this.smppSend = func;
    }

    sms(attributes, children, content) {
        if (this.smppSend)
            this.smppSend(attributes.from, attributes.to, content);
    }

    chat(attributes, children, content) {
        if (!this.freeswitch) return;

        if (!attributes.type) attributes.type = 'all';

        if (attributes.type == 'verto' || attributes.type == 'all')
            this.freeswitch.sendVertoChat(attributes.from, attributes.to, content);

        if (attributes.type == 'sip' || attributes.type == 'all')
            this.freeswitch.sendSipChat(attributes.from, attributes.to, content);
    }

    dial(attributes, children, content) {
        if (!this.freeswitch) return;

        let actions = [];
        let data = '';
        let toDial = [];
        const isSimultaneous = attributes.type == 'simultaneous';
        const isSequential = !attributes.type || attributes.type == 'sequential';
        if (children.length) {
            for (let x = 0; x < children.length; x++) {
                const c = children[x];
                const att = c.attributes || {};
                const val = c.content;
                let rcpt = '';
                switch (c.name) {
                    case 'Number':
                        if (cid = att.callerId) {
                            actions.push(`<action application="set" data="effective_caller_id_name=${cid}"/>`);
                            actions.push(`<action application="set" data="effective_caller_id_number=${cid}"/>`);
                        }
                        const gateway = this.freeswitch.getCallOutboundGateway(this.accountId, val);
                        if (gateway)
                            rcpt = gateway;
                        break;
                    case 'User': rcpt = `user/${val}`; break;
                }
                toDial.push(rcpt);
            }
        }
        if (isSimultaneous) data = toDial.join(',');
        if (isSequential) data = toDial.join('|');
        actions.push(`<action application="bridge" data="${data}"/>`);
        return actions.join('');
    }

    conference(attributes, children, content) {
        let action = [];

        action.push(`<action application="conference" data="${content}"/>`);

        return action.join('');
    }

    say(attributes, children, content) {
        let action = [];
        let voice = 'slt';
        switch (attributes.voice) {
            case 'female': voice = 'slt'; break;
            case 'male1': voice = 'rms'; break;
            case 'male2': voice = 'awb'; break;
            case 'male3': voice = 'kal'; break;
        }

        if (!content) content = '';

        action.push(`<action application="set" data="tts_engine=flite"/>`);
        action.push(`<action application="set" data="tts_voice=${voice}"/>`);
        action.push(`<action application="speak" data="${content}"/>`);

        return action.join('');
    }

    play(attributes, children, content) {
        let action = [];

        action.push(`<action application="playback" data="${content}"/>`);

        return action.join('');
    }

    pause(attributes, children, content) {
        let action = [];
        let length = (attributes.length) ? parseInt(attributes.length) : 1;
        length = length * 1000;
        action.push('<action application="sleep" data="' + length + '"/>');

        return action.join('');
    }

    hangup(attributes, children, content) {
        let action = [];
        let reason = '486';
        action.push('<action application="respond" data="' + reason + '"/>');

        return action.join('');
    }

    process(xml_) {
        let xml = new xmlParserModule(xml_);
        if (!Util.isObject(xml) || (Util.isObject(xml) && xml.root.name != 'Response')) {
            return {
                success: false,
                body: 'Invalid XML'
            }
        }

        let actions = [];
        const verbs = xml.root.children;
        for (let x = 0; x < verbs.length; x++) {
            const verb = verbs[x];
            switch (verb.name) {
                case 'Sms':
                    this.sms(verb.attributes, verb.children, verb.content);
                    break;
                case 'Chat':
                    this.chat(verb.attributes, verb.children, verb.content);
                    break;
                case 'Dial':
                    actions.push(this.dial(verb.attributes, verb.children, verb.content));
                    break;
                case 'Conference':
                    actions.push(this.conference(verb.attributes, verb.children, verb.content));
                    break;
                case 'Say':
                    actions.push(this.say(verb.attributes, verb.children, verb.content));
                    break;
                case 'Play':
                    actions.push(this.play(verb.attributes, verb.children, verb.content));
                    break;
                case 'Pause':
                    actions.push(this.pause(verb.attributes, verb.children, verb.content));
                    break;
                case 'Hangup':
                    actions.push(this.hangup(verb.attributes, verb.children, verb.content));
                case 'Answer':
                    actions.push('<action application="answer"/>');
                    break;
            }
        }

        return {
            success: true,
            data: actions.join('')
        }
    }
}