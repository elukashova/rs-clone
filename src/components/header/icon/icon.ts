import BaseComponent from '../../base-component/base-component';

export default class HeaderIcon extends BaseComponent<'span'> {
  constructor(root: HTMLElement, additionalClasses?: string) {
    const classes = additionalClasses ? `header-icon ${additionalClasses}` : 'header-icon';
    super('span', root, classes);
  }

  public iconAction(): void {
    this.element.addEventListener('click', () => {
      console.log('change smth');
    });
  }
}
