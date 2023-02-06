import { RequestData, Token, LoadRequest } from './loader.types';

export default class Loader {
  // http://localhost:3000
  // https://the-big-bug-theory-be.onrender.com'
  private static server: string = 'http://localhost:3000';

  private static errorHandler(res: Response): Response {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res;
  }

  private static async load(request: LoadRequest): Promise<Response> {
    const headers: HeadersInit | undefined = !request.token
      ? { 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json', Authorization: `Bearer ${request.token}` };

    const { method } = request;

    return fetch(request.url, {
      method,
      headers,
      body: request.params ? JSON.stringify(request.params) : undefined,
    }).then((res: Response) => this.errorHandler(res));
  }

  public static async postData<T>(method: string, view: string, params?: RequestData): Promise<T> {
    const url: URL = Loader.createURL(view);

    console.log(params);

    return this.load({ url, method, params }).then((res: Response) => res.json());
  }

  public static async getUserData<T>(method: string, view: string, jwtObj: Token): Promise<T> {
    const url: URL = Loader.createURL(view);
    const { token } = jwtObj;
    return this.load({ url, method, token }).then((res: Response) => res.json());
  }

  private static createURL = (view: string): URL => {
    const url: URL = new URL(view, Loader.server);
    return url;
  };
}
