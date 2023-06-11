import { useState, useEffect } from 'react';
import ServerRequest from '../ServerRequest';
import Cookies from '../Cookies';

export default function Login() {

    const [ realm, setRealm ] = useState("");
    const [ username, setUsername] = useState("");
    const [ password, setPassword] = useState("");

    function handleSubmit(e?:React.MouseEvent|React.KeyboardEvent):void {
        e && e.preventDefault();

        ServerRequest.tryLogin(username, password, realm);
    }

    function handleRealm(value: string) {
        setRealm(value); 
    }
    function handleUsername(value:string) {
        setUsername(value);
    }
    function handlePassword(value:string) {
        setPassword(value);
    }

    useEffect(() => {
        if (Cookies.getLoginToken()) {
            handleSubmit();
        }

        
    }, []);
    

    /*
    useEffect(() => {
        const keyDownHandler = (e:React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleSubmit(e);
            }
        }

        //document.addEventListener('keydown', keyDownHandler);

        return () => {
           //document.removeEventListener('keydown', keyDownHandler);
        }
    }, []);*/


    return (
        <div className="Login">
            <div className="formContainer">
                <div className="header">
                    Login Form 
                </div>

                <form>
                    <label htmlFor="frealm">
                        <span>Realm</span>
                        <button className="link tooltip" onClick={(e) => {e.preventDefault()}}>
                            <span className="tooltip">What's this?</span>

                            <span className="tooltiptext">
                                The realm alias provided by your venue administrator.
                            </span>
                        </button>
                    </label>
                    <input type="text" placeholder="Realm" id="frealm" name="realm" onChange={e => handleRealm(e.target.value)}/>

                    <label htmlFor="fusername">Username</label>
                    <input type="text" placeholder="Username" id="fusername" name="username" onChange={e => handleUsername(e.target.value)}/>

                    <label htmlFor="fpassword">Password</label>
                    <input type="password" placeholder="*********" id="fpassword" name="password" onChange={e => handlePassword(e.target.value)}/>

                    <input type="submit" value="Login" onClick={e => handleSubmit(e)}></input>
                </form>

                <div className="footer">
                    Kiwi | Venue Management | by Enhasa
                </div>
            </div>
        </div>
    );
}