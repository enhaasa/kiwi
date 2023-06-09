import { Client } from 'pg';
require('dotenv').config();

export default class Database {
    public static async query(query:string) {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
          });
        
          client.connect();
          try {
            const result = await client.query(query);
            return result.rows;
          } catch(err) {
            console.log(err);
          } finally {
            client.end();
          }
    }
}