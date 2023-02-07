import { LogIn, SignUp } from '../../app/loader/loader.types';

export enum GoogleBtnClasses {
  Signup = 'g_id_signup',
  Signin = 'g_id_signin',
}

export enum GoogleBtnTypes {
  Signup = 'signup_with',
  Signin = 'signin_with',
}

export type GoogleBtnData = {
  parent: HTMLElement;
  btnClass: GoogleBtnClasses;
  signupCallback?: SignUpCallback;
  loginCallback?: LogInCallback;
};

export type SignUpCallback = (user: SignUp) => void;

export type LogInCallback = (user: LogIn) => void;

export type GoogleAccount = {
  name: string;
  email: string;
  picture: string;
};
