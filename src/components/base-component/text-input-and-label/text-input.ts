import './text-input.css';
import i18next from 'i18next';
import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import Svg from '../svg/svg';
import { ValidityMessages } from '../../../pages/splash/forms/form.types';
import EditBlock from '../edit-block/edit-block';
import SvgNames from '../svg/svg.types';
import { ProjectColors } from '../../../utils/consts';
import InputTypes from './text-input.types';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import { Token, UpdateUserData } from '../../../app/loader/loader-requests.types';
import { updateUser } from '../../../app/loader/services/user-services';
import { User } from '../../../app/loader/loader-responses.types';
import eventEmitter from '../../../utils/event-emitter';

export default class Input extends BaseComponent<'div'> {
  public input!: BaseComponent<'input'>;

  public label!: BaseComponent<'label'>;

  public title!: BaseComponent<'span'>;

  public svgIcon?: Svg;

  public inputName!: string;

  public message: ValidityMessages | null = null;

  private editBlockWrapper: BaseComponent<'div'> | null = null;

  public editBlock: EditBlock | null = null;

  private isUpdate: boolean = false;

  public currentValue: string = '';

  private classes: string = '';

  public type: string;

  public token: Token | null = checkDataInLocalStorage('userSessionToken');

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
    this.label = new BaseComponent('label', this.element, 'label');
    if (text) {
      this.title = new BaseComponent('span', this.label.element, '', i18next.t(text).toString());
      this.setInputContent(text);
    }
    this.input = new BaseComponent('input', this.label.element, 'input-text', '', attributes);
    this.type = this.input.element.type;
    this.inputName = this.label.element.innerText.toLowerCase();
    if (attributes && attributes.placeholder) {
      this.input.element.placeholder = i18next.t(attributes.placeholder);
      this.setInputPlaceholder(attributes.placeholder);
    }
  }

  public verify(): boolean {
    return this.input.element.value !== '';
  }

  public get inputValue(): string {
    return this.input.element.value;
  }

  public set newInputValue(text: string) {
    this.input.element.value = text;
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

  public checkInputValidity(message: string): void {
    this.input.element.setCustomValidity(message);
    this.input.element.reportValidity();
    this.showInvalidState();
    this.input.element.addEventListener('input', this.checkIfValidInputCallback);
  }

  public showInvalidState = (): void => {
    this.element.classList.add('invalid');
  };

  private checkIfValidInputCallback = (): void => {
    if (this.message && this.checkInput(this.message)) {
      this.input.element.removeEventListener('input', this.checkIfValidInputCallback);
      this.element.classList.remove('invalid');
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

  private setInputPlaceholder(placeholder: string): void {
    i18next.on('languageChanged', () => {
      this.input.element.placeholder = i18next.t(placeholder);
    });
  }

  public set placeholder(content: string) {
    console.log(content, i18next.t(content));
    this.input.element.placeholder = i18next.t(content);
  }

  public attachEditButton(classes: string, parent?: HTMLElement): void {
    const editParent: HTMLElement = parent || this.element;
    this.editBlockWrapper = new BaseComponent('div', editParent, `${classes}_edit-wrapper`);
    this.editBlock = new EditBlock(this.editBlockWrapper.element, classes);
    this.classes = classes;
    this.editBlock.editBtn.element.addEventListener('click', this.activateInput);
  }

  private activateInput = (): void => {
    this.isUpdate = true;
    this.currentValue = this.input.element.value;
    this.input.element.disabled = false;
    this.newInputValue = '';
    this.input.element.focus();
    this.newInputValue = this.currentValue;
    this.input.element.addEventListener('keydown', this.changeDefaultBehavior);
    if (this.editBlock) {
      this.editBlock.editBtn.replaceBtnSvg(SvgNames.CloseThin, this.classes, ProjectColors.Grey);
      this.editBlock.appendOkButton(this.updateOkButtonCallback);
      // eslint-disable-next-line max-len
      this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.activateInput);
      if (this.type === InputTypes.Text) {
        eventEmitter.emit('countryEditButtonsAttached', {});
      }
    }
  };

  public cancelUpdate = (): void => {
    this.isUpdate = false;
    this.newInputValue = this.currentValue;
    this.input.element.disabled = true;
    if (this.editBlock) {
      this.editBlock.editBtn.replaceBtnSvg(SvgNames.Pencil, this.classes, ProjectColors.Grey);
      this.editBlock.removeOkButton();
      // eslint-disable-next-line max-len
      this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.activateInput);
    }
  };

  public updateOkButtonCallback = (): void => {
    if (this.type === InputTypes.Email) {
      if (!this.checkInput(ValidityMessages.Email)) {
        return;
      }
    }

    if (this.token) {
      const { value } = this.input.element;
      this.currentValue = value;
      updateUser(this.token, this.checkCurrentType(value))
        .then((user: User) => {
          if (user) {
            this.cancelUpdate();
          }
        })
        .catch(() => null);
    }
  };

  private checkCurrentType(value: string): UpdateUserData {
    if (this.type === InputTypes.Email) {
      return { email: value };
    }
    if (this.type === InputTypes.Date) {
      return { birth: value };
    }
    return {};
  }

  private changeDefaultBehavior = (e: KeyboardEvent): void => {
    if (e.code === 'Enter') {
      this.isUpdate = false;
      e.preventDefault();
      this.updateOkButtonCallback();
    }
  };
}
