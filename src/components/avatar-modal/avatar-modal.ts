import './avatar-modal.css';
import BaseComponent from '../base-component/base-component';
import AvatarSources from './avatar-modal.types';
import Picture from '../base-component/picture/picture';
import Svg from '../base-component/svg/svg';
import Button from '../base-component/button/button';
import SvgNames from '../base-component/svg/svg.types';
import { Token, UpdateUserData } from '../../app/loader/loader-requests.types';
import { User } from '../../app/loader/loader-responses.types';
import { updateUser } from '../../app/loader/services/user-services';
import { checkDataInLocalStorage, setDataToLocalStorage } from '../../utils/local-storage';
import eventEmitter from '../../utils/event-emitter';
import { EventData } from '../../utils/event-emitter.types';

export default class ModalAvatar extends BaseComponent<'div'> {
  private dictionary = {
    avatar: 'avatar',
  };

  private modal: BaseComponent<'div'> = new BaseComponent('div', this.element, 'avatars__modal');

  private header: BaseComponent<'h2'> = new BaseComponent(
    'h2',
    this.modal.element,
    'avatars__heading',
    this.dictionary.avatar,
  );

  private avatarsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.modal.element, 'avatars__imgs-wpapper');

  private buttonsWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.modal.element,
    'avatars__buttons-wpapper',
  );

  private cancelButton: Button = new Button(this.buttonsWrapper.element, '', 'avatars__button_cancel');

  private cancelBtnSVG: Svg = new Svg(
    this.cancelButton.element,
    SvgNames.CloseRound,
    '#FF8D24',
    'avatars__button-cancel_svg',
  );

  private okButton: Button = new Button(this.buttonsWrapper.element, '', 'avatars__button_ok');

  private okBtnSVG: Svg = new Svg(this.okButton.element, SvgNames.Check, '#1CBAA7', 'avatars__button-ok_svg');

  private allAvatars: Picture[] = [];

  private currentAvatarUrl: string;

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  constructor(private root: HTMLElement, source: EventData) {
    super('div', root, 'avatars__background');
    this.currentAvatarUrl = `${source.url}`;
    this.renderAllAvatars();
    this.cancelButton.element.addEventListener('click', this.cancelButtonCallback);
    this.okButton.element.addEventListener('click', this.okButtonCallback);
  }

  public closeModalCallback = (e: Event): void => {
    this.root.style.overflow = 'visible';
    if (e.currentTarget === e.target) {
      this.root.removeChild(this.element);
    }
  };

  private renderAllAvatars(): void {
    Object.values(AvatarSources).forEach((source) => {
      const avatar: Picture = new Picture(this.avatarsWrapper.element, 'avatars__img', {
        src: source,
        alt: 'avatar',
      });
      this.allAvatars.push(avatar);
      avatar.element.addEventListener('click', this.selectAvatarCallback);
    });
    this.highlightCurrentAvatar();
  }

  private selectAvatarCallback = ({ target }: Event): void => {
    if (target instanceof HTMLImageElement) {
      this.currentAvatarUrl = target.src;
      this.highlightCurrentAvatar();
    }
  };

  private highlightCurrentAvatar = (): void => {
    this.allAvatars.forEach((avatar) => {
      if (avatar.element.src === this.currentAvatarUrl) {
        avatar.element.classList.add('current-avatar');
      } else if (avatar.element.classList.contains('current-avatar')) {
        avatar.element.classList.remove('current-avatar');
      }
    });
  };

  private cancelButtonCallback = (): void => {
    this.root.removeChild(this.element);
  };

  private okButtonCallback = (): void => {
    if (this.token) {
      ModalAvatar.updateUser(this.token, { avatarUrl: this.currentAvatarUrl })
        .then((user: User) => {
          if (user) {
            setDataToLocalStorage(user.avatarUrl, 'UserAvatarUrl');
            eventEmitter.emit('updateAvatar', { url: user.avatarUrl });
            this.cancelButtonCallback();
          }
        })
        .catch(() => null);
    }
  };

  private static updateUser(token: Token, data: UpdateUserData): Promise<User> {
    return updateUser(token, data).then((user: User) => user);
  }
}
