import Axios from "axios";
import Cookies from "./Cookies";

export default class ServerRequest {
    private static readonly url = 'http://localhost:3001';

    public static tryLogin(username: string, password: string, realm:string) {
        Axios.post(this.url + "/login", {
            username: username,
            password: password,
            realm: realm,
            loginToken: Cookies.getLoginToken()
        }).then(res => {
            const { isSuccessful, message, cookie } = res.data;

            if(isSuccessful) {
                Cookies.setLoginToken(cookie);
                window.location.href = this.url + "/dashboard";
            } else {
                //window.alert(message);
            }
        });

    }



}