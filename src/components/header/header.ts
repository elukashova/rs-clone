import './header.css';
import BaseComponent from '../base-component/base-component';
import Avatar from '../base-component/avatar-image/avatar';
import Picture from '../base-component/picture/picture';
import NavigationLink from '../base-component/link/link';
import Routes from '../../app/router/router.types';
import Svg from '../base-component/svg/svg';
import { ProjectColors } from '../../utils/consts';
import SvgNames from '../base-component/svg/svg.types';
import eventEmitter from '../../utils/event-emitter';
import { EventData } from '../../utils/event-emitter.types';

export default class Header extends BaseComponent<'header'> {
  private contentWrapper = new BaseComponent('div', this.element, 'header-content-wrapper');

  private logoLink = new NavigationLink(this.replaceMainCallback, {
    text: '',
    parent: this.contentWrapper.element,
    additionalClasses: 'header-link-logo link',
    attributes: { href: Routes.Dashboard },
  });

  private logoIcon = new Picture(this.logoLink.element, 'header-icon_logo', {
    src: './assets/icons/png/logo.png',
    alt: 'We make fitness tracking social. We house your entire active journey in one spot – and you get to share it with friends.',
  });

  private linksContainer = new BaseComponent('div', this.contentWrapper.element, 'header-icons-container');

  private avatarDropDown = new BaseComponent('div', this.linksContainer.element, 'header-avatar-dropdown');

  private avatarIcon = new Avatar(this.avatarDropDown.element, 'header-avatar-icon', {
    src: './assets/images/avatars/default.png',
    alt: 'Your avatar',
  });

  private avatarDropDownContent = new BaseComponent('div', this.avatarDropDown.element, 'header-avatar-content');

  private personalPageLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Personal page',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
    attributes: { href: Routes.Dashboard },
  });

  private myRoutesPageLink = new NavigationLink(this.replaceMainCallback, {
    text: 'My Routes',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
    attributes: { href: Routes.MyRoutes },
  });

  private settingsPageLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Settings',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
    attributes: { href: Routes.Settings },
  });

  private exit = new NavigationLink(this.replaceMainCallback, {
    text: 'Exit',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
  });

  private addDropDown = new BaseComponent('div', this.linksContainer.element, 'header-add-dropdown');

  private addIcon = new Svg(this.addDropDown.element, SvgNames.Plus2, ProjectColors.Turquoise, 'header-add-icon');

  private addDropDownContent = new BaseComponent('div', this.addDropDown.element, 'header-add-content');

  private addActivityLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Add new activity',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.AddActivity },
  });

  private addNewRouteLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Add new route',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.AddRoute },
  });

  private findFriendsLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Find friends',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.FindFriends },
  });

  private challenges = new NavigationLink(this.replaceMainCallback, {
    text: 'Challenges',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.Challenges },
  });

  private languageIcon = new Picture(this.linksContainer.element, 'header-icon_lang icon', {
    src: './assets/icons/png/change-language-icon.png',
    alt: 'Change language',
  });

  private themeIcon = new Picture(this.linksContainer.element, 'header-icon_theme icon', {
    src: './assets/icons/png/change-theme-icon.png',
    alt: 'Change theme',
  });

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('header', parent, 'header');
    this.changeLanguage();
    this.changeTheme();
    this.subscribeToEvents();
  }

  public changeLanguage(): void {
    this.languageIcon.element.addEventListener('click', () => {
      console.log('change language');
    });
  }

  public changeTheme(): void {
    this.themeIcon.element.addEventListener('click', () => {
      console.log('change theme');
    });
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  public show(): void {
    this.element.style.display = 'flex';
  }

  private updateProfilePicture(source: EventData): void {
    this.avatarIcon.element.src = `${source.url}`;
  }

  private subscribeToEvents(): void {
    eventEmitter.on('updateAvatar', (source: EventData) => {
      this.updateProfilePicture(source);
    });
  }
}
