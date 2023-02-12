import BaseComponent from '../../../../../components/base-component/base-component';

export default class PostInfo extends BaseComponent<'div'> {
  private heading: BaseComponent<'span'> | undefined;

  public score: BaseComponent<'span'> | undefined;

  constructor(parent: HTMLElement, heading: string) {
    super('div', parent);
    this.render(heading);
  }

  private render(heading: string): void {
    this.heading = new BaseComponent('span', this.element, '', heading);
    this.score = new BaseComponent('span', this.element, '', '0');
  }
}
