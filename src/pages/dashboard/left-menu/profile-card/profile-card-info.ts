import './profile-card.css';
import BaseComponent from '../../../../components/base-component/base-component';
import NavigationLink from '../../../../components/base-component/link/link';
import { Link } from '../../../../components/base-component/link/link.types';
import Routes from '../../../../app/router/router.types';

export default class ProfileInfo extends BaseComponent<'div'> {
  private link: NavigationLink | undefined;

  public score: BaseComponent<'span'> | undefined;

  private data: Link = {
    text: this.heading,
    parent: this.element,
    additionalClasses: 'profile-info__link',
    attributes: {
      href: this.href,
    },
  };

  // eslint-disable-next-line max-len
  constructor(private heading: string, private href: Routes, private replaceMainCallback: () => void) {
    super('div', undefined, 'profile-info');
    this.render();
  }

  private render(): void {
    this.link = new NavigationLink(this.replaceMainCallback, this.data);
    this.score = new BaseComponent('span', this.element, 'profile-info__score', '0');
  }
}
