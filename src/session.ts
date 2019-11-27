import { Local } from './local';
import BaseCookie from './utils/BaseCookie';
import BaseStorage from './utils/BaseStorage';
import cookie from './cookie';
import { IStorage } from './utils/interface';

class Session extends Local {
    public createStorage(): IStorage {
        let data: IStorage;
        try {
            window.sessionStorage.setItem('checkStorage', '1');
            window.sessionStorage.removeItem('checkStorage');
            data = new BaseStorage(window.sessionStorage);
        } catch (error) {
            data = new BaseCookie(cookie, 'SS_');
        }
        return data;
    }
}

export const session: IStorage = new Session();
export default session;
