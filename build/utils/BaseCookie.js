"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("./enum");
class BaseCookie {
    constructor(data, preKey) {
        this.data = data;
        this._key = typeof preKey === 'string' ? preKey : '';
    }
    set(name, value, complete, options) {
        name = this.preName(name);
        let status = enum_1.default.SUCCESS;
        try {
            this.data.set(name, value, options);
        }
        catch (e) {
            status = enum_1.default.FAILURE;
        }
        // 回掉
        if (typeof complete === 'function') {
            complete.call(this, status, value);
        }
    }
    get(name) {
        return this.getValueAndStatus(name).value;
    }
    getValueAndStatus(name) {
        name = this.preName(name);
        let status = enum_1.default.SUCCESS;
        let value = null;
        try {
            value = this.data.get(name);
        }
        catch (e) {
            status = enum_1.default.FAILURE;
            value = null;
        }
        // 回掉
        return {
            status,
            value
        };
    }
    del(name, complete) {
        name = this.preName(name);
        let status = enum_1.default.SUCCESS;
        try {
            this.data.del(name);
        }
        catch (e) {
            status = enum_1.default.FAILURE;
        }
        if (typeof complete === 'function') {
            complete.call(this, status);
        }
    }
    clear() {
        const keys = this.data.keys();
        for (let i = keys.length - 1; i >= 0; i--) {
            const reg = new RegExp(`^${this._key}(.*)`);
            if (reg.test(keys[i])) {
                this.del(RegExp.$1);
            }
        }
    }
    preName(name) {
        return this._key + name;
    }
}
exports.default = BaseCookie;
