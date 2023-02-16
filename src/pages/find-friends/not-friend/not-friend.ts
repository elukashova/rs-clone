import './not-friend.css';
import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import { getClassNames } from '../../../utils/utils';
import { FriendData, FriendId, Token } from '../../../app/loader/loader.types';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import { addFriend, deleteFriend } from '../../../app/loader/services/friends-services';
import eventEmitter from '../../../utils/event-emitter';
import { ProjectColors } from '../../../utils/consts';

export default class NotFriend extends BaseComponent<'div'> {
  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  public avatarUrl: string | undefined;

  public country: string | undefined;

  public username: string | undefined;

  public countOffActivity: number | undefined;

  public avatar?: Avatar;

  public userName!: BaseComponent<'h4'>;

  public userCountry?: BaseComponent<'p'>;

  public subscribeButton!: Button;

  public activityCount?: BaseComponent<'p'>;

  private avatarContainer = new BaseComponent('div', this.element, 'not-friend__avatar-container');

  private userDataBlock = new BaseComponent('div', this.element, 'not-friend__user-data');

  private activityData = new BaseComponent('div', this.element, 'not-friend__activity-data');

  private userId!: string;

  private notFriendsIsAdded = false;

  private requestInfo = {
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
      this.countOffActivity = userData.activities.length || 0;
      this.userId = userData.id;
      this.requestInfo.friendId = this.userId;
    }
    this.renderElements();
    this.addListeners();
  }

  private renderElements(): void {
    this.avatar = new Avatar(this.avatarContainer.element, 'not-friend__avatar', {
      src: this.avatarUrl || './assets/images/avatars/default.png',
    });

    this.userName = new BaseComponent('h4', this.userDataBlock.element, 'not-friend__username', `${this.username}`);

    this.userCountry = new BaseComponent(
      'p',
      this.userDataBlock.element,
      'not-friend__user-country',
      `${this.country}` || '',
    );
    this.subscribeButton = new Button(this.userDataBlock.element, 'Subscribe', 'not-friend__button');

    const activityInfo = new BaseComponent('p', this.activityData.element, 'not-friend__activity-text', 'Activities');
    this.activityCount = new BaseComponent(
      'p',
      activityInfo.element,
      'not-friend__activity-data',
      `${this.countOffActivity}` || '0',
    );
  }

  private addListeners(): void {
    this.subscribeButton.element.addEventListener('click', (): void => {
      this.addFriendCallback();
    });
  }

  private addFriendCallback = (): void => {
    if (this.token) {
      NotFriend.addNewFriend(this.token, this.requestInfo);
      this.notFriendsIsAdded = true;
      eventEmitter.emit('addFriend', {});
      this.setButtonFunction();
    }
  };

  private deleteFriendCallback = (): void => {
    if (this.token) {
      NotFriend.deleteFriend(this.token, this.requestInfo);
      this.notFriendsIsAdded = false;
      eventEmitter.emit('friendDeleted', {});
      this.setButtonFunction();
    }
  };

  private static addNewFriend(token: Token, data: FriendId): Promise<void> {
    return addFriend(token, data);
  }

  private static deleteFriend(token: Token, data: FriendId): Promise<void> {
    return deleteFriend(token, data);
  }

  private setButtonFunction(): void {
    console.log(this.subscribeButton);
    if (this.notFriendsIsAdded === false) {
      this.subscribeButton.element.style.backgroundColor = ProjectColors.LightTurquoise;
      this.subscribeButton.element.textContent = 'Subscribe';
      this.subscribeButton.element.removeEventListener('click', this.deleteFriendCallback);
      this.subscribeButton.element.addEventListener('click', this.addFriendCallback);
    } else {
      this.subscribeButton.element.style.backgroundColor = ProjectColors.Orange;
      this.subscribeButton.element.textContent = 'Unsubscribe';
      this.subscribeButton.element.removeEventListener('click', this.addFriendCallback);
      this.subscribeButton.element.addEventListener('click', this.deleteFriendCallback);
    }
  }
}
