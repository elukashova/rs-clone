import './profile-card.css';
import BaseComponent from '../../../../components/base-component/base-component';
import ProfileInfo from './profile-card-info';

export default class ProfileCard extends BaseComponent<'div'> {
  private photo: BaseComponent<'div'> = new BaseComponent('div', this.element, 'profile-card__photo');

  private name: BaseComponent<'h4'> | undefined;

  private about: BaseComponent<'p'> | undefined;

  private profileScore: BaseComponent<'div'> | undefined;

  public folowers: ProfileInfo = new ProfileInfo('подписки');

  public subscribers: ProfileInfo = new ProfileInfo('подписчики');

  public trainings: ProfileInfo = new ProfileInfo('тренировки');

  constructor(parent: HTMLElement, photo: string, name: string, about: string) {
    super('div', parent, 'profile-card');
    this.render(photo, name, about);
  }

  private render(photo: string, name: string, about: string): void {
    this.photo.element.style.background = `url${photo}`;
    this.name = new BaseComponent('h4', this.element, 'profile-card__name', name);
    this.about = new BaseComponent('p', this.element, 'profile-card__about', about);
    this.profileScore = new BaseComponent('div', this.element, 'profile-card__info');
    // eslint-disable-next-line prettier/prettier
    this.profileScore.element.append(
      this.folowers.element,
      this.subscribers.element,
      this.trainings.element,
    );
  }
}
