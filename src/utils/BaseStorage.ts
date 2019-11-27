import expiresDate from './expiresDate';
import Status from './enum';
import { IStorage } from './interface';

// tslint:disable: no-console
export default class BaseStorage implements IStorage {
    private data: Storage;
    constructor(data: Storage) {
        this.data = data;
    }
    public set(name: string, value: string, complete?: (status: number, value: string | null) => void, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): void {
        let status: number = Status.SUCCESS;
        if (typeof options === 'string') {
            options = {
                expires: options
            };
        } else {
            options = options || {};
        }
        const time: number = this.getDateTime(options.expires);

        try {
            this.data.setItem(name, `${time}|${value}`);
        } catch (e) {
            status = Status.OVERFLOW;
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
        let status: number = Status.SUCCESS;
        let value: string | null = null;
        try {
            value = this.data.getItem(name);
        } catch (e) {
            status = Status.FAILURE;
            value = null;
        }
        if (value) {
            const i: number = value.indexOf('|');
            const time: number = parseInt(value.substring(0, i), 10);
            if (time === 0 || new Date(time).getTime() > Date.now()) {
                value = value.substring(i + 1, value.length);
            } else {
                // 过期了
                status = Status.FAILURE;
                value = null;
                this.del(name);
            }
        } else {
            status = Status.FAILURE;
        }
        return {
            status,
            value
        };
    }
    public del(name: string, complete?: (status: number) => void): void {
        let status: number = Status.SUCCESS;
        try {
            this.data.removeItem(name);
        } catch (e) {
            status = Status.FAILURE;
        }
        if (typeof complete === 'function') {
            complete.call(this, status);
        }
    }
    public clear(): void {
        try {
            this.data.clear();
        } catch (e) {
            console.log(`local clear error!`);
        }
    }
    private getDateTime(value: any): number {
        const date: any = (value instanceof Date) ? value : value ? expiresDate(value) : null;
        return (Object.prototype.toString.call(date) === '[object Date]' && date.toString() !== 'Invalid Date' && !isNaN(date)) ? date.getTime() : 0;
    }
    // private isValidDate(value: any): boolean {
    //     return Object.prototype.toString.call(value) === '[object Date]' && value.toString() !== 'Invalid Date' && !isNaN(value);
    // }
}
