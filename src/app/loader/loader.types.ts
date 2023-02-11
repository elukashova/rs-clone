export interface LogIn {
  email: string;
  google: boolean;
  password?: string;
}

export interface SignUp extends LogIn {
  username: string;
  country?: string;
  avatarUrl?: string;
}

export type Token = {
  token: string;
};

export type RequestData = SignUp | LogIn;

export enum Endpoints {
  Login = 'auth/signin',
  Signup = 'auth/signup',
  GetUser = 'auth/me',
}

export type LoadRequest = {
  url: URL;
  method: string;
  params?: RequestData;
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
}

type User = {
  avatarUrl: string;
  bio: string;
  country: string;
  created_at: string;
  email: string;
  id: string;
  updated_at: string;
  username: string;
};

export default User;

export enum SportType {
  RUNNING = 'Забег',
  HIKING = 'Хайк',
  WALKING = 'Ходьба',
  BIKING = 'Велопрогулка',
}

export type Route = {
  id: number;
  user_id: string;
  user: User;
  route_data: string;
  title: string;
  sport: SportType;
  description: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  location: Location;
  activity: Activity;
};

export type Location = {
  id: number;
  latitude: number;
  longtitude: number;
  route_id: number;
  route: Route;
  order: number;
  created_at: Date;
  updated_at: Date;
};

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
  id: number;
  user_id: string;
  user: User;
  sport: SportType;
  title: string;
  time: string;
  distance: string;
  elevation: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
  location?: string;
};
