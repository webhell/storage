import BaseStorage from './utils/BaseStorage';
import BaseCookie from './utils/BaseCookie';
import cookie from './cookie';
import Status from './utils/enum';
import { IStorage } from './utils/interface';

export class Local implements IStorage {
    private _data?: IStorage;

    public set(name: string, value: any, complete?: (status: number, value: string | null) => void, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): void {
        this.data.set(name, JSON.stringify(value), (s: number, v: string | null) => {
            if (typeof complete === 'function') {
                complete.call(this, s, v);
            }
        }, options);
    }

    public get(name: string): any {
        return this.getValueAndStatus(name).value;
    }

    public getValueAndStatus(name: string): {
        status: number;
        value: any;
    } {
        const res: any = this.data.getValueAndStatus(name);
        if (res.status === Status.SUCCESS) {
            res.value = JSON.parse(res.value);
        }
        return res;
    }

    public del(name: string, complete?: (status: number) => void): void {
        this.data.del(name, (s: number) => {
            if (typeof complete === 'function') {
                complete.call(this, s);
            }
        });
    }

    public clear(): void {
        this.data.clear();
    }

    public createStorage(): IStorage {
        let data: IStorage;
        try {
            window.localStorage.setItem('checkStorage', '1');
            window.localStorage.removeItem('checkStorage');
            data = new BaseStorage(window.localStorage);
        } catch (error) {
            data = new BaseCookie(cookie, 'LS_');
        }
        return data;
    }

    public get data(): IStorage {
        if (!this._data) {
            this._data = this.createStorage();
        }
        return this._data;
    }
}
export const local: Local = new Local();
export default local;
