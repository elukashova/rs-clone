import { ActivityResponse } from '../app/loader/loader-responses.types';

export type EventData = {
  [key: string]: string | number | boolean | ActivityResponse[];
};
