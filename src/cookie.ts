import expiresDate from './utils/expiresDate';
import {  ICookie } from './utils/interface';

class Cookie implements ICookie {
    public set(name: string, value: string, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): string {
        if (!this.isValidKey(name)) { return ''; }
        if (typeof options === 'string') {
            options = {
                expires: options
            };
        } else {
            options = options || {};
        }
        // name=key
        if (!options.raw) {
            value = encodeURIComponent(String(value));
        }
        let text: string = `${name}=${value}`;
        // expires
        const date: any = (options.expires instanceof Date) ? options.expires : options.expires ? expiresDate(options.expires) : null;
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
    public get(name: string, options?: ((value: string) => any) | {
        converter?: (value: string) => any;
        raw?: boolean;
    }): string {
        if (!this.isValidKey(name)) { return ''; }
        if (typeof options === 'function') {
            options = {
                converter: options
            };
        } else {
            options = options || {};
        }
        const cookies: any = this.parseCookieString(document.cookie, !options.raw);
        return (options.converter || this.same)(cookies[name]);
    }
    public del(name: string, options?: any): string {
        options = options || {};
        options.expires = new Date(0);
        return this.set(name, '', options);
    }
    public keys(): string[] {
        return document.cookie.match(/[^ =;]+(?==)/g) || [];
    }
    public clear(): void {
        const keys: string[] = this.keys();
        for (let i = keys.length - 1; i >= 0; i--) {
            this.del(keys[i]);
        }
    }

    private parseCookieString(text: any, shouldDecode?: boolean): any {
        const cookies: any = {};
        if (this.isNonEmptyString(text)) {
            const decodeValue: (value: string) => any = shouldDecode ? decodeURIComponent : this.same;
            const cookieParts: string[] = text.split(/;\s/g);
            let cookieName: string = '';
            let cookieValue: string = '';
            let cookieNameValue: string[] | null;
            for (let i = 0, len = cookieParts.length; i < len; i++) {
                // Check for normally-formatted cookie (name-value)
                cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                if (cookieNameValue instanceof Array) {
                    try {
                        cookieName = decodeURIComponent(cookieNameValue[1]);
                        cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
                    } catch (ex) {
                        // Intentionally ignore the cookie -
                        // the encoding is wrong
                    }
                } else {
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
    private same(value: string): string {
        return value;
    }
    private isValidDate(value: any): boolean {
        return Object.prototype.toString.call(value) === '[object Date]' && value.toString() !== 'Invalid Date' && !isNaN(value);
    }
    private isNonEmptyString(value: any): boolean {
        return typeof value === 'string' && value !== '';
    }
    private isValidKey(value: any): boolean {
        // eslint-disable-next-line no-control-regex
        return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24')).test(value);
        // return (typeof value === 'string' && value !== '');
    }
}
export const cookie: Cookie = new Cookie();
export default cookie;
