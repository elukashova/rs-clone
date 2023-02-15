/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
import Loader from '../loader';
import { Activity, Endpoints, Methods, Token } from '../loader.types';

export const createActivity = (params: Activity, token: Token): Promise<Activity> =>
  Loader.postData(Methods.Post, Endpoints.AddActivity, params, token);
