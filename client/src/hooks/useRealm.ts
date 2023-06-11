import { useState } from 'react';
import Cookies from '../Cookies';
import ServerRequest from '../ServerRequest';


export default function useRealm() {
    const [ realm, setRealm ] = useState<any>();

    async function refresh() {
        setRealm((await ServerRequest.get("realm")).data.data);
    }

    return{
        get: realm,
        refresh: refresh
    }
}           