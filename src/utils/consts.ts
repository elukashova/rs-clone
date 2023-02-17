// Gmail authentication
// eslint-disable-next-line max-len
export const GOOGLE_CLIENT_ID: string = '867792290204-n80gt7ebkoqsg6cqr8592g0fle342tjj.apps.googleusercontent.com';

// Rest API for countries
export const REST_COUNTRIES: string = 'https://restcountries.com/v2/all';

// Prod and dev environment
export const PRODUCTION_ENV = 'https://the-big-bug-theory-be.onrender.com';
export const DEVELOPMENT_ENV = 'http://localhost:3000';

export enum ProjectColors {
  LightTurquoise = '#90DAD1',
  Turquoise = '#1CBAA7',
  DarkTurquoise = '#219486',
  Yellow = '#FFAE0B',
  Orange = '#FF8D24',
  Grey = '#949494',
  White = '#FFFFFF',
}

// form validation
// eslint-disable-next-line prettier/prettier, @typescript-eslint/quotes, no-useless-escape
export const VALID_NAME: RegExp = /^([\w]{3,})+\s+([\w\s]{3,})+$/;
// eslint-disable-next-line prettier/prettier, max-len, operator-linebreak
export const VALID_EMAIL: RegExp =
  /^(?!\\.)(?!.*\\.$)(?!.*\\.\\.)([A-Za-z0-9!#$%&'*\\.\\.+-\\/=?^_`{|}~]{2,})@([\w-]+\.)+[a-z]{2,4}$/;
export const VALID_PASSWORD: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
