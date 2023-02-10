import './footer.css';
import Image from '../base-component/image/image';
import BaseComponent from '../base-component/base-component';
import ExternalLink from '../base-component/external-link/external-link';
import Routes from '../../app/router/router.types';
import NavigationLink from '../base-component/link/link';

export default class Footer extends BaseComponent<'footer'> {
  private contentWrapper = new BaseComponent('div', this.element, 'footer-content-wrapper');

  private aboutTeamContainer: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.contentWrapper.element,
    'footer-about-team',
  );

  private linksContainer: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.aboutTeamContainer.element,
    'footer-links',
  );

  private matthewLink = new ExternalLink(
    this.linksContainer.element,
    'https://github.com/matthewTheWizzard',
    'matthewthewizzard',
  );

  private matthewCat = new Image(this.matthewLink.element, 'footer-github-logo', {
    src: '../assets/icons/png/github-left.png',
    alt: "Matthew's github",
  });

  private elenaLink = new ExternalLink(this.linksContainer.element, 'https://github.com/elukashova', 'elukashova');

  private lenaCat = new Image(this.elenaLink.element, 'footer-github-logo', {
    src: '../assets/icons/png/github-left.png',
    alt: "Lena's github",
  });

  private nastyaLink = new ExternalLink(this.linksContainer.element, 'https://github.com/TrickyPie', 'trickypie');

  private nastyaCat = new Image(this.nastyaLink.element, 'footer-github-logo', {
    src: '../assets/icons/png/github-right.png',
    alt: "Nastya's github",
  });

  private addActivityLink = new NavigationLink(this.replaceMainCallback, {
    text: 'About our team',
    parent: this.aboutTeamContainer.element,
    additionalClasses: 'footer-link-team link',
    attributes: { href: Routes.AboutTeam },
  });

  private rsContainer: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.contentWrapper.element,
    'footer-rs-container',
  );

  private year: BaseComponent<'span'> = new BaseComponent('span', this.rsContainer.element, 'footer-year', '2023');

  private rssLink = new ExternalLink(this.rsContainer.element, 'https://rs.school/js/', 'footer-rs-school-link');

  private rssLogo = new Image(this.rssLink.element, 'footer-rs-school-logo', {
    src: '../assets/icons/png/rsschool.png',
    alt: "RS School logotype. It's free-of-charge and community-based education program.",
  });

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('footer', parent, 'footer');
  }
}
