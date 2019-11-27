"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expiresDate_1 = require("./utils/expiresDate");
class Cookie {
    set(name, value, options) {
        if (!this.isValidKey(name)) {
            return '';
        }
        if (typeof options === 'string') {
            options = {
                expires: options
            };
        }
        else {
            options = options || {};
        }
        // name=key
        if (!options.raw) {
            value = encodeURIComponent(String(value));
        }
        let text = `${name}=${value}`;
        // expires
        const date = (options.expires instanceof Date) ? options.expires : options.expires ? expiresDate_1.default(options.expires) : null;
        if (this.isValidDate(date)) {
            text += `; expires=${date.toUTCString()}`;
        }
        // domain
        if (this.isNonEmptyString(options.domain)) {
            text += `; domain=${options.domain}`;
        }
        // path
        if (this.isNonEmptyString(options.path)) {
            text += `; path=${options.path}`;
        }
        // secure
        if (options.secure) {
            text += `; secure`;
        }
        document.cookie = text;
        return text;
    }
    get(name, options) {
        if (!this.isValidKey(name)) {
            return '';
        }
        if (typeof options === 'function') {
            options = {
                converter: options
            };
        }
        else {
            options = options || {};
        }
        const cookies = this.parseCookieString(document.cookie, !options.raw);
        return (options.converter || this.same)(cookies[name]);
    }
    del(name, options) {
        options = options || {};
        options.expires = new Date(0);
        return this.set(name, '', options);
    }
    keys() {
        return document.cookie.match(/[^ =;]+(?==)/g) || [];
    }
    clear() {
        const keys = this.keys();
        for (let i = keys.length - 1; i >= 0; i--) {
            this.del(keys[i]);
        }
    }
    parseCookieString(text, shouldDecode) {
        const cookies = {};
        if (this.isNonEmptyString(text)) {
            const decodeValue = shouldDecode ? decodeURIComponent : this.same;
            const cookieParts = text.split(/;\s/g);
            let cookieName = '';
            let cookieValue = '';
            let cookieNameValue;
            for (let i = 0, len = cookieParts.length; i < len; i++) {
                // Check for normally-formatted cookie (name-value)
                cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                if (cookieNameValue instanceof Array) {
                    try {
                        cookieName = decodeURIComponent(cookieNameValue[1]);
                        cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
                    }
                    catch (ex) {
                        // Intentionally ignore the cookie -
                        // the encoding is wrong
                    }
                }
                else {
                    // Means the cookie does not have an "=", so treat it as
                    // a boolean flag
                    cookieName = decodeURIComponent(cookieParts[i]);
                    cookieValue = '';
                }
                if (cookieName) {
                    cookies[cookieName] = cookieValue;
                }
            }
        }
        return cookies;
    }
    same(value) {
        return value;
    }
    isValidDate(value) {
        return Object.prototype.toString.call(value) === '[object Date]' && value.toString() !== 'Invalid Date' && !isNaN(value);
    }
    isNonEmptyString(value) {
        return typeof value === 'string' && value !== '';
    }
    isValidKey(value) {
        // eslint-disable-next-line no-control-regex
        return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24')).test(value);
        // return (typeof value === 'string' && value !== '');
    }
}
exports.cookie = new Cookie();
exports.default = exports.cookie;
