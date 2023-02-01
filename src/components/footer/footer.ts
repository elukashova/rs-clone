import './footer.css';
import BaseComponent from '../base-component/base-component';
import Logo from '../header/logo/logo';
import GithubLink from './github-link/github-link';

export default class Footer extends BaseComponent<'footer'> {
  private logo: Logo = new Logo(this.element);

  private linksContainer: BaseComponent<'div'> = new BaseComponent('div', this.element);

  private matthewLink = new GithubLink(
    this.linksContainer.element,
    'https://github.com/matthewTheWizzard',
    'matthewTheWizzard',
  );

  private elenaLink = new GithubLink(this.linksContainer.element, 'https://github.com/elukashova', 'elukashova');

  private nastyaLink = new GithubLink(this.linksContainer.element, 'https://github.com/TrickyPie', 'TrickyPie');

  private year: BaseComponent<'span'> = new BaseComponent('span', this.element, 'footer-year', '2023');

  private rssLogo: BaseComponent<'a'> = new BaseComponent('a', this.element, 'footer-rss', 'RSS', {
    href: 'https://rs.school/js/',
  });

  constructor(parent: HTMLElement) {
    super('footer', parent, 'footer');
  }
}
