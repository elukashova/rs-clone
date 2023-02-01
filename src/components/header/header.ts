import BaseComponent from '../base-component/base-component';
import Avatar from './avatar/avatar';
import HeaderIcon from './icon/icon';
import NavigationLink from './link/link';
import Logo from './logo/logo';
import './header.css';

export default class Header extends BaseComponent<'header'> {
  private logo = new Logo(this.element);

  private challenges = new NavigationLink(this.element, 'challenges');

  private avatar = new Avatar(this.element);

  private laguageIcon = new HeaderIcon(this.element, 'header-icon_lang');

  private themeIcon = new HeaderIcon(this.element, 'header-icon_theme');

  constructor(parent: HTMLElement) {
    super('header', parent, 'header');
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
    this.laguageIcon.element.addEventListener('click', () => {
      console.log('change language');
    });
  }

  public changeTheme(): void {
    this.themeIcon.element.addEventListener('click', () => {
      console.log('change theme');
    });
  }
}
