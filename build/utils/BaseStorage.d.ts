import { IStorage } from './interface';
export default class BaseStorage implements IStorage {
    private data;
    constructor(data: Storage);
    set(name: string, value: string, complete?: (status: number, value: string | null) => void, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): void;
    get(name: string): string | null;
    getValueAndStatus(name: string): {
        status: number;
        value: string | null;
    };
    del(name: string, complete?: (status: number) => void): void;
    clear(): void;
    private getDateTime;
}
