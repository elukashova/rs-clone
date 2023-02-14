/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import Loader from '../loader';
import { User, Endpoints, LogIn, Methods, SignUp, Token, UpdateUserData } from '../loader.types';

export const createUser = (params: SignUp): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Signup, params);

export const loginUser = (params: LogIn): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Login, params);

export const getUser = (token: Token): Promise<User> => Loader.getUserData(Methods.Get, Endpoints.GetUser, token);

export const updateUser = (token: Token, params: UpdateUserData): Promise<User> =>
  Loader.putUserData(Methods.Put, Endpoints.UpdateUser, params, token);
