import './select.css';
import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import SvgButton from '../button/svg-btn';
import SvgNames from '../svg/svg.types';
import { ProjectColors } from '../../../utils/consts';

export default class Select extends BaseComponent<'div'> {
  public label: BaseComponent<'label'> = new BaseComponent(
    'label',
    this.element,
    `${this.prefix}__label label`,
    'Type of activity',
  );

  public select: BaseComponent<'select'> = new BaseComponent(
    'select',
    this.label.element,
    `${this.prefix}__select select`,
  );

  private options: string[];

  public optionsAll: HTMLLIElement[] = [];

  private dropdownButton: SvgButton = new SvgButton(
    this.label.element,
    '',
    `${this.prefix}__select__dropdown_btn select__dropdown_btn`,
  );

  private listWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    `${this.prefix}__select_dropdown_list-wrapper select__dropdown_list-wrapper`,
  );

  private list: BaseComponent<'ul'> = new BaseComponent(
    'ul',
    this.listWrapper.element,
    `${this.prefix}__select_dropdown_list select__dropdown_list`,
  );

  private currentOption: BaseComponent<'option'>;

  constructor(
    parent: HTMLElement,
    options: string[],
    private prefix: string,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    const classes = getClassNames('select-wrapper', additionalClasses);
    super('div', parent, classes, '', attributes);

    this.options = options;
    this.currentOption = this.setDefaultValue();

    this.addOptions(options);
    this.setDropDownButton();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.select.element.addEventListener('mousedown', this.selectCallback);
    // this.select.element.addEventListener('blur', this.blurCallback);
    this.list.element.addEventListener('blur', this.hideOptionsList);
    this.dropdownButton.element.addEventListener('click', this.selectCallback);
  }

  public addOptions(options: string[]): void {
    options.forEach((option) => {
      const optionElement = Select.createOption(option).element;
      this.list.element.append(optionElement);
      this.optionsAll.push(optionElement);
      optionElement.addEventListener('click', this.collectInputCallback);
    });
  }

  private static createOption(name: string): BaseComponent<'li'> {
    return new BaseComponent('li', undefined, 'select__dropdown_list-option', name, {
      value: name,
    });
  }

  public get selectValue(): string {
    return this.select.element.value;
  }

  private setDropDownButton(): void {
    this.dropdownButton.appendSvg(SvgNames.DropdownDown, 'select', ProjectColors.Grey);
  }

  public collectInputCallback = (e: Event): void => {
    if (e.target instanceof HTMLLIElement) {
      this.currentOption.element.value = `${e.target.textContent}`;
      this.currentOption.element.textContent = `${e.target.textContent}`;
      this.hideOptionsList();
    }
  };

  private setDefaultValue(): BaseComponent<'option'> {
    return new BaseComponent('option', this.select.element, 'select__option-default', this.options[0]);
  }

  private selectCallback = (e: Event): void => {
    e.preventDefault();
    if (!this.listWrapper.element.classList.contains('visible')) {
      this.dropdownButton.replaceBtnSvg(SvgNames.DropdownUp, 'select', ProjectColors.Grey);
      this.showOptionsList();
      this.highlightCurrentOption();
    } else {
      console.log('wh');
      this.hideOptionsList();
    }
  };

  private showOptionsList(): void {
    this.listWrapper.element.classList.add('visible');
  }

  private hideOptionsList = (): void => {
    this.listWrapper.element.classList.remove('visible');
    this.dropdownButton.replaceBtnSvg(SvgNames.DropdownDown, 'select', ProjectColors.Grey);
  };

  private highlightCurrentOption(): void {
    this.optionsAll.forEach((option) => {
      if (option.classList.contains('currentSelection')) {
        option.classList.remove('currentSelection');
      }
      if (option.textContent === this.currentOption.element.value) {
        option.classList.add('currentSelection');
      }
    });
  }
}
