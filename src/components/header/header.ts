import BaseComponent from '../base-component/base-component';
import Avatar from './avatar/avatar';
import HeaderIcon from './icon/icon';
import NavigationLink from './link/link';
import Logo from './logo/logo';

export default class Header extends BaseComponent<'header'> {
  private logo = new Logo(this.element);

  private challenges = new NavigationLink(this.element, 'challenges');

  private avatar = new Avatar(this.element);

  private laguageIcon = new HeaderIcon(this.element, 'header-icon_lang');

  private themeIcon = new HeaderIcon(this.element, 'header-icon_theme');

  constructor(root: HTMLElement) {
    super('header', root, 'header');
  }
}
