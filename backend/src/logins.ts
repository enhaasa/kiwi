import { getCurrentDate } from '../tools';
import { randomBytes } from 'crypto';
import { User, Token, LoginAttempt, LoginCookie } from '@shared/servertypes';
import Database from './database';

export default class Logins {
    private static readonly TOKEN_LENGTH = 32;

    public static loggedInUsers: User[] = [
        {
            id: 1,
            username: "admin",
            password: "carrots",
            realm_id: 1,
            access_level: 3,
            token: {
                id: "test",
                creationDate: "test date"
            }
        }
    ];

    public static getLoggedInUserByToken(tokenId:string):User|false {
        if (this.loggedInUsers.length === 0) return false;
        
        const result = this.loggedInUsers.find(user => (
            user.token.id === tokenId
        ));

        if (!result) return false;
        return result;
    }

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

    public static generateCookie(token:Token, access_level:number, user_id:number):LoginCookie {
        const name = "authToken";
        const value = {
            token: token,
            access_level: access_level,
            user_id: user_id
        };
        const props = { maxAge: 36000000} ;

        return {name, value, props};
    }

    public static getLoggedInUsers() {
        return this.getLoggedInUsers;
    }

    public static tryCookieLogin(tokenId: string) {
        const result = this.getLoggedInUserByToken(tokenId);

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

    public static async tryDatabaseLogin(username: string, password:string, realm:string):Promise<LoginAttempt> {
        return await Database.query(`
            SELECT u.* FROM users u
                JOIN realms r ON u.realm_id = r.id
                WHERE r.alias = '${realm}'
            `)
        .then(rows => {
          const user = rows.find(row => row.username === username);

          let result:LoginAttempt = {
            isSuccessful: false,
            message: "Username not found in this realm."
          };
          
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
