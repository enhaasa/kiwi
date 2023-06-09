export type User = {
    id: number,
    username: string,
    password: string,
    realm_id: number,
    access_level: number,
    token?: Token
}

export type Token = {
    id: string,
    creationDate: string,
}

export type LoginAttempt = {
    isSuccessful: boolean,
    message: string,
    user?: User
}

export type LoginCookie = {
    name: "authToken",
    value: string,
    props: {
        maxAge: number
    }
}