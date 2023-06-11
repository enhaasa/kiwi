import { Client } from 'pg';
import Logins from './logins';
import AccessLevelManager from './accessLevelManager';
import { User } from '@shared/servertypes';
require('dotenv').config();

export default class Database {
    public static async query(query:string, expectSingularResult = false) {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
          });
        
          client.connect();
          try {
            const result = await client.query(query);
            if (expectSingularResult) return result.rows[0];
            return result.rows;
          } catch(err) {
            console.log(err);
          } finally {
            client.end();
          }
    }

    public static validateRequest(user:User, table:string, requestType:string) {
      const accessLevelRequirement = AccessLevelManager.getAccessLevelRequirement(table, requestType);
      if (user.access_level < accessLevelRequirement) {
        return {
          isSuccessful: false,
          message: "Insufficient permission for this request."
        }
      }

      return {
        isSuccessful: true,
        message: "Authorized."
      };
    }
}