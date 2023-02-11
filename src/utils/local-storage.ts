import { Token } from '../app/loader/loader.types';

export const checkDataInLocalStorage = <T>(key: string): T | null => {
  const response: string | null = localStorage.getItem(key);
  if (response) {
    try {
      return JSON.parse(response);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const setDataToLocalStorage = (data: Token | string, key: string): void => {
  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(data));
};
