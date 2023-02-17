import { FriendData, FriendId, Token } from '../../app/loader/loader.types';
import { addFriend, deleteFriend } from '../../app/loader/services/friends-services';
import Avatar from '../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../components/base-component/base-component';
import { getClassNames } from '../../utils/utils';

export default class BaseFriend extends BaseComponent<'div'> {
  public avatarUrl: string | undefined;

  public country: string | undefined;

  public username: string | undefined;

  public avatar?: Avatar;

  public userName?: BaseComponent<'h4'>;

  public userCountry?: BaseComponent<'p'>;

  public userId!: string;

  public requestInfo = {
    friendId: '',
  };

  constructor(
    parent: HTMLElement,
    userData: FriendData,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    const classes = getClassNames('icon', additionalClasses);
    super('div', parent, classes, '', attributes);

    if (userData) {
      this.avatarUrl = userData.avatarUrl;
      this.country = userData.country || '';
      this.username = userData.username;
      this.userId = userData.id;
      this.requestInfo.friendId = this.userId;
    }
  }

  public static addNewFriend(token: Token, data: FriendId): Promise<void> {
    return addFriend(token, data);
  }

  public static deleteFriend(token: Token, data: FriendId): Promise<void> {
    return deleteFriend(token, data);
  }
}
