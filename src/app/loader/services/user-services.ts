import Loader from '../loader';
import { Endpoints, LogIn, SignUp, Token } from '../loader.types';

export const createUser = (params: SignUp): Promise<Token> => Loader.postData('POST', Endpoints.Signup, params);

export const loginUser = (params: LogIn): Promise<Token> => Loader.postData('POST', Endpoints.Login, params);

// TODO: типизировать получаемый промис
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getUser = (token: Token) => Loader.getUserData('GET', Endpoints.GetUser, token);
