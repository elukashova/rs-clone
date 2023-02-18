import './text-input.css';
import i18next from 'i18next';
import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import Svg from '../svg/svg';
import { ValidityMessages } from '../../../pages/splash/forms/form.types';

export default class Input extends BaseComponent<'div'> {
  public input: BaseComponent<'input'>;

  public label: BaseComponent<'label'>;

  public title!: BaseComponent<'span'>;

  public svgIcon?: Svg;

  private inputName: string;

  private message: ValidityMessages | null = null;

  constructor(
    parent: HTMLElement,
    additionalClasses: string,
    text?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    const classes = getClassNames('input', additionalClasses);
    super('div', parent, classes);
    this.label = new BaseComponent('label', this.element, '');
    if (text) {
      this.title = new BaseComponent('span', this.label.element, '', i18next.t(text).toString());
      this.setInputContent(text);
    }
    this.input = new BaseComponent('input', this.label.element, '', '', attributes);
    this.inputName = this.label.element.innerText.toLowerCase();
  }

  public verify(): boolean {
    return this.input.element.value !== '';
  }

  public get inputValue(): string {
    return this.input.element.value;
  }

  public set newInputValue(text: string) {
    /* this.input.element.setAttribute('value', `${text}`); */
    this.input.element.value = text;
    /* this.input.element.textContent = text; */
  }

  public checkInput(message: ValidityMessages): boolean {
    const validityState: ValidityState = this.input.element.validity;
    this.message = message;

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
    this.element.classList.add('invalid');
  };

  private checkIfValidInputCallback = (): void => {
    if (this.message && this.checkInput(this.message)) {
      this.element.classList.remove('invalid');
      this.input.element.removeEventListener('input', this.checkIfValidInputCallback);
    }
  };

  public addSvgIcon = (svgName: string, color: string, text: string): void => {
    this.svgIcon = new Svg(this.label.element, svgName, color, `${text.toLowerCase()}-icon`);
  };

  private setInputContent(content: string): void {
    i18next.on('languageChanged', () => {
      this.title.element.textContent = i18next.t(content);
    });
  }
}
