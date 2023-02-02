import getClassNames from '../../utils/utils';
import BaseComponent from '../base-component/base-component';
import './input.css';

export default class Input extends BaseComponent<'div'> {
  public input: BaseComponent<'input'>;

  public label: BaseComponent<'label'>;

  // eslint-disable-next-line prettier/prettier
  constructor(
    parent: HTMLElement,
    additionalClasses: string,
    text: string,
    attributes: { [key: string]: string },
  ) {
    const classes = getClassNames('input', additionalClasses);
    super('div', parent, classes, undefined);
    this.label = new BaseComponent('label', this.element, '', text);
    this.input = new BaseComponent('input', this.label.element, '', undefined, attributes);
  }

  public verify(): boolean {
    return this.input.element.value !== '';
  }
}
