/* eslint-disable no-underscore-dangle */
import './post-icon.css';
import BaseComponent from '../../../../../components/base-component/base-component';
import Svg from '../../../../../components/base-component/svg/svg';

export default class PostIcon extends BaseComponent<'span'> {
  private _value = new BaseComponent('span', this.element);

  private icon: Svg | undefined;

  constructor(parent: HTMLElement, iconName: string, color: string, className: string) {
    super('span', parent, 'post__icon');
    this.icon = new Svg(this.element, iconName, color, className);
    this.value = '0';
  }

  public set value(value: string) {
    this._value.element.textContent = value;
  }

  public get value(): string {
    const text = this._value.element.textContent;
    if (text !== null) return text;
    return '';
  }
}
