export type SignUp = {
  username: string;
  email: string;
  google: boolean;
  password?: string;
  country?: string;
  avatar_url?: string;
};

export type LogIn = Pick<SignUp, 'email' | 'google' | 'password'>;

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

export enum Methods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}
