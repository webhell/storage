export interface ICookie {
    set(name: string, value: string, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): string;

    get(name: string, options?: ((value: string) => any) | {
        converter?: (value: string) => any; // 处理函数，默认原数据返回
        raw?: boolean;
    }): string;

    del(name: string, options?: any): string;

    clear(): void;

    keys(): string[];
}

export interface IStorage {
    set(name: string, value: any, complete?: (status: number, value: string | null) => void, options?: string | {
        expires?: Date | string;
        domain?: string;
        path?: string;
        raw?: boolean;
        secure?: boolean;
    }): void;

    get(name: string): any;

    getValueAndStatus(name: string): {
        status: number; // 状态 0成功
        value: any;
    };

    del(name: string, complete?: (status: number) => void): void;

    clear(): void;
}
