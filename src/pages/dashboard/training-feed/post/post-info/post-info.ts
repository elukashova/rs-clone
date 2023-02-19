/* eslint-disable no-underscore-dangle */
import BaseComponent from '../../../../../components/base-component/base-component';

export default class PostInfo extends BaseComponent<'div'> {
  private heading: BaseComponent<'span'> | undefined;

  private _value: BaseComponent<'span'> | undefined;

  constructor(parent: HTMLElement, heading: string) {
    super('div', parent, 'post__data-single');
    this.render(heading);
  }

  private render(heading: string): void {
    this.heading = new BaseComponent('span', this.element, 'post__data-title', heading);
    this._value = new BaseComponent('span', this.element, '');
  }

  public set value(value: string) {
    if (this._value) this._value.element.textContent = value;
  }
}
