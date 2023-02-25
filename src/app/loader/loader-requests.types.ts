export interface LogIn {
  email: string;
  google: boolean;
  password?: string;
}

export interface SignUp extends LogIn {
  username: string;
  avatarUrl?: string;
  country?: string;
}

export type Token = {
  token: string;
};

export type FriendId = {
  friendId: string;
};

// eslint-disable-next-line max-len
export type RequestData = SignUp | LogIn | FriendId | ActivityRequest | UpdateRequestData | CreateCommentRequest;

export enum Endpoints {
  Login = 'auth/signin',
  Signup = 'auth/signup',
  GetUser = 'auth/me',
  UpdateUser = 'user',
  DeleteUser = 'user',
  GetFriends = 'friends',
  GetNotFriends = 'no-friends',
  AddFriend = 'friends',
  DeleteFriend = 'friends',
  AddActivity = 'activity',
  GetAllActivities = 'activity',
  GetOneActivity = 'activity/',
  UpdateActivity = 'activity/',
  DeleteActivity = 'activity/',
  CreateComment = 'comment',
  UpdateComment = 'comment/',
  DeleteComment = 'comment/',
}

export type LoadRequest = {
  url: URL;
  method: string;
  params?: RequestData | UpdateUserData;
  token?: string;
};

export enum Methods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

export enum SportType { // используется только в мок - удалить потом
  RUNNING = 'running',
  HIKING = 'hiking',
  WALKING = 'walking',
  CYCLING = 'cycling',
}

export type ActivityRequest = {
  time: string;
  date: string;
  title: string;
  elevation: string;
  duration: string;
  sport: string;
  description?: string;
  distance?: string;
  companionId?: string;
  startPoint?: string;
  endPoint?: string;
  travelMode?: string;
  mapId?: string;
};

export type UpdateUserData = {
  avatarUrl?: string;
  bio?: string;
  country?: string;
  email?: string;
  id?: string;
  username?: string;
  birth?: string;
  gender?: string;
  challenges?: string[];
  sportTypes?: string[];
};

export type UpdateActivity = {
  kudos?: boolean;
};

export type CreateCommentRequest = {
  activityId: number;
  body: string;
};

export type UpdateComment = {
  body?: string;
  userId?: string;
  like?: boolean;
};

export type UpdateRequestData = UpdateUserData | UpdateActivity | UpdateComment;
