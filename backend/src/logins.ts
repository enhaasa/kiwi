import { Request, Response } from 'express';
import { getCurrentDate } from '../tools';
import { randomBytes } from 'crypto';
import { User, Token, LoginAttempt, LoginCookie } from '@shared/servertypes';
import Database from './database';


export default class Logins {
    private static readonly TOKEN_LENGTH = 32;

    public static loggedInUsers: User[] = [];

    public static add(user: User, token:Token) {
        this.loggedInUsers.push({
            ...user,
            token: token
        });
        return token;
    }

    public static generateToken():Token {
        return {
            id: randomBytes(this.TOKEN_LENGTH).toString('hex'),
            creationDate: getCurrentDate()
        } 
    }

    public static generateCookie(token:Token):LoginCookie {
        const name = "authToken";
        const value = JSON.stringify(token);
        const props = { maxAge: 36000000} ;

        return {name, value, props};
    }

    private static getLoggedInUserByToken(tokenId:string):User|false {
        if (this.loggedInUsers.length === 0) return false;
        
        const result = this.loggedInUsers.find(user => (
            user.token.id === tokenId
        ));

        if (!result) return false;
        return result;
    }

    public static getLoggedInUsers() {
        return this.getLoggedInUsers;
    }

    public static tryCookieLogin(tokenId: string) {
        const result = this.getLoggedInUserByToken(tokenId);
        console.log(result)

        if (!result) {
              return {
                isSuccessful: false,
                message: "Is not currently logged in."
              }
        } else {
            return {
                isSuccessful: true,
                message: "User is already logged in.",
                user: result
              }
        }
    }

    public static async tryDatabaseLogin(username: string, password:string):Promise<LoginAttempt> {
        return await Database.query(`SELECT * FROM users WHERE username = '${username}'`).then(rows => {
          const user = rows[0];
          let result:LoginAttempt;
          
          if (user) {
            if (password === user.password) {

              result = {
                isSuccessful: true,
                message: "Login successful!",
                user: user
              }
            } else {
                result = {
                    isSuccessful: false,
                    message: "Incorrect password."
                }
            }
          } else {
            result = {
                isSuccessful: false,
                message: "Username not found."
            }
          }
          return result;
        });
    }
}
