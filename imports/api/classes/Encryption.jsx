import Util from './Utilities';

export const Enc = (key) => {
    return new Encryption(key);
};
class Encryption {
    constructor(key) {
        this.key = key;
        this.box = [0x42, 0x4a, 0x4c, 0x70, 0x55, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
            0x6b, 0x44, 0x6c, 0x6d, 0x47, 0x6e, 0x6f, 0x4e, 0x69, 0x6a, 0x34, 0x35,
            0x59, 0x5a, 0x61, 0x41, 0x62, 0x63, 0x64, 0x65, 0x48, 0x49, 0x68, 0x37,
            0x4d, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x56, 0x57, 0x66, 0x67, 0x36,
            0x77, 0x78, 0x4b, 0x79, 0x43, 0x7a, 0x30, 0x31, 0x58, 0x32, 0x45, 0x33,
            0x38, 0x46, 0x39, 0x2b, 0x2f];

    }
    toByte(long) {
        let byteArray = [0];
        for (let index = 0; index < byteArray.length; index++) {
            let byte = long & 0xff;
            byteArray[index] = byte;
            long = (long - byte) / 256;
        }
        return byteArray[0];
    }
    Ex(in_, retval, len) {
        let vv1 = [];
        vv1[0] = String.fromCharCode(this.toByte(this.box[in_[0] >> 2]));
        vv1[1] = String.fromCharCode(this.toByte(this.box[((in_[0] & 0x03) << 4) | ((in_[1] & 0xf0) >> 4)]));
        vv1[2] = String.fromCharCode(this.toByte((len > 1 ? this.box[((in_[1] & 0x0f) << 2) | ((in_[2] & 0xc0) >> 6)] : 63)));
        vv1[3] = String.fromCharCode(this.toByte((len > 2 ? this.box[in_[2] & 0x3f] : 63)));
        vv1[4] = '\0';
        return retval + vv1.join('').replace(/\0/g, '');
    }
    Dex(in_) {
        let retval = [];
        retval[0] = String.fromCharCode(this.toByte(in_[0] << 2 | in_[1] >> 4));
        retval[1] = String.fromCharCode(this.toByte(in_[1] << 4 | in_[2] >> 2));
        retval[2] = String.fromCharCode(this.toByte(in_[2] << 6 | in_[3] >> 0));
        retval[3] = '\0';
        return retval.join('').replace(/\0/g, '');
    }
    strchr(arr, key) {
        for (let i = 0; i < arr.length; i++)
            if (arr[i] === key) {
                return i;
            }
        return null;
    }
    enc(text) {
        let retval = "", in_ = [], i, vvv1 = 0, j = 0;
        while (text.length > j) {
            vvv1 = 0;
            for (i = 0; i < 3; i++) {
                try {
                    in_[i] = text.charCodeAt(j);
                    if (in_[i] > 0) {
                        vvv1++; j++;
                    }
                }
                catch (e) {
                    in_[i] = 0;
                }
            }
            if (vvv1 > 0) {
                retval = this.Ex(in_, retval, vvv1);
            }
        }
        return retval;
    };
    dec(text) {
        let retval = "", c, phase = 0, p, in_ = [0, 0, 0, 0];

        for (let i = 0; text.length > i; i++) {
            c = text.charCodeAt(i);
            if (c == 63) {
                retval += this.Dex(in_);
                break;
            }
            if ((p = this.strchr(this.box, c)) !== null) {
                in_[phase] = p;
                phase = (phase + 1) % 4;
                if (phase == 0) {
                    retval += this.Dex(in_);
                    in_[0] = in_[1] = in_[2] = in_[3] = 0;
                }
            }
        }
        return retval;
    }
    Encrypt(plaintext) {
        let ex = plaintext;
        for (let x = 0; x < 2; x++) {
            ex = this.XoR(ex, this.key);
            ex = this.enc(ex);
        }
        ex = this.XoR(ex, this.key);
        return Util.encodeBase64(ex);
    }
    Decrypt(cipher) {
        cipher = Util.decodeBase64(cipher);
        if (cipher) {
            var ex = this.XoR(cipher, this.key);
            for (var x = 0; x < 2; x++) {
                ex = this.dec(ex);
                ex = this.XoR(ex, this.key);
            }
            return ex;
        }
        return cipher;
    }
    XoR(to, from) {
        var retval = [];
        if (to && from) {
            to = to.toString();
            from = from.toString();
            for (var i = 0; i < to.length; i++) {
                if (to[i] != from[i % from.length])
                    retval[i] = String.fromCharCode((to.charCodeAt(i) ^ from.charCodeAt(i % from.length)));
                else
                    retval[i] = to[i];
            }
            return retval.join('');
        }
        return to;
    };
}