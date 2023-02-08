// eslint-disable-next-line import/prefer-default-export

// Gmail authentication
export const GOOGLE_CLIENT_ID: string = '867792290204-n80gt7ebkoqsg6cqr8592g0fle342tjj.apps.googleusercontent.com';

// Prod and dev environment
export const PRODUCTION_ENV: string = 'https://the-big-bug-theory-be.onrender.com';
export const DEVELOPMENT_ENV: string = 'http://localhost:3000';

// form validation
// eslint-disable-next-line prettier/prettier, @typescript-eslint/quotes, no-useless-escape
// export const VALID_NAME: string = "^([\w]{3,})+\s+([\w\s]{3,})+$";
export const VALID_NAME: RegExp = /^([\w]{3,})+\s+([\w\s]{3,})+$/;
// eslint-disable-next-line prettier/prettier
export const VALID_EMAIL: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const VALID_PASSWORD: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
