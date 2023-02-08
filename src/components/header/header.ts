import BaseComponent from '../base-component/base-component';
import Avatar from './avatar/avatar';
import HeaderIcon from './icon/icon';
import NavigationLink from '../link/link';
import Logo from './logo/logo';
import './header.css';
import Routes from '../../app/loader/router/router.types';

export default class Header extends BaseComponent<'header'> {
  private logo = new Logo(this.element);

  private linksContainer = new BaseComponent('div', this.element, 'icons-container');

  private avatar = new Avatar(this.linksContainer.element);

  private challenges = new NavigationLink(this.replaceMainCallback, {
    text: '',
    parent: this.linksContainer.element,
    additionalClasses: 'header-icon header-icon_challenge',
  });

  private languageIcon = new HeaderIcon(this.linksContainer.element, 'header-icon_lang');

  private themeIcon = new HeaderIcon(this.linksContainer.element, 'header-icon_theme');

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('header', parent, 'header');
    this.challenges.element.setAttribute('href', Routes.Challenges);
    this.openMenu();
    this.changeLanguage();
    this.changeTheme();
  }

  public openMenu(): void {
    this.avatar.element.addEventListener('click', () => {
      console.log('open avatar menu');
    });
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
}
