import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import eventEmitter from '../../../utils/event-emitter';
import { ProjectColors } from '../../../utils/consts';
import BaseFriend from '../base-friend';
import { FriendData, Token } from '../../../app/loader/loader.types';
import { checkDataInLocalStorage } from '../../../utils/local-storage';

export default class Friend extends BaseFriend {
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
    });
    this.userName = new BaseComponent('h4', this.userData.element, 'friend__username', `${this.username}`);
    this.userCountry = new BaseComponent('p', this.userData.element, 'friend__user-country', `${this.country}` || '');
    this.unsubscribeButton = new Button(this.element, 'Unsubscribe', 'friend__button');
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
      eventEmitter.emit('addFriend', {});
      this.setButtonFunction();
    }
  };

  private deleteFriendCallback = (): void => {
    if (this.token) {
      Friend.deleteFriend(this.token, this.requestInfo);
      this.friendsIsAdded = false;
      eventEmitter.emit('deleteFriend', {});
      this.setButtonFunction();
    }
  };

  private setButtonFunction(): void {
    console.log(this.unsubscribeButton);
    if (this.friendsIsAdded === false) {
      this.unsubscribeButton.element.style.backgroundColor = ProjectColors.Orange;
      this.unsubscribeButton.element.textContent = 'Subscribe';
      this.unsubscribeButton.element.removeEventListener('click', this.deleteFriendCallback);
      this.unsubscribeButton.element.addEventListener('click', this.addFriendCallback);
    } else {
      this.unsubscribeButton.element.style.backgroundColor = ProjectColors.Grey;
      this.unsubscribeButton.element.textContent = 'Unsubscribe';
      this.unsubscribeButton.element.removeEventListener('click', this.addFriendCallback);
      this.unsubscribeButton.element.addEventListener('click', this.deleteFriendCallback);
    }
  }
}
