import './profile-card.css';
import BaseComponent from '../../../../components/base-component/base-component';
import NavigationLink from '../../../../components/base-component/link/link';
import Routes from '../../../../app/router/router.types';

export default class ProfileInfo extends BaseComponent<'div'> {
  private link: NavigationLink = new NavigationLink(this.replaceMainCallback, {
    text: this.heading,
    parent: this.element,
    additionalClasses: 'profile-info__link',
    attributes: {
      href: this.href,
    },
  });

  public score: BaseComponent<'span'> | undefined;

  // eslint-disable-next-line max-len
  constructor(private heading: string, private href: Routes, private replaceMainCallback: () => void, score?: number) {
    super('div', undefined, 'profile-info');
    this.render(score);
  }

  private render(score?: number): void {
    const counter: number = score ?? 0;
    this.score = new BaseComponent('span', this.element, 'profile-info__score', `${counter}`);
  }

  public updateScore(number: number): void {
    if (this.score) {
      this.score.element.textContent = `${number}`;
    }
  }
}
