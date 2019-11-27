"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expiresDate_1 = require("./expiresDate");
const enum_1 = require("./enum");
// tslint:disable: no-console
class BaseStorage {
    constructor(data) {
        this.data = data;
    }
    set(name, value, complete, options) {
        let status = enum_1.default.SUCCESS;
        if (typeof options === 'string') {
            options = {
                expires: options
            };
        }
        else {
            options = options || {};
        }
        const time = this.getDateTime(options.expires);
        try {
            this.data.setItem(name, `${time}|${value}`);
        }
        catch (e) {
            status = enum_1.default.OVERFLOW;
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
        let status = enum_1.default.SUCCESS;
        let value = null;
        try {
            value = this.data.getItem(name);
        }
        catch (e) {
            status = enum_1.default.FAILURE;
            value = null;
        }
        if (value) {
            const i = value.indexOf('|');
            const time = parseInt(value.substring(0, i), 10);
            if (time === 0 || new Date(time).getTime() > Date.now()) {
                value = value.substring(i + 1, value.length);
            }
            else {
                // 过期了
                status = enum_1.default.FAILURE;
                value = null;
                this.del(name);
            }
        }
        else {
            status = enum_1.default.FAILURE;
        }
        return {
            status,
            value
        };
    }
    del(name, complete) {
        let status = enum_1.default.SUCCESS;
        try {
            this.data.removeItem(name);
        }
        catch (e) {
            status = enum_1.default.FAILURE;
        }
        if (typeof complete === 'function') {
            complete.call(this, status);
        }
    }
    clear() {
        try {
            this.data.clear();
        }
        catch (e) {
            console.log(`local clear error!`);
        }
    }
    getDateTime(value) {
        const date = (value instanceof Date) ? value : value ? expiresDate_1.default(value) : null;
        return (Object.prototype.toString.call(date) === '[object Date]' && date.toString() !== 'Invalid Date' && !isNaN(date)) ? date.getTime() : 0;
    }
}
exports.default = BaseStorage;
