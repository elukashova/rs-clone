import { getClassNames } from '../../utils/utils';
import BaseComponent from '../base-component/base-component';
import { ValidityMessages } from '../forms/form.types';
import './input.css';

export default class Input extends BaseComponent<'div'> {
  public input: BaseComponent<'input'>;

  public label: BaseComponent<'label'>;

  private inputName: string;

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
    this.input = new BaseComponent('input', this.label.element, '', '', attributes);
    this.inputName = this.label.element.innerText.toLowerCase();
  }

  public verify(): boolean {
    return this.input.element.value !== '';
  }

  public get inputValue(): string {
    return this.input.element.value;
  }

  public checkInput(message: ValidityMessages): boolean {
    const validityState = this.input.element.validity;

    if (validityState.valueMissing) {
      this.input.element.setCustomValidity(`Please enter your ${this.inputName}`);
      this.input.element.reportValidity();
      return false;
    }

    if (this.input.element.type === 'email') {
      if (validityState.typeMismatch) {
        this.input.element.setCustomValidity(message);
        this.input.element.reportValidity();
        return false;
      }
    }

    if (validityState.patternMismatch) {
      this.input.element.setCustomValidity(message);
      this.input.element.reportValidity();
      return false;
    }

    return true;
  }

  public handleInvalidCredentials(): void {
    this.input.element.setCustomValidity(`This ${this.inputName} is incorrect. Please, try again!`);
    this.input.element.reportValidity();
  }
}
