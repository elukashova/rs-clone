import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import { FriendData, Token } from '../../../app/loader/loader.types';
import { ProjectColors } from '../../../utils/consts';
import BaseFriend from '../base-friend';
import { checkDataInLocalStorage } from '../../../utils/local-storage';

export default class NotFriend extends BaseFriend {
  public token: Token | null = checkDataInLocalStorage('userSessionToken');

  public subscribeButton!: Button;

  public countOffActivity: number | undefined;

  public activityCount?: BaseComponent<'p'>;

  public avatarContainer = new BaseComponent('div', this.element, 'not-friend__avatar-container');

  public userDataBlock = new BaseComponent('div', this.element, 'not-friend__user-data');

  public activityData = new BaseComponent('div', this.element, 'not-friend__activity-data');

  public notFriendsIsAdded = false;

  public typeChecker = 'NotFriend';

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

  public renderElements(): void {
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

  public addListeners(): void {
    this.subscribeButton.element.addEventListener('click', this.addFriendCallback);
  }

  public addFriendCallback = (): void => {
    if (this.token) {
      NotFriend.addNewFriend(this.token, this.requestInfo);
      this.notFriendsIsAdded = true;
      this.setButtonFunction();
    }
  };

  public deleteFriendCallback = (): void => {
    if (this.token) {
      NotFriend.deleteFriend(this.token, this.requestInfo);
      this.notFriendsIsAdded = false;
      this.setButtonFunction();
    }
  };

  public setButtonFunction(): void {
    console.log(this.subscribeButton);
    if (this.notFriendsIsAdded === false) {
      console.log(this.notFriendsIsAdded);
      this.subscribeButton.element.style.backgroundColor = ProjectColors.Turquoise;
      this.subscribeButton.element.textContent = 'Subscribe';
      this.subscribeButton.element.removeEventListener('click', this.deleteFriendCallback);
      this.subscribeButton.element.addEventListener('click', this.addFriendCallback);
    } else {
      console.log(this.notFriendsIsAdded);
      this.subscribeButton.element.style.backgroundColor = ProjectColors.Orange;
      this.subscribeButton.element.textContent = 'Unsubscribe';
      this.subscribeButton.element.removeEventListener('click', this.addFriendCallback);
      this.subscribeButton.element.addEventListener('click', this.deleteFriendCallback);
    }
  }
}
