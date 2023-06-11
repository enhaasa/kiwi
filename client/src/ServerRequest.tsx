import Axios from "axios";
import Cookies from "./Cookies";

export default class ServerRequest {

    //private static readonly url = process.env.NODE_ENV === "development" ? 'http://localhost:3001' : `https://${document.location.hostname}`;
    private static readonly url = 'http://localhost:3001';

    public static tryLogin(username:string, password: string, realm:string) {
        Axios.post(this.url + "/login", {
            username: username,
            password: password,
            realm: realm,
            loginToken: Cookies.getLoginToken()
        }).then(res => {
            const { isSuccessful, message, cookie } = res.data;

            if(isSuccessful) {
                Cookies.setLoginToken(cookie);
                console.log(cookie)
                //window.location.href = this.url + "/dashboard";
            } else {
                //window.alert(message);
            }
        });
    }



    public static async get(table:string) {
        const token_id = Cookies.getLoginToken();
        const result = await Axios.post(this.url + "/get", {
            token_id: token_id,
            table: table
        });

        return result;
    }
}