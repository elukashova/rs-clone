import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import './textarea.css';

export default class TextArea extends BaseComponent<'div'> {
  private textArea: BaseComponent<'textarea'>;

  private label?: BaseComponent<'label'>;

  constructor(
    parent: HTMLElement,
    additionalClasses: string,
    labelText: string,
    attributes: {
      [key: string]: string;
    },
  ) {
    const classes = getClassNames('textarea', additionalClasses);
    super('div', parent, classes, undefined, attributes);

    if (labelText) {
      this.label = new BaseComponent('label', this.element, `${labelText}-label`, labelText);
      this.textArea = new BaseComponent('textarea', this.label.element, 'textarea', '', attributes);
    } else {
      this.textArea = new BaseComponent('textarea', this.element, 'textarea', '', attributes);
    }
  }

  public get textValue(): string {
    return this.textArea.element.value;
  }

  public set textValue(text) {
    this.textArea.element.value = text;
  }

  public verify(): boolean {
    return this.textArea.element.value !== '';
  }
}
