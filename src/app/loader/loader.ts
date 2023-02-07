import { PRODUCTION_ENV } from '../../utils/consts';
import { RequestData, Token, LoadRequest, Methods } from './loader.types';

export default class Loader {
  // DEVELOPMENT_ENV
  // PRODUCTION_ENV
  private static server: string = PRODUCTION_ENV;

  private static errorHandler(response: Response): Response {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  }

  private static load(request: LoadRequest): Promise<Response> {
    const headers: HeadersInit | undefined = !request.token
      ? { 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json', Authorization: `Bearer ${request.token}` };

    const { method } = request;

    return fetch(request.url, {
      method,
      headers,
      ...(request.params && { body: JSON.stringify(request.params) }),
    }).then((response: Response) => this.errorHandler(response));
  }

  public static postData<T>(method: Methods, view: string, params?: RequestData): Promise<T> {
    const url: URL = Loader.createURL(view);

    return this.load({ url, method, params }).then((res: Response) => res.json());
  }

  public static getUserData<T>(method: Methods, view: string, jwtObj: Token): Promise<T> {
    const url: URL = Loader.createURL(view);
    const { token } = jwtObj;
    return this.load({ url, method, token }).then((res: Response) => res.json());
  }

  private static createURL = (view: string): URL => {
    const url: URL = new URL(view, Loader.server);
    return url;
  };
}
