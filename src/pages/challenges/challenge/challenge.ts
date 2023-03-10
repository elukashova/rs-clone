/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import i18next from 'i18next';
import { Token } from '../../../app/loader/loader-requests.types';
import { updateUser } from '../../../app/loader/services/user-services';
import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import Picture from '../../../components/base-component/picture/picture';
import Svg from '../../../components/base-component/svg/svg';
import { ProjectColors } from '../../../utils/consts';
import eventEmitter from '../../../utils/event-emitter';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import DefaultUserInfo from '../../dashboard/left-menu/left-menu.types';

export default class Challenge extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    challengeEnd: 'challenges.challengeEnd',
    challengeOver: 'challenges.challengeOver',
    acceptButton: 'challenges.acceptButton',
    acceptedButton: 'challenges.acceptedButton',
    friendsInChallenge: 'challenges.friendsInChallenge',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  public type: string;

  public challengeImage!: Picture;

  public title!: BaseComponent<'h4'>;

  public descriptionBlock!: BaseComponent<'div'>;

  public activityIcon!: Svg;

  public description!: BaseComponent<'p'>;

  public friends!: BaseComponent<'p'>;

  public button!: Button;

  public friendsBlock!: BaseComponent<'div'>;

  public avatar!: Avatar;

  public avatarData: string[];

  public countOfFriends: number;

  public titleText: string;

  public descriptionText: string;

  public dateText: string[];

  public allTypes: string[];

  public dateBlock!: BaseComponent<'div'>;

  public dateStart!: BaseComponent<'span'>;

  public dateEnd!: BaseComponent<'span'>;

  public dateToEnd!: BaseComponent<'span'>;

  public progress: boolean;

  public avatarsBlock!: BaseComponent<'div'>;

  public challengeIsAdded = false;

  constructor(
    parent: HTMLElement,
    type: string,
    allTypes: string[],
    avatarData: string[],
    title: string,
    description: string,
    date: string[],
    progress: boolean,
    attributes?: {
      [key: string]: string;
    },
  ) {
    super('div', parent, 'challenge', '', attributes);
    this.type = type;
    this.avatarData = avatarData;
    this.countOfFriends = this.avatarData.length;
    this.titleText = title;
    this.descriptionText = description;
    this.dateText = date;
    this.allTypes = allTypes;
    this.progress = progress;
    this.renderChallenge();
  }

  private renderChallenge(): void {
    this.challengeImage = new Picture(this.element, 'challenge__image', {
      src: `../../../assets/images/challenges/${this.type}.jpg`,
      alt: 'challenge',
    });
    this.title = new BaseComponent('h4', this.element, 'challenge__title', this.titleText);

    this.descriptionBlock = new BaseComponent('div', this.element, 'challenge__description-block');

    this.allTypes.forEach((type: string): void => {
      this.activityIcon = new Svg(
        this.descriptionBlock.element,
        type,
        ProjectColors.Grey,
        `${this.type}-icon challenges-activity__svg`,
      );
    });

    this.description = new BaseComponent(
      'p',
      this.descriptionBlock.element,
      'challenge__description',
      this.descriptionText,
    );

    const [start, end]: string[] = this.dateText;
    const dateToEnd: number = Challenge.getDaysToEnd(end);
    this.dateBlock = new BaseComponent('div', this.descriptionBlock.element, 'challenge__date-block');
    this.dateStart = new BaseComponent('span', this.dateBlock.element, 'challenge__date-start', `${start}`);
    this.dateEnd = new BaseComponent('span', this.dateBlock.element, 'challenge__date-end', ` - ${end}`);
    if (dateToEnd > 1) {
      this.dateToEnd = new BaseComponent(
        'span',
        this.descriptionBlock.element,
        'challenge__days-to-end',
        i18next.t(this.dictionary.challengeEnd, { count: dateToEnd }).toString(),
      );
      i18next.on('languageChanged', () => {
        // eslint-disable-next-line max-len
        this.dateToEnd.element.textContent = i18next.t(this.dictionary.challengeEnd, { count: dateToEnd });
      });
    } else {
      this.dateToEnd = new BaseComponent(
        'span',
        this.descriptionBlock.element,
        'challenge__days-to-end',
        `${this.dictionary.challengeOver}`,
      );
    }

    this.friendsBlock = new BaseComponent('div', this.element, 'challenge__friends-block');
    this.avatarsBlock = new BaseComponent('div', this.friendsBlock.element, 'challenge__avatars-block');
    this.checkFriendsAndRender();
    if (this.avatarData.length) {
      this.friends = new BaseComponent(
        'p',
        this.friendsBlock.element,
        'challenge__friend',
        i18next.t(this.dictionary.friendsInChallenge, { count: this.avatarData.length }).toString(),
      );
      i18next.on('languageChanged', () => {
        this.friends.element.textContent = i18next
          .t(this.dictionary.friendsInChallenge, { count: this.avatarData.length })
          .toString();
      });
    }
    this.button = new Button(this.element, this.dictionary.acceptButton, 'challenge__button');
    this.addListeners();
  }

  public checkFriendsAndRender(): void {
    switch (this.avatarData.length) {
      case 1:
        this.addAvatar(this.avatarData[0]);
        break;
      case 2:
      case 3:
        this.avatarData.forEach((data: string): void => this.addAvatar(data));
        break;
      default:
        this.avatarData.forEach((data: string, index: number): void => {
          if (index < 3) {
            this.addAvatar(data);
          }
        });
        break;
    }
  }

  private addAvatar(avatarUrl: string): void {
    const newAvatar: Avatar = new Avatar(this.avatarsBlock.element, 'challenge__friend-avatar', {
      src: avatarUrl || DefaultUserInfo.DefaultUrl,
    });
  }

  private static getDaysToEnd(date2: string): number {
    const startDate: Date = new Date(Date.now());
    const endDate: Date = new Date(Date.parse(date2));
    const timeDifference: number = endDate.getTime() - startDate.getTime();
    const daysToEnd: number = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysToEnd;
  }

  private addListeners(): void {
    this.button.element.addEventListener('click', (): void => {
      this.setButtonFunction();
    });
  }

  public setButtonFunction(): void {
    if (this.challengeIsAdded === false) {
      this.button.element.style.backgroundColor = ProjectColors.Orange;
      this.button.textContent = this.dictionary.acceptedButton;
      this.challengeIsAdded = true;
    } else {
      this.button.element.style.backgroundColor = ProjectColors.Turquoise;
      this.button.textContent = this.dictionary.acceptButton;
      this.challengeIsAdded = false;
    }
  }
}
