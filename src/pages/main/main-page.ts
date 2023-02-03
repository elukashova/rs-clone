import BaseComponent from '../../components/base-component/base-component';

export default class Main extends BaseComponent<'main'> {
  constructor(parent: HTMLElement) {
    super('main', parent, 'main');
  }

  public setContent(newSection: BaseComponent<'section'>): void {
    if (this.element.children.length === 0) {
      this.element.append(newSection.element);
    } else {
      this.element.replaceChildren(newSection.element);
    }
  }
}
