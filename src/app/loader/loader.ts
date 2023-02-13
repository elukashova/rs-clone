// import { PRODUCTION_ENV } from '../../utils/consts';
import { RequestData, Token, LoadRequest, Methods, UpdateUserData } from './loader.types';
import { DEVELOPMENT_ENV } from '../../utils/consts';

export default class Loader {
  // DEVELOPMENT_ENV
  // PRODUCTION_ENV
  private static server: string = DEVELOPMENT_ENV;

  private static errorHandler(response: Response): Response {
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    return response;
  }

  private static load(request: LoadRequest): Promise<Response> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(request.token && { Authorization: `Bearer ${request.token}` }),
    };

    const { method } = request;

    return fetch(request.url, {
      method,
      headers,
      ...(request.params && { body: JSON.stringify(request.params) }),
    }).then((response: Response) => this.errorHandler(response));
  }

  public static postData<T>(method: Methods, view: string, params?: RequestData): Promise<T> {
    const url: URL = Loader.createURL(view);

    return this.load({ url, method, params }).then((response: Response) => response.json());
  }

  // eslint-disable-next-line max-len
  public static getUserData<T>(method: Methods, view: string, { token }: Token): Promise<T> {
    const url: URL = Loader.createURL(view);
    return this.load({ url, method, token }).then((response: Response) => response.json());
  }

  // eslint-disable-next-line max-len
  public static putUserData<T>(method: Methods, view: string, params: UpdateUserData): Promise<T> {
    const url: URL = Loader.createURL(view);
    return this.load({ url, method, params }).then((response: Response) => response.json());
  }

  private static createURL = (view: string): URL => {
    const url: URL = new URL(view, Loader.server);
    return url;
  };
}
