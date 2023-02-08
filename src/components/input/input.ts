import { getClassNames } from '../../utils/utils';
import BaseComponent from '../base-component/base-component';
import { ValidityMessages } from '../forms/form.types';
import './input.css';

export default class Input extends BaseComponent<'div'> {
  public input: BaseComponent<'input'>;

  public label: BaseComponent<'label'>;

  private inputName: string;

  private message: ValidityMessages | null = null;

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
    this.message = message;
    const validityState: ValidityState = this.input.element.validity;

    if (validityState.valueMissing) {
      this.checkInputValidity(ValidityMessages.EmptyValue + this.inputName);
      return false;
    }
    if (validityState.typeMismatch || validityState.patternMismatch) {
      this.checkInputValidity(message);
      return false;
    }

    this.input.element.setCustomValidity('');
    this.input.element.reportValidity();
    return true;
  }

  private checkInputValidity(message: string): void {
    this.input.element.setCustomValidity(message);
    this.input.element.reportValidity();
    this.showInvalidState();
    this.input.element.addEventListener('input', this.checkIfValidInputCallback);
  }

  private showInvalidState = (): void => {
    this.input.element.classList.add('invalid');
  };

  private checkIfValidInputCallback = (): void => {
    if (this.message && this.checkInput(this.message)) {
      this.input.element.classList.remove('invalid');
      this.input.element.removeEventListener('input', this.checkIfValidInputCallback);
    }
  };

  // public handleInvalidCredentials(): void {
  //   this.input.element.setCustomValidity
  // (`This ${this.inputName} is incorrect. Please, try again!`);
  //   this.input.element.reportValidity();
  // }
}
