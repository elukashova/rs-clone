import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import { ProjectColors } from '../../../utils/consts';
import BaseFriend from '../base-friend';
import { Token } from '../../../app/loader/loader-requests.types';
import { FriendData } from '../../../app/loader/loader-responses.types';
import { checkDataInLocalStorage } from '../../../utils/local-storage';

export default class Friend extends BaseFriend {
  private dictionary: Record<string, string> = {
    unsubscribeBtn: 'findFriends.unsubscribeBtn',
    subscribeBtn: 'findFriends.subscribeBtn',
  };

  public token: Token | null = checkDataInLocalStorage('userSessionToken');

  public unsubscribeButton!: Button;

  private avatarContainer = new BaseComponent('div', this.element, 'friend__avatar-container');

  private userData = new BaseComponent('div', this.element, 'friend__user-data');

  private friendsIsAdded = true;

  constructor(
    parent: HTMLElement,
    userData: FriendData,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    super(parent, userData, additionalClasses, attributes);
    this.friendsIsAdded = false;
    this.renderElements();
    this.addListeners();
  }

  private renderElements(): void {
    this.avatar = new Avatar(this.avatarContainer.element, 'friend__avatar', {
      src: this.avatarUrl || './assets/images/avatars/default.png',
      alt: 'avatar',
    });
    this.userName = new BaseComponent('h4', this.userData.element, 'friend__username', `${this.username}`);
    this.userCountry = new BaseComponent('p', this.userData.element, 'friend__user-country', `${this.country}` || '');
    this.unsubscribeButton = new Button(this.element, this.dictionary.unsubscribeBtn, 'friend__button');
  }

  private addListeners(): void {
    this.unsubscribeButton.element.addEventListener('click', (): void => {
      this.deleteFriendCallback();
    });
  }

  private addFriendCallback = (): void => {
    if (this.token) {
      Friend.addNewFriend(this.token, this.requestInfo);
      this.friendsIsAdded = true;
      this.setButtonFunction();
    }
  };

  private deleteFriendCallback = (): void => {
    if (this.token) {
      Friend.deleteFriend(this.token, this.requestInfo);
      this.friendsIsAdded = false;
      this.setButtonFunction();
    }
  };

  private setButtonFunction(): void {
    if (this.friendsIsAdded === false) {
      this.unsubscribeButton.element.style.backgroundColor = ProjectColors.Orange;
      this.unsubscribeButton.textContent = this.dictionary.subscribeBtn;
      this.unsubscribeButton.element.removeEventListener('click', this.deleteFriendCallback);
      this.unsubscribeButton.element.addEventListener('click', this.addFriendCallback);
    } else {
      this.unsubscribeButton.element.style.backgroundColor = ProjectColors.Grey;
      this.unsubscribeButton.textContent = this.dictionary.unsubscribeBtn;
      this.unsubscribeButton.element.removeEventListener('click', this.addFriendCallback);
      this.unsubscribeButton.element.addEventListener('click', this.deleteFriendCallback);
    }
  }
}
