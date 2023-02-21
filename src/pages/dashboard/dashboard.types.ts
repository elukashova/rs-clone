import { ActivityResponse } from '../../app/loader/loader-responses.types';

interface ActivityDataForPosts extends ActivityResponse {
  username: string;
  avatarUrl: string;
  userId: string;
}

export default ActivityDataForPosts;
