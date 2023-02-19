/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import Loader from '../loader';
import { Endpoints, LogIn, Methods, SignUp, Token, UpdateUserData } from '../loader-requests.types';
import { User } from '../loader-responses.types';

export const createUser = (params: SignUp): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Signup, params);

export const loginUser = (params: LogIn): Promise<Token> => Loader.postData(Methods.Post, Endpoints.Login, params);

export const getUser = (token: Token): Promise<User> => Loader.getData(Methods.Get, Endpoints.GetUser, token);

export const updateUser = (token: Token, params: UpdateUserData): Promise<User> =>
  Loader.putData(Methods.Put, Endpoints.UpdateUser, params, token);
