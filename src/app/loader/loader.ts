import { RequestData } from './loader.types';

export default class Loader {
  private static server: string = 'https://the-big-bug-theory-be.onrender.com';

  private static errorHandler(res: Response): Response {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res;
  }

  private static async load(url: URL, method: string, params?: RequestData): Promise<Response> {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: params ? JSON.stringify(params) : undefined,
    }).then((res: Response) => this.errorHandler(res));
  }

  public static async postData<T>(method: string, view: string, params?: RequestData): Promise<T> {
    const url: URL = Loader.createURL(view);

    return this.load(url, method, params).then((res: Response) => res.json());
  }

  private static createURL = (view: string): URL => {
    const url: URL = new URL(view, Loader.server);
    return url;
  };
}
