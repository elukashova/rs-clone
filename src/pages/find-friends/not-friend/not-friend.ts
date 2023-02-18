import './not-friend.css';
import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import { getClassNames } from '../../../utils/utils';
import { UserData } from '../type-friends';

export default class NotFriend extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    activities: 'findFriends.activities',
    subscribeBtn: 'findFriends.subscribeBtn',
  };

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

  private userData = new BaseComponent('div', this.element, 'not-friend__user-data');

  private activityData = new BaseComponent('div', this.element, 'not-friend__activity-data');

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
      this.countOffActivity = userData.countOffActivity;
    }
    this.renderElements();
  }

  private renderElements(): void {
    this.avatar = new Avatar(this.avatarContainer.element, 'not-friend__avatar', {
      src: this.avatarUrl || './assets/images/avatars/default.png',
    });

    this.userName = new BaseComponent('h4', this.userData.element, 'not-friend__username', `${this.username}`);

    this.userCountry = new BaseComponent(
      'p',
      this.userData.element,
      'not-friend__user-country',
      `${this.country}` || '',
    );
    this.subscribeButton = new Button(this.userData.element, this.dictionary.subscribeBtn, 'not-friend__button');

    const activityInfo = new BaseComponent(
      'p',
      this.activityData.element,
      'not-friend__activity-text',
      'Activities', // не будет работать
    );
    this.activityCount = new BaseComponent(
      'p',
      activityInfo.element,
      'not-friend__activity-data',
      `${this.countOffActivity}` || '0',
    );
  }
}
