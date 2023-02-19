import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import { Token } from '../../../app/loader/loader-requests.types';
import { FriendData } from '../../../app/loader/loader-responses.types';
import { ProjectColors } from '../../../utils/consts';
import BaseFriend from '../base-friend';
import { checkDataInLocalStorage } from '../../../utils/local-storage';

export default class NotFriend extends BaseFriend {
  private dictionary: Record<string, string> = {
    activities: 'findFriends.activities',
    subscribeBtn: 'findFriends.subscribeBtn',
  };

  public token: Token | null = checkDataInLocalStorage('userSessionToken');

  public subscribeButton!: Button;

  public countOffActivity: number | undefined;

  public activityCount?: BaseComponent<'p'>;

  private avatarContainer = new BaseComponent('div', this.element, 'not-friend__avatar-container');

  private userDataBlock = new BaseComponent('div', this.element, 'not-friend__user-data');

  private activityData = new BaseComponent('div', this.element, 'not-friend__activity-data');

  private notFriendsIsAdded = false;

  constructor(
    parent: HTMLElement,
    userData: FriendData,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    super(parent, userData, additionalClasses, attributes);
    if (userData) {
      this.countOffActivity = userData.activities.length || 0;
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
    this.subscribeButton = new Button(this.userDataBlock.element, 'Follow', 'not-friend__button');
    const activityInfo = new BaseComponent('p', this.activityData.element, 'not-friend__activity-text', 'Activities');
    this.activityCount = new BaseComponent(
      'p',
      activityInfo.element,
      'not-friend__activity-data',
      `${this.countOffActivity}` || '0',
    );
  }

  private addListeners(): void {
    this.subscribeButton.element.addEventListener('click', this.addFriendCallback);
  }

  private addFriendCallback = (): void => {
    if (this.token) {
      NotFriend.addNewFriend(this.token, this.requestInfo);
      this.notFriendsIsAdded = true;
      this.setButtonFunction();
    }
  };

  private deleteFriendCallback = (): void => {
    if (this.token) {
      NotFriend.deleteFriend(this.token, this.requestInfo);
      this.notFriendsIsAdded = false;
      this.setButtonFunction();
    }
  };

  private setButtonFunction(): void {
    if (this.notFriendsIsAdded === false) {
      this.subscribeButton.element.style.backgroundColor = ProjectColors.Turquoise;
      this.subscribeButton.element.textContent = 'Follow';
      this.subscribeButton.element.removeEventListener('click', this.deleteFriendCallback);
      this.subscribeButton.element.addEventListener('click', this.addFriendCallback);
    } else {
      this.subscribeButton.element.style.backgroundColor = ProjectColors.Orange;
      this.subscribeButton.element.textContent = 'Unfollow';
      this.subscribeButton.element.removeEventListener('click', this.addFriendCallback);
      this.subscribeButton.element.addEventListener('click', this.deleteFriendCallback);
    }
  }
}
