import Avatar from '../../../components/base-component/avatar-image/avatar';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import Picture from '../../../components/base-component/picture/picture';
import Svg from '../../../components/base-component/svg/svg';
import { ProjectColors } from '../../../utils/consts';

export default class Challenge extends BaseComponent<'div'> {
  public type: string;

  public challengeImage!: Picture;

  public title!: BaseComponent<'h3'>;

  public descriptionBlock!: BaseComponent<'div'>;

  public activityIcon!: Svg;

  public description!: BaseComponent<'p'>;

  public date!: BaseComponent<'p'>;

  public friends!: BaseComponent<'p'>;

  public button!: Button;

  public friendsBlock!: BaseComponent<'div'>;

  public avatar!: Avatar;

  public avatarData: string;

  public contOfFriends: number;

  constructor(
    parent: HTMLElement,
    type: string,
    avatarData: string,
    contOfFriends: number,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    super('div', parent, additionalClasses, '', attributes);
    this.type = type;
    this.avatarData = avatarData;
    this.contOfFriends = contOfFriends;
    this.renderChallenge();
  }

  private renderChallenge(): void {
    this.challengeImage = new Picture(this.element, '', {
      src: `../../../assets/images/challenges/${this.type}.jpg`,
      style: 'width:15rem; height: 100%',
    });
    this.title = new BaseComponent('h3', this.element, '');

    this.descriptionBlock = new BaseComponent('div', this.element, '');
    this.activityIcon = new Svg(
      this.descriptionBlock.element,
      this.type,
      ProjectColors.Grey,
      `${this.type}-icon challenges-activity__svg`,
    );
    this.description = new BaseComponent('p', this.descriptionBlock.element, '');
    this.date = new BaseComponent('p', this.descriptionBlock.element, '');

    this.friendsBlock = new BaseComponent('div', this.element, '');
    // this.checkFriendsAndRender();

    this.friends = new BaseComponent('p', this.friendsBlock.element, '');
    this.button = new Button(this.element, 'Accept');
  }

  public static setText(element: HTMLElement, text: string): void {
    const temporary = element;
    temporary.textContent = text;
  }

  // public checkFriendsAndRender(): void {
  /* this.avatar = new Avatar(this.friendsBlock.element, 'friend__avatar', {
      src: this.avatarData || './assets/images/avatars/default.png',
    }); */
  // }

  /*
  private addListeners(): void {} */
}
