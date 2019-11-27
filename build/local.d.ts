import { IStorage } from './utils/interface';
export declare class Local implements IStorage {
    private _data?;
    set(name: string, value: any, complete?: (status: number, value: string | null) => void, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): void;
    get(name: string): any;
    getValueAndStatus(name: string): {
        status: number;
        value: any;
    };
    del(name: string, complete?: (status: number) => void): void;
    clear(): void;
    createStorage(): IStorage;
    get data(): IStorage;
}
export declare const local: Local;
export default local;
