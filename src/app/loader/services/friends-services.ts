/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import Loader from '../loader';
import { Endpoints, FriendData, FriendId, Methods, Token } from '../loader.types';

export const getFriends = (token: Token): Promise<FriendData[]> => Loader.getUserData(Methods.Get, Endpoints.GetFriends, token);

export const getNotFriends = (token: Token): Promise<FriendData[]> => Loader.getUserData(Methods.Get, Endpoints.GetNotFriends, token);

export const addFriend = (id: string, params: FriendId): Promise<void> => Loader.postData(Methods.Post, `${Endpoints.AddFriend}${id}`, params);

export const deleteFriend = (id: string, params: FriendId): Promise<void> => Loader.deleteData(Methods.Delete, `${Endpoints.Deletefriend}${id}`, params);
