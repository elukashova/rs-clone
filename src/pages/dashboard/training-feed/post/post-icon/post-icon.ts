/* eslint-disable no-underscore-dangle */
import BaseComponent from '../../../../../components/base-component/base-component';
import Svg from '../../../../../components/base-component/svg/svg';

export default class PostIcon extends BaseComponent<'div'> {
  private _value = new BaseComponent('span', this.element, 'post__icon-counter');

  public icon: Svg;

  constructor(parent: HTMLElement, iconName: string, color: string, className: string) {
    super('div', parent, 'post__icon');
    this.icon = new Svg(this.element, iconName, color, className);
    this.value = '0';
  }

  public set value(value: string) {
    this._value.element.textContent = value;
  }

  public get value(): string {
    const text: string | null = this._value.element.textContent;
    if (text !== null) return text;
    return '';
  }
}
