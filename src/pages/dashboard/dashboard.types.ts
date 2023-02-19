import { ActivityResponse } from '../../app/loader/loader-responses.types';

interface ActivityDataForPosts extends ActivityResponse {
  username: string;
  avatarUrl: string;
}

export default ActivityDataForPosts;
