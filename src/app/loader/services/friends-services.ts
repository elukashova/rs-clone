/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import Loader from '../loader';
import { Endpoints, FriendId, Methods, Token } from '../loader-requests.types';
import { FriendData } from '../loader-responses.types';

export const getFriends = (token: Token): Promise<FriendData[]> => Loader.getData(Methods.Get, Endpoints.GetFriends, token);

export const getNotFriends = (token: Token): Promise<FriendData[]> => Loader.getData(Methods.Get, Endpoints.GetNotFriends, token);

export const addFriend = (token: Token, params: FriendId): Promise<void> => Loader.postData(Methods.Post, Endpoints.AddFriend, params, token);

export const deleteFriend = (token: Token, params: FriendId): Promise<void> => Loader.deleteData(Methods.Delete, Endpoints.DeleteFriend, params, token);
