import BaseComponent from '../../../components/base-component/base-component';

export default class MapParameter extends BaseComponent<'div'> {
  private name = new BaseComponent('span', this.element);

  private value = new BaseComponent('span', this.element);

  constructor(parent: HTMLElement, name?: string) {
    super('div', parent, 'map-parameter');
    if (name) this.name.element.textContent = name;
  }

  public setValue(value: string): void {
    this.value.element.textContent = value;
  }

  public setName(value: string): void {
    this.name.element.textContent = value;
  }
}
