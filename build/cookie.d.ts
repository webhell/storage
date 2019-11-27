import { ICookie } from './utils/interface';
declare class Cookie implements ICookie {
    set(name: string, value: string, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): string;
    get(name: string, options?: ((value: string) => any) | {
        converter?: (value: string) => any;
        raw?: boolean;
    }): string;
    del(name: string, options?: any): string;
    keys(): string[];
    clear(): void;
    private parseCookieString;
    private same;
    private isValidDate;
    private isNonEmptyString;
    private isValidKey;
}
export declare const cookie: Cookie;
export default cookie;
