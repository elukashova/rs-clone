/* eslint-disable max-len */
import Loader from '../loader';
import User, { Endpoints, LogIn, Methods, SignUp, Token } from '../loader.types';

export const createUser = (params: SignUp): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Signup, params);

export const loginUser = (params: LogIn): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Login, params);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getUser = (token: Token): Promise<User> => Loader.getUserData(Methods.Get, Endpoints.GetUser, token);
