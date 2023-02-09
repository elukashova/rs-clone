export interface LogIn {
  email: string;
  google: boolean;
  password?: string;
}

export interface SignUp extends LogIn {
  username: string;
  country?: string;
  avatar_url?: string;
}

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

export enum Errors {
  UserAlreadyExists = 'Conflict',
  Unauthorized = 'Unauthorized',
}
