declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      PRODUCTION_ENV: string;
      DEVELOPMENT_ENV: string;
    }
  }
}

export {};
