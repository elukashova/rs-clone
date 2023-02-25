import './member.css';
import BaseComponent from '../../../components/base-component/base-component';
import Picture from '../../../components/base-component/picture/picture';

export default class Member extends BaseComponent<'div'> {
  private memberBlock = new BaseComponent('div', this.element, 'member__block');

  public memberPicture!: Picture;

  public github: string;

  public name: string;

  public info: string;

  public memberData!: BaseComponent<'div'>;

  public memberName!: BaseComponent<'h4'>;

  public aboutMember!: BaseComponent<'p'>;

  constructor(parent: HTMLElement, github: string, info: string, name: string) {
    super('div', parent, 'member');
    this.github = github;
    this.name = name;
    this.info = info;
    this.renderMember();
  }

  public renderMember(): void {
    this.memberPicture = new Picture(this.memberBlock.element, 'member__photo', {
      src: `./assets/images/team/${this.github}.jpg`,
      alt: `Photo of ${this.name}`,
    });
    this.memberData = new BaseComponent('div', this.memberBlock.element, 'member__info');
    this.memberName = new BaseComponent('h4', this.memberData.element, 'member__name', `${this.name}`);
    this.aboutMember = new BaseComponent('p', this.memberBlock.element, 'member__about', `${this.info}`);
  }
}
