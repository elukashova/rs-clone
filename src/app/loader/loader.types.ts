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

export type RequestData = SignUp | LogIn | FriendId | Activity;

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
  GetOneActivity = 'activity/', // необходимо приписывать айди активности
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
  following: Following[];
  followedBy: Follower[];
  activities: Activity[];
};

type Follower = {
  follower: Follow;
};

type Following = {
  following: Follow;
};

type Follow = {
  id: string;
  username: string;
  country: string;
  avatar_url: string;
};

export type FriendData = {
  id: string;
  username: string;
  country?: string;
  avatarUrl: string;
};

export enum SportType {
  RUNNING = 'running',
  HIKING = 'hiking',
  WALKING = 'walking',
  CYCLING = 'cycling',
}

// export type Route = {
//   id: number;
//   user_id: string;
//   user: User;
//   route_data: string;
//   title: string;
//   sport: SportType;
//   description: string;
//   date: Date;
//   created_at: Date;
//   updated_at: Date;
//   location: Location;
//   activity: Activity;
// };

// export type Location = {
//   id: number;
//   latitude: number;
//   longtitude: number;
//   route_id: number;
//   route: Route;
//   order: number;
//   created_at: Date;
//   updated_at: Date;
// };

export type Kudo = {
  id: number;
  activity_id: number;
  activity: Activity;
  user_id: string;
  user: User;
  created_at: Date;
  updated_at: Date;
};

export type Comment = {
  id: number;
  body: string;
  user_id: string;
  user: User;
  activity_id: number;
  activity: Activity;
  created_at: Date;
  updated_at: Date;
};

export type Activity = {
  time: string;
  date: string;
  title: string;
  elevation: string;
  duration: string;
  sport: string;
  description?: string;
  distance?: string;
  companionId?: string;
  startLat?: string;
  startLng?: string;
  endLat?: string;
  endLng?: string;
  location?: string;
  travelMode?: string;
};

export type UpdateUserData = {
  avatar_url?: string;
  bio?: string;
  country?: string;
  email?: string;
  id?: string;
  username?: string;
};
