"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_1 = require("./local");
const BaseCookie_1 = require("./utils/BaseCookie");
const BaseStorage_1 = require("./utils/BaseStorage");
const cookie_1 = require("./cookie");
class Session extends local_1.Local {
    createStorage() {
        let data;
        try {
            window.sessionStorage.setItem('checkStorage', '1');
            window.sessionStorage.removeItem('checkStorage');
            data = new BaseStorage_1.default(window.sessionStorage);
        }
        catch (error) {
            data = new BaseCookie_1.default(cookie_1.default, 'SS_');
        }
        return data;
    }
}
exports.session = new Session();
exports.default = exports.session;
