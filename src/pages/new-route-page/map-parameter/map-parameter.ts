/* eslint-disable no-underscore-dangle */
import BaseComponent from '../../../components/base-component/base-component';

export default class MapParameter extends BaseComponent<'div'> {
  private _name = new BaseComponent('span', this.element);

  private _value = new BaseComponent('span', this.element);

  constructor(parent: HTMLElement, name?: string) {
    super('div', parent, 'map-parameter');
    if (name) this._name.element.textContent = name;
  }

  public set value(value: string) {
    this._value.element.textContent = value;
  }

  public set name(name: string) {
    this._name.element.textContent = name;
  }
}
