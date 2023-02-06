import { SignUp } from '../../app/loader/loader.types';

export enum GoogleBtn {
  SignUpClass = 'g_id_signup',
  SignInClass = 'g_id_signin',
}

export type GoogleBtnData = {
  parent: HTMLElement;
  type: GoogleBtn;
  callback: (user: SignUp) => void;
};

export type GoogleAccount = {
  name: string;
  email: string;
  picture: string;
};
