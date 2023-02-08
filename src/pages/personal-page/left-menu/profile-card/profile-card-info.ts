import './profile-card.css';
import BaseComponent from '../../../../components/base-component/base-component';

export default class ProfileInfo extends BaseComponent<'div'> {
  private heading: BaseComponent<'span'> | undefined;

  public score: BaseComponent<'span'> | undefined;

  constructor(heading: string) {
    super('div', undefined, 'profile-info');
    this.render(heading);
  }

  private render(heading: string): void {
    this.heading = new BaseComponent('span', this.element, '', heading);
    this.score = new BaseComponent('span', this.element, '', '0');
  }
}
