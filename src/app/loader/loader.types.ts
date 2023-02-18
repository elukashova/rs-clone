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
export type RequestData = SignUp | LogIn | FriendId | Activity | UpdateRequestData | CreateCommentRequest;

export enum Endpoints {
  Login = 'auth/signin',
  Signup = 'auth/signup',
  GetUser = 'auth/me',
  UpdateUser = 'update',
  GetFriends = 'friends',
  GetNotFriends = 'no-friends',
  AddFriend = 'friends',
  DeleteFriend = 'friends',
  AddActivity = 'activity',
  GetAllActivities = 'activity',
  GetOneActivity = 'activity/',
  UpdateActivity = 'activity/',
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

export enum Errors {
  UserAlreadyExists = '409',
  Unauthorized = '401',
  NotFound = '404',
}

export type User = {
  avatarUrl: string;
  bio: string;
  country: string;
  email: string;
  id: string;
  username: string;
  following: FriendData[];
  followedBy: FriendData[];
  activities: Activity[];
};

export type FriendData = {
  id: string;
  username: string;
  country?: string;
  avatarUrl: string;
  activities: Activity[];
};

export enum SportType {
  RUNNING = 'running',
  HIKING = 'hiking',
  WALKING = 'walking',
  CYCLING = 'cycling',
}

export type Comment = {
  body: string;
  username: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Activity = {
  id: number;
  time: string;
  date: string;
  title: string;
  elevation: string;
  duration: string;
  sport: string;
  description?: string;
  distance?: string;
  companionId?: string;
  travelMode?: string;
  startPoint?: string;
  endPoint?: string;
  mapId?: string;
  kudos?: string[];
  comments?: Comment[];
  route?: {
    startPoint?: string;
    endPoint?: string;
    id?: number;
    mapId?: string;
    travelMode?: string;
  };
};

export type UpdateUserData = {
  avatarUrl?: string;
  bio?: string;
  country?: string;
  email?: string;
  id?: string;
  username?: string;
};

export type UpdateActivity = {
  kudos?: boolean;
};

export type CreateCommentRequest = {
  activityId: number;
  body: string;
};

export type CommentResponse = {
  id: number;
  body: string;
  createdAt: Date;
  userId: string;
  avatarUrl: string;
  username: string;
};

export type UpdateRequestData = UpdateUserData | UpdateActivity;
