import './avatar-modal.css';
import BaseComponent from '../base-component/base-component';
import AvatarSources from './avatar-modal.types';
import Image from '../base-component/image/image';
import Svg from '../base-component/svg/svg';
import Button from '../base-component/button/button';
import SvgNames from '../base-component/svg/svg.types';
import UrlObj from '../../utils/utils.types';
import { UpdateUserData, User } from '../../app/loader/loader.types';
import { updateUser } from '../../app/loader/services/user-services';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import eventEmitter from '../../utils/event-emitter';

export default class ModalAvatar extends BaseComponent<'div'> {
  private modal: BaseComponent<'div'> = new BaseComponent('div', this.element, 'avatars__modal');

  private header: BaseComponent<'h2'> = new BaseComponent(
    'h2',
    this.modal.element,
    'avatars__heading',
    'Choose your avatar',
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

  private allAvatars: Image[] = [];

  private currentAvatarUrl: string;

  private id: string | null = null;

  constructor(private root: HTMLElement, source: UrlObj) {
    super('div', root, 'avatars__background');
    this.currentAvatarUrl = source.url;
    this.renderAllAvatars();
    this.cancelButton.element.addEventListener('click', this.cancelButtonCallback);
    this.okButton.element.addEventListener('click', this.okButtonCallback);
  }

  public closeModalCallback = (e: Event): void => {
    if (e.currentTarget === e.target) {
      this.root.removeChild(this.element);
    }
  };

  private renderAllAvatars(): void {
    Object.values(AvatarSources).forEach((source) => {
      const avatar: Image = new Image(this.avatarsWrapper.element, 'avatars__img', {
        src: source,
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
    this.id = ModalAvatar.getIdFromLocalStorage();
    if (this.id) {
      ModalAvatar.updateUser(this.id, { avatar_url: this.currentAvatarUrl })
        .then((user: User) => {
          if (user) {
            eventEmitter.emit('updateAvatar', { url: user.avatarUrl });
            this.cancelButtonCallback();
          }
        })
        .catch(() => null);
    }
  };

  private static updateUser(id: string, data: UpdateUserData): Promise<User> {
    return updateUser(id, data).then((user: User) => {
      console.log(user);
      return user;
    });
  }

  private static getIdFromLocalStorage(): string | null {
    const id: string | null = checkDataInLocalStorage('myUserId');
    return id;
  }
}
