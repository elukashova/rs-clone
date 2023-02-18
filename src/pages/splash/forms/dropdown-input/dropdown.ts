import './dropdown.css';
import BaseComponent from '../../../../components/base-component/base-component';
import Input from '../../../../components/base-component/text-input-and-label/text-input';
import { ValidityMessages } from '../form.types';

export default class DropdownInput extends Input {
  private listWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    `${this.prefix}__dropdown_list-wrapper dropdown_list-wrapper`,
  );

  private list: BaseComponent<'ul'> = new BaseComponent(
    'ul',
    this.listWrapper.element,
    `${this.prefix}__dropdown_list dropdown_list`,
  );

  private allOptionsElements: HTMLLIElement[] = [];

  private optionsStrings: string[] = [];

  constructor(private parent: HTMLElement, private prefix: string, private text: string) {
    super(parent, `${prefix}__dropdown dropdown-menu`, text, {
      type: text,
      required: '',
    });
    const inputClasses = ['signup__dropdown_input', 'signup__dropdown'];
    inputClasses.forEach((className) => this.input.element.classList.add(className));

    this.input.element.addEventListener('input', this.filterOptionsCallback);
    this.input.element.addEventListener('blur', this.hideOptionsList);
  }

  public retrieveDataForDropdown(countriesList: string[]): void {
    this.optionsStrings = countriesList.slice();
    this.appendOptions(this.optionsStrings);
  }

  public appendOptions(options: string[]): void {
    options.forEach((option) => {
      const optionElement: BaseComponent<'li'> = new BaseComponent(
        'li',
        undefined,
        `${this.prefix}__dropdown_list-option dropdown_list-option`,
        option,
      );
      this.list.element.append(optionElement.element);
      this.allOptionsElements.push(optionElement.element);
      optionElement.element.addEventListener('click', this.collectInputCallback);
    });
  }

  public filterOptionsCallback = (): void => {
    this.clearOptions();
    const value: string = this.input.element.value.toLowerCase();
    if (value.length > 0) {
      // eslint-disable-next-line max-len, prettier/prettier
      const filteredOptions = this.optionsStrings.filter((option) => option.toLowerCase().includes(value));
      if (filteredOptions.length > 0) {
        this.showOptionsList();
        this.appendOptions(filteredOptions);
      } else {
        this.hideOptionsList();
      }
    } else {
      this.appendOptions(this.optionsStrings);
      this.hideOptionsList();
    }
  };

  private clearOptions(): void {
    this.allOptionsElements.forEach((option) => {
      this.list.element.removeChild(option);
    });
    this.allOptionsElements = [];
  }

  private showOptionsList = (): void => {
    this.listWrapper.element.classList.add('visible');
  };

  private hideOptionsList = (): void => {
    this.listWrapper.element.classList.remove('visible');
  };

  private collectInputCallback = (e: Event): void => {
    if (e.target instanceof HTMLLIElement) {
      this.input.element.value = `${e.target.innerText}`;
      this.checkIfValidCountry();
    }
  };

  private setValidState(): void {
    if (this.element.classList.contains('invalid')) {
      this.element.classList.remove('invalid');
    }
  }

  public checkIfValidCountry(): boolean {
    const validityState: ValidityState = this.input.element.validity;

    if (validityState.valueMissing) {
      this.checkInputValidity(ValidityMessages.EmptyValue + this.inputName);
      return false;
    }

    const currentInput: string = this.input.element.value;
    const isMatch: boolean = this.optionsStrings.includes(currentInput);
    if (!isMatch) {
      this.handleCustomValidity(ValidityMessages.Country);
      this.showInvalidState();
      this.input.element.addEventListener('input', this.checkValidityCallback);
      return false;
    }

    this.handleCustomValidity('');
    this.setValidState();
    return true;
  }

  private handleCustomValidity(message: string): void {
    this.input.element.setCustomValidity(message);
    this.input.element.reportValidity();
  }

  private checkValidityCallback = (): void => {
    if (this.checkInput(ValidityMessages.Country)) {
      this.input.element.removeEventListener('input', this.checkValidityCallback);
      this.setValidState();
    }
  };
}