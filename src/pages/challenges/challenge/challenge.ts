/* eslint-disable max-lines-per-function */
import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import Picture from '../../../components/base-component/picture/picture';
import Svg from '../../../components/base-component/svg/svg';
import { ProjectColors } from '../../../utils/consts';

export default class Challenge extends BaseComponent<'div'> {
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
      /*  style: 'width:15rem; height: 100%', */
    });
    this.title = new BaseComponent('h4', this.element, 'challenge__title', `${this.titleText}`);

    this.descriptionBlock = new BaseComponent('div', this.element, 'challenge__description-block');

    this.allTypes.forEach((type) => {
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
      `${this.descriptionText}`,
    );

    const [start, end] = this.dateText;
    const dateToEnd = Challenge.getDaysToEnd(start, end);
    this.dateBlock = new BaseComponent('div', this.descriptionBlock.element, 'challenge__date-block');
    this.dateStart = new BaseComponent('span', this.dateBlock.element, 'challenge__date-start', `${start}`);
    this.dateEnd = new BaseComponent('span', this.dateBlock.element, 'challenge__date-end', ` - ${end}`);
    if (dateToEnd > 1) {
      this.dateToEnd = new BaseComponent(
        'span',
        this.descriptionBlock.element,
        'challenge__days-to-end',
        `To end of challenge are ${dateToEnd} days.`,
      );
    } else if (dateToEnd === 1) {
      this.dateToEnd = new BaseComponent(
        'span',
        this.descriptionBlock.element,
        'challenge__days-to-end',
        `To end of challenge is ${dateToEnd} day.`,
      );
    } else {
      this.dateToEnd = new BaseComponent(
        'span',
        this.descriptionBlock.element,
        'challenge__days-to-end',
        'Sorry, challenge is over',
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
        `Friends in challenge: ${this.avatarData.length}`,
      );
    }
    this.button = new Button(this.element, 'Accept', 'challenge__button');
  }

  public checkFriendsAndRender(): void {
    switch (this.avatarData.length) {
      case 1:
        this.addAvatar(this.avatarData[0]);
        break;
      case 2:
      case 3:
        this.avatarData.forEach((data) => this.addAvatar(data));
        break;
      default:
        break;
    }
  }

  private addAvatar(avatarUrl: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newAvatar = new Avatar(this.avatarsBlock.element, 'challenge__friend-avatar', {
      src: avatarUrl || './assets/images/avatars/default.png',
    });
  }

  private static getDaysToEnd(date1: string, date2: string): number {
    const startDate = new Date(Date.now());
    const endDate = new Date(Date.parse(date2));
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysToEnd = Math.ceil(timeDifference / (1000 * 3600 * 24));
    console.log(daysToEnd);
    return daysToEnd;
  }

  /* private addListeners(): void {} */
}
