/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './header.css';
import i18next from 'i18next';
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
  private languages: { en: string; rus: string } = { en: 'en', rus: 'rus' };

  private contentWrapper = new BaseComponent('div', this.element, 'header-content-wrapper');

  private logoLink = new NavigationLink(this.replaceMainCallback, {
    text: '',
    parent: this.contentWrapper.element,
    additionalClasses: 'header-link-logo link',
    attributes: { href: Routes.SignUp },
  });

  private logoIcon = new Picture(this.logoLink.element, 'header-icon_logo', {
    src: './assets/icons/png/logo.png',
    alt: 'We make fitness tracking social. We house your entire active journey in one spot – and you get to share it with friends.',
  });

  private linksContainer = new BaseComponent('div', this.contentWrapper.element, 'header-icons-container');

  public avatarDropDown = new BaseComponent('div', undefined, 'header-avatar-dropdown');

  private avatarIcon = new Avatar(this.avatarDropDown.element, 'header-avatar-icon', {
    alt: 'Your avatar',
  });

  private avatarDropDownContent = new BaseComponent('div', this.avatarDropDown.element, 'header-avatar-content');

  private personalPageLink = new NavigationLink(this.replaceMainCallback, {
    text: 'header.personalPage',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
    attributes: { href: Routes.Dashboard },
  });

  private myRoutesPageLink = new NavigationLink(this.replaceMainCallback, {
    text: 'header.myRoutes',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
    attributes: { href: Routes.MyRoutes },
  });

  private settingsPageLink = new NavigationLink(this.replaceMainCallback, {
    text: 'header.settings',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
    attributes: { href: Routes.Settings },
  });

  private exit = new NavigationLink(this.replaceMainCallback, {
    text: 'header.exit',
    parent: this.avatarDropDownContent.element,
    additionalClasses: 'header-link-avatar link',
    attributes: { href: Routes.LogOut },
  });

  public addDropDown = new BaseComponent('div', undefined, 'header-add-dropdown');

  private addIcon = new Svg(this.addDropDown.element, SvgNames.Plus2, ProjectColors.Turquoise, 'header-add-icon');

  private addDropDownContent = new BaseComponent('div', this.addDropDown.element, 'header-add-content');

  private addActivityLink = new NavigationLink(this.replaceMainCallback, {
    text: 'header.addActivity',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.AddActivity },
  });

  private addNewRouteLink = new NavigationLink(this.replaceMainCallback, {
    text: 'header.addRoute',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.AddRoute },
  });

  private findFriendsLink = new NavigationLink(this.replaceMainCallback, {
    text: 'header.findFriends',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.FindFriends },
  });

  private challenges = new NavigationLink(this.replaceMainCallback, {
    text: 'header.challenges',
    parent: this.addDropDownContent.element,
    additionalClasses: 'header-link-add link',
    attributes: { href: Routes.Challenges },
  });

  private languageIcon = new Picture(this.linksContainer.element, 'header-icon_lang icon', {
    src: './assets/icons/png/russian.png',
    alt: 'Change language',
  });

  private themeWrapper = new BaseComponent('div', this.linksContainer.element, 'header__theme-wrapper');

  private themeSlider = new BaseComponent('label', this.themeWrapper.element, 'header__theme-switch', '', {
    id: 'switch',
  });

  private themeCheckbox = new BaseComponent('input', this.themeSlider.element, 'header__theme-checkbox', '', {
    type: 'checkbox',
    id: 'slider',
  });

  private themeCircle = new BaseComponent('span', this.themeSlider.element, 'header__theme-circle round', '');

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('header', parent, 'header');
    this.changeLanguage();
    this.changeTheme();
    this.subscribeToEvents();
    this.initialThemes();
    this.setGridToTwoElements();
    this.handleLogo();
    window.addEventListener('resize', this.handleLogo);
  }

  public changeLanguage(): void {
    this.languageIcon.element.addEventListener('click', () => {
      const language: string | null = localStorage.getItem('i18nextLng');
      switch (language) {
        case this.languages.en:
          i18next.changeLanguage(this.languages.rus);
          this.languageIcon.element.src = './assets/icons/png/english.png';
          break;
        case this.languages.rus:
          i18next.changeLanguage(this.languages.en);
          this.languageIcon.element.src = './assets/icons/png/russian.png';
          break;
        default:
          break;
      }
      eventEmitter.emit('languageChanged', {});
    });
  }

  public changeTheme(): void {
    this.themeSlider.element.addEventListener('change', () => {
      Header.toggleThemes();
    });
  }

  private initialThemes(): void {
    if (localStorage.getItem('theme') !== 'theme-dark') {
      Header.setTheme('theme-light');
      this.themeCheckbox.element.checked = true;
    } else {
      Header.setTheme('theme-dark');
      this.themeCheckbox.element.checked = false;
    }
  }

  private static toggleThemes(): void {
    if (localStorage.getItem('theme') === 'theme-dark') {
      Header.setTheme('theme-light');
    } else {
      Header.setTheme('theme-dark');
    }
  }

  private static setTheme(themeName: string): void {
    localStorage.setItem('theme', themeName);
    document.body.className = themeName;
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

  public appendElementsInDashboard(): void {
    this.linksContainer.element.insertBefore(this.addDropDown.element, this.languageIcon.element);
    this.linksContainer.element.insertBefore(this.avatarDropDown.element, this.addDropDown.element);
    this.setGridToFourElements();
  }

  public removeElementNotDashboard(): void {
    if (this.avatarDropDown.element.parentElement === this.linksContainer.element) {
      this.linksContainer.element.removeChild(this.avatarDropDown.element);
    }

    if (this.addDropDown.element.parentElement === this.linksContainer.element) {
      this.linksContainer.element.removeChild(this.addDropDown.element);
    }
    this.setGridToTwoElements();
  }

  public setGridToTwoElements(): void {
    this.linksContainer.element.style.gridTemplateColumns = 'repeat(2, 3.5rem)';
  }

  public setGridToFourElements(): void {
    this.linksContainer.element.style.gridTemplateColumns = 'repeat(4, 3.5rem)';
  }

  private handleLogo = (): void => {
    const { innerWidth } = window;
    if (innerWidth > 640) {
      this.logoIcon.element.src = './assets/icons/png/logo.png';
    } else {
      this.logoIcon.element.src = './assets/icons/png/logo-mobile.png';
    }
  };
}
