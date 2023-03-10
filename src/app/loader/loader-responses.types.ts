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
  birth: string;
  gender: string;
  following: FriendData[];
  followedBy: FriendData[];
  activities: ActivityResponse[];
  challenges: string[];
  sportTypes: string[];
};

export type CommentResponse = {
  id: number;
  body: string;
  createdAt: Date;
  userId: string;
  avatarUrl: string;
  username: string;
  likes: string[];
};

interface ActivityDataForPosts {
  username: string;
  avatarUrl: string;
  userId: string;
}

export interface ActivityResponse extends ActivityDataForPosts {
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
  kudos?: Kudo[];
  comments?: CommentResponse[];
  route?: {
    startPoint?: string;
    endPoint?: string;
    id?: number;
    mapId?: string;
    travelMode?: string;
  };
}

export type FriendData = {
  id: string;
  username: string;
  country?: string;
  avatarUrl: string;
  activities: ActivityResponse[];
  challenges: string[];
};

export type Kudo = {
  userId: string;
  avatarUrl: string;
  createdAt: string;
};
