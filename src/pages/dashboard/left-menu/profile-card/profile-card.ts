import './profile-card.css';
import BaseComponent from '../../../../components/base-component/base-component';
import ProfileInfo from './profile-card-info';
import Svg from '../../../../components/base-component/svg/svg';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import Button from '../../../../components/base-component/button/button';
import eventEmitter from '../../../../utils/event-emitter';
import Picture from '../../../../components/base-component/picture/picture';
import UrlObj from '../../../../utils/utils.types';
import EditableTextarea from '../../../../components/base-component/textarea/editable-textarea';
import { TextareaTypes } from '../../../../components/base-component/textarea/editable-textarea.types';
import { ProjectColors } from '../../../../utils/consts';
import Routes from '../../../../app/router/router.types';

export default class ProfileCard extends BaseComponent<'div'> {
  private photo: Picture = new Picture(this.element, 'profile-card__photo');

  private changePhotoButton: Button = new Button(this.element, '', 'profile-card__photo_btn');

  private changePhotoSVG: Svg = new Svg(
    this.changePhotoButton.element,
    SvgNames.Plus2,
    ProjectColors.DarkTurquoise,
    'profile-card__photo_btn_svg',
  );

  private name: EditableTextarea | undefined;

  private about: EditableTextarea | undefined;

  private profileScore: BaseComponent<'div'> | undefined;

  public folowers: ProfileInfo = new ProfileInfo('followee', Routes.FindFriends, this.replaceMainCallback);

  public subscribers: ProfileInfo = new ProfileInfo('follower', Routes.FindFriends, this.replaceMainCallback);

  public trainings: ProfileInfo = new ProfileInfo('activities', Routes.AddActivity, this.replaceMainCallback);

  // eslint-disable-next-line max-len
  constructor(parent: HTMLElement, photo: string, name: string, bio: string, private replaceMainCallback: () => void) {
    super('div', parent, 'profile-card');
    this.render(photo, name, bio);
    this.changePhotoButton.element.addEventListener('click', this.changePhotoBtnCallback);
    this.subscribeToEvents();
  }

  private render(url: string, name: string, bio: string): void {
    this.photo.element.setAttribute('src', url);
    this.name = new EditableTextarea(this.element, 'profile-card__name', name, TextareaTypes.Username);
    this.about = new EditableTextarea(this.element, 'profile-card__about', bio, TextareaTypes.Bio);
    this.profileScore = new BaseComponent('div', this.element, 'profile-card__info');
    // eslint-disable-next-line prettier/prettier, max-len
    this.profileScore.element.append(this.folowers.element, this.subscribers.element, this.trainings.element);
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
