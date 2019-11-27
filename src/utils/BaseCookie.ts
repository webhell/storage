import Status from './enum';
import { IStorage, ICookie } from './interface';

export default class BaseCookie implements IStorage {
    private data: ICookie;
    private _key: string;
    constructor(data: ICookie, preKey?: string) {
        this.data = data;
        this._key = typeof preKey === 'string' ? preKey : '';
    }

    public set(name: string, value: string, complete?: (status: number, value: string | null) => void, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): void {
        name = this.preName(name);
        let status: number = Status.SUCCESS;
        try {
            this.data.set(name, value, options);
        } catch (e) {
            status = Status.FAILURE;
        }
        // 回掉
        if (typeof complete === 'function') {
            complete.call(this, status, value);
        }
    }

    public get(name: string): string | null {
        return this.getValueAndStatus(name).value;
    }

    public getValueAndStatus(name: string): {
        status: number;
        value: string | null;
    } {
        name = this.preName(name);
        let status: number = Status.SUCCESS;
        let value: string | null = null;
        try {
            value = this.data.get(name);
        } catch (e) {
            status = Status.FAILURE;
            value = null;
        }
        // 回掉
        return {
            status,
            value
        };
    }

    public del(name: string, complete?: (status: number) => void): void {
        name = this.preName(name);
        let status: number = Status.SUCCESS;
        try {
            this.data.del(name);
        } catch (e) {
            status = Status.FAILURE;
        }
        if (typeof complete === 'function') {
            complete.call(this, status);
        }
    }

    public clear(): void {
        const keys: string[] = this.data.keys();
        for (let i = keys.length - 1; i >= 0; i--) {
            const reg: RegExp = new RegExp(`^${this._key}(.*)`);
            if (reg.test(keys[i])) {
                this.del(RegExp.$1);
            }
        }
    }

    private preName(name: string): string {
        return this._key + name;
    }
}
