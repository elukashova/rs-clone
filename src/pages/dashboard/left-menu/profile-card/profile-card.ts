import './profile-card.css';
import BaseComponent from '../../../../components/base-component/base-component';
import ProfileInfo from './profile-card-info';
import Svg from '../../../../components/base-component/svg/svg';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import Button from '../../../../components/base-component/button/button';
import eventEmitter from '../../../../utils/event-emitter';
import Image from '../../../../components/base-component/image/image';
import UrlObj from '../../../../utils/utils.types';

export default class ProfileCard extends BaseComponent<'div'> {
  private photo: Image = new Image(this.element, 'profile-card__photo');

  private changePhotoButton: Button = new Button(this.element, '', 'profile-card__change-avatar_btn');

  private changePhotoSVG: Svg = new Svg(
    this.changePhotoButton.element,
    SvgNames.Plus2,
    '#219486',
    'profile-card__change-avatar_svg',
  );

  private name: BaseComponent<'h4'> | undefined;

  private about: BaseComponent<'p'> | undefined;

  private profileScore: BaseComponent<'div'> | undefined;

  public folowers: ProfileInfo = new ProfileInfo('подписки');

  public subscribers: ProfileInfo = new ProfileInfo('подписчики');

  public trainings: ProfileInfo = new ProfileInfo('тренировки');

  constructor(parent: HTMLElement, photo: string, name: string, about: string) {
    super('div', parent, 'profile-card');
    this.render(photo, name, about);
    this.changePhotoButton.element.addEventListener('click', this.changePhotoBtnCallback);
    this.subscribeToEvents();
  }

  private render(url: string, name: string, about: string): void {
    this.photo.element.setAttribute('src', url);
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

  private changePhotoBtnCallback = (): void => {
    eventEmitter.emit('openAvatarModal', { url: this.photo.element.src });
  };

  private updateProfilePicture(url: string): void {
    this.photo.element.src = url;
  }

  private subscribeToEvents(): void {
    eventEmitter.on('updateAvatar', (source: UrlObj) => {
      this.updateProfilePicture(source.url);
    });
  }
}
