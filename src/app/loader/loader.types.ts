export type SignUp = {
  username: string;
  email: string;
  password: string;
  country: string;
};

export type LogIn = Pick<SignUp, 'email' | 'password'>;

export type Token = {
  token: string;
};

export type RequestData = SignUp | LogIn;

export enum Endpoints {
  Login = 'auth/signin',
  Signup = 'auth/signup',
}
