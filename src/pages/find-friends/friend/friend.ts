import './friend.css';
import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import { getClassNames } from '../../../utils/utils';
import { UserData } from '../type-not-friend';

export default class Friend extends BaseComponent<'div'> {
  private avatarUrl: string | undefined;

  private country: string | undefined;

  private username: string | undefined;

  private avatar?: Avatar;

  private userName?: BaseComponent<'h4'>;

  private userCountry?: BaseComponent<'p'>;

  private subscribeButton?: Button;

  private avatarContainer = new BaseComponent('div', this.element, 'friend__avatar-container');

  private userData = new BaseComponent('div', this.element, 'friend__user-data');

  constructor(
    parent: HTMLElement,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
    userData?: UserData,
  ) {
    const classes = getClassNames('icon', additionalClasses);
    super('div', parent, classes, '', attributes);
    if (userData) {
      this.avatarUrl = userData.avatarUrl;
      this.country = userData.country;
      this.username = userData.username;
    }
    this.renderElements();
  }

  private renderElements(): void {
    this.avatar = new Avatar(this.avatarContainer.element, 'friend__avatar', {
      src: this.avatarUrl || './assets/images/avatars/default.png',
    });

    this.userName = new BaseComponent('h4', this.userData.element, 'friend__username', `${this.username}`);

    this.userCountry = new BaseComponent('p', this.userData.element, 'friend__user-country', `${this.country}` || '');
    this.subscribeButton = new Button(this.element, 'Unsubscribe', 'friend__button');
  }
}
