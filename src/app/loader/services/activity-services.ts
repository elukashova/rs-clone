/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import Loader from '../loader';
import { Activity, Endpoints, Methods, Token, UpdateActivity } from '../loader-requests.types';

export const createActivity = (params: Activity, token: Token): Promise<Activity> =>
  Loader.postData(Methods.Post, Endpoints.AddActivity, params, token);

export const updateActivity = (id: number, params: UpdateActivity, token: Token): Promise<void> =>
  Loader.putData(Methods.Put, `${Endpoints.UpdateActivity}${id}`, params, token);
