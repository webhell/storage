"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseStorage_1 = require("./utils/BaseStorage");
const BaseCookie_1 = require("./utils/BaseCookie");
const cookie_1 = require("./cookie");
const enum_1 = require("./utils/enum");
class Local {
    set(name, value, complete, options) {
        this.data.set(name, JSON.stringify(value), (s, v) => {
            if (typeof complete === 'function') {
                complete.call(this, s, v);
            }
        }, options);
    }
    get(name) {
        return this.getValueAndStatus(name).value;
    }
    getValueAndStatus(name) {
        const res = this.data.getValueAndStatus(name);
        if (res.status === enum_1.default.SUCCESS) {
            res.value = JSON.parse(res.value);
        }
        return res;
    }
    del(name, complete) {
        this.data.del(name, (s) => {
            if (typeof complete === 'function') {
                complete.call(this, s);
            }
        });
    }
    clear() {
        this.data.clear();
    }
    createStorage() {
        let data;
        try {
            window.localStorage.setItem('checkStorage', '1');
            window.localStorage.removeItem('checkStorage');
            data = new BaseStorage_1.default(window.localStorage);
        }
        catch (error) {
            data = new BaseCookie_1.default(cookie_1.default, 'LS_');
        }
        return data;
    }
    get data() {
        if (!this._data) {
            this._data = this.createStorage();
        }
        return this._data;
    }
}
exports.Local = Local;
exports.local = new Local();
exports.default = exports.local;
