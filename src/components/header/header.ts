import BaseComponent from '../base-component/base-component';
import Avatar from './avatar/avatar';
import HeaderIcon from './icon/icon';
import NavigationLink from '../link/link';
import Logo from './logo/logo';
import './header.css';
import Routes from '../../app/loader/router/router.types';

export default class Header extends BaseComponent<'header'> {
  private logo = new Logo(this.element);

  private challenges = new NavigationLink(this.replaceMainCallback, { text: 'challenges', parent: this.element });

  private avatar = new Avatar(this.element);

  private languageIcon = new HeaderIcon(this.element, 'header-icon_lang');

  private themeIcon = new HeaderIcon(this.element, 'header-icon_theme');

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
}
