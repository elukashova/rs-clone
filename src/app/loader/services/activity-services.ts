/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import Loader from '../loader';
import { Endpoints, Methods, Token, UpdateActivity, ActivityRequest } from '../loader-requests.types';
import { ActivityResponse } from '../loader-responses.types';

export const createActivity = (params: ActivityRequest, token: Token): Promise<ActivityResponse> =>
  Loader.postData(Methods.Post, Endpoints.AddActivity, params, token);

export const updateActivity = (id: number, params: UpdateActivity, token: Token): Promise<void> =>
  Loader.putData(Methods.Put, `${Endpoints.UpdateActivity}${id}`, params, token);

export const deleteActivity = (id: number): Promise<void> =>
  Loader.deleteData(Methods.Delete, `${Endpoints.DeleteActivity}${id}`);
