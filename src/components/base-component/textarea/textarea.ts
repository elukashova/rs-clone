import i18next from 'i18next';
import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import './textarea.css';

export default class TextArea extends BaseComponent<'div'> {
  private textArea: BaseComponent<'textarea'>;

  private label?: BaseComponent<'label'>;

  public title!: BaseComponent<'span'>;

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
      this.label = new BaseComponent('label', this.element, 'textarea__label');
      this.title = new BaseComponent('span', this.label.element, '', labelText);
      this.textArea = new BaseComponent('textarea', this.label.element, 'textarea', '', attributes);
    } else {
      this.textArea = new BaseComponent('textarea', this.element, 'textarea', '', attributes);
    }
    if (attributes && attributes.placeholder) {
      this.textArea.element.placeholder = i18next.t(attributes.placeholder);
      this.setInputPlaceholder(attributes.placeholder);
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

  public set placeholder(value: string) {
    this.textArea.element.placeholder = value;
  }

  private setInputPlaceholder(placeholder: string): void {
    i18next.on('languageChanged', () => {
      this.textArea.element.placeholder = i18next.t(placeholder);
    });
  }
}
