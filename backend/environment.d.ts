declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        DB_USER: string;
        DB_HOST: string;
        DB_PASSWORD: string; 
        EXPRESS_SESSION_SECRET?: string;
      }
    }
  }

  export {}