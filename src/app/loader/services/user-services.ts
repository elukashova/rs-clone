/* eslint-disable max-len */
import Loader from '../loader';
import { Endpoints, LogIn, Methods, SignUp, Token } from '../loader.types';

export const createUser = (params: SignUp): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Signup, params);

export const loginUser = (params: LogIn): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Login, params);

// TODO: типизировать получаемый промис
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getUser = (token: Token) => Loader.getUserData(Methods.Get, Endpoints.GetUser, token);
