export type SignUp = {
  name: string;
  email: string;
  google: boolean;
  password?: string;
  country?: string;
  avatar_url?: string;
};

export type LogIn = Pick<SignUp, 'email' | 'password'>;

export type Token = {
  token: string;
};

export type RequestData = SignUp | LogIn;

export enum Endpoints {
  Login = 'auth/signin',
  Signup = 'auth/signup',
  GetUser = 'auth/me',
}

export type LoadRequest = {
  url: URL;
  method: string;
  params?: RequestData;
  token?: string;
};
