import './select.css';
import { REST_COUNTRIES } from '../../../utils/consts';
import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import { CountryResponse } from '../../../pages/splash/forms/form.types';

export default class Select extends BaseComponent<'select'> {
  private label: BaseComponent<'label'> = new BaseComponent('label', undefined, 'label', 'Country');

  private options: string[];

  private optionsAll: HTMLOptionElement[] = [];

  private callToAction: string = '--Please choose your country--';

  // eslint-disable-next-line max-len
  constructor(
    parent: HTMLElement,
    options: string[],
    additionalClasses?: string,
    countries?: boolean,
    attributes?: {
      [key: string]: string;
    },
  ) {
    const classes = getClassNames('select', additionalClasses);
    super('select', undefined, classes, '', attributes);
    this.options = options;
    if (!countries) {
      parent.append(this.element);
      this.addOptions(options);
    } else {
      parent.append(this.label.element);
      parent.append(this.element);
      this.createCountriesList();
      this.element.setAttribute('required', '');
    }
    this.element.addEventListener('change', () => {
      if (this.optionsAll) {
        this.getSelectedValue();
      }
    });
  }

  public addOptions(options: string[]): void {
    options.forEach((option) => {
      const optionElement = this.createOption(option).element;
      this.element.append(optionElement);
      this.optionsAll.push(optionElement);
    });
  }

  private createOption(name: string): BaseComponent<'option'> {
    return new BaseComponent('option', undefined, '', name, {
      value: name === this.callToAction ? '' : name,
    });
  }

  private createCountriesList(): void {
    Select.retrieveCountriesData().then((countriesList: string[]) => {
      countriesList.unshift(this.callToAction);
      this.addOptions(countriesList);
    });
  }

  private static async retrieveCountriesData(): Promise<string[]> {
    return Select.loadCountrySelectOptions().then((countries: CountryResponse[]) => {
      console.log(countries);
      const names: string[] = countries.reduce((result: string[], country: CountryResponse) => {
        result.push(country.name.replace(/\(.*?\)/g, '').split(',')[0]);
        return result;
      }, []);
      return names;
    });
  }

  private static loadCountrySelectOptions(): Promise<CountryResponse[]> {
    return fetch(REST_COUNTRIES).then((response: Response) => response.json());
  }

  public get selectValue(): string {
    const value: string = this.element.value === this.callToAction ? '' : this.element.value;
    if (!value) {
      this.showInvalidState();
    }
    return value;
  }

  private showInvalidState(): void {
    this.element.classList.add('invalid');
    this.element.addEventListener('change', this.checkIfValidSelectCallback);
  }

  private checkIfValidSelectCallback = (): void => {
    if (this.selectValue !== '') {
      this.element.classList.remove('invalid');
      this.element.removeEventListener('change', this.checkIfValidSelectCallback);
    }
  };

  public getSelectedValue(): string {
    let selectedIndex: number = -1;
    this.optionsAll.forEach((option: HTMLOptionElement, index: number): void => {
      if (option.selected) {
        selectedIndex = index;
      }
    });
    return this.options[selectedIndex];
  }
}
