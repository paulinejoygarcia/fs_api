import { NETWORK_PROVIDER, NETWORK_STATUS_MESSAGES } from './Const';
// import TelecomSys from './TelecomSys';
// import Bandwidth from './Bandwidth';
// import Twilio from './Twilio';
// import Plivio from './Plivio';
// import inbox from '../inbox';
import Nexmo from './Nexmo';
import Onvoy from './Onvoy';
import SMS from './SMS';

// define different provider classes here...
export const initializeSMS = (number, network, settings) => {
    switch (network) {
        // case NETWORK_PROVIDER.NETWORK_TW:
        //     return new Twilio(number, settings);
        case NETWORK_PROVIDER.NETWORK_NX:
            return new Nexmo(number, settings);
        /*case NETWORK_PROVIDER.NETWORK_WA:
            return;*/
        // case NETWORK_PROVIDER.NETWORK_TCS:
        //     return new TelecomSys();
        // case NETWORK_PROVIDER.NETWORK_PL:
        //     return new Plivio();
        // case NETWORK_PROVIDER.NETWORK_BW:
        //     return new Bandwidth();
        case NETWORK_PROVIDER.NETWORK_OC:
            return new Onvoy(number, settings);
    }
    return new SMS(number);
};
export const getRecieptType = (data) => {
    let value = null;
    // if ((value = (new Twilio()).parseReceipt(data))) {
    //     return value;
    // }
    if ((value = (new Onvoy()).parseReceipt(data))) {
        return value;
    }
    if ((value = (new Nexmo()).parseReceipt(data))) {
        return value;
    }
    return null;
};
export const getIncomingInfo = (data) => {
    let value = null;
    // if ((value = (new Twilio()).parseIncoming(data))) {
    //     return value;
    // }
    if ((value = (new Onvoy()).parseIncoming(data))) {
        return value;
    }
    if ((value = (new Nexmo()).parseIncoming(data))) {
        return value;
    }
    // if ((value = (new Plivio()).parseIncoming(data))) {
    //     return value;
    // }
    return null;
}