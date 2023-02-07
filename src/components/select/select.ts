import getClassNames from '../../utils/utils';
import BaseComponent from '../base-component/base-component';

export default class Select extends BaseComponent<'select'> {
  constructor(parent: HTMLElement, options: string[], additionalClasses?: string) {
    const classes = getClassNames('select', additionalClasses);
    super('select', parent, classes);
    this.addOptions(options);
  }

  private addOptions(options: string[]): void {
    options.forEach((option) => this.element.append(Select.createOption(option).element));
  }

  private static createOption(name: string): BaseComponent<'option'> {
    return new BaseComponent('option', undefined, '', name);
  }
}
