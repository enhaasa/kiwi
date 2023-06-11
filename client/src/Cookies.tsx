import { Token } from '@shared/servertypes';

export default class Cookies {

    public static getLoginToken() {
        const result = this.getCookie("authToken");
        if(result) {
            return JSON.parse(result).value.token.id;
        }
        return result;
    }

    public static setLoginToken(token: Token) {
        console.log(token)
        document.cookie = `authToken=${JSON.stringify(token)}`;
    }

    private static getCookie(name: string): string|null {
        const nameLenPlus = (name.length + 1);
        return document.cookie
            .split(';')
            .map(c => c.trim())
            .filter(cookie => {
                return cookie.substring(0, nameLenPlus) === `${name}=`;
            })
            .map(cookie => {
                return decodeURIComponent(cookie.substring(nameLenPlus));
            })[0] || null;
    }
}