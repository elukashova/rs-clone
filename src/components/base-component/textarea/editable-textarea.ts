import { UpdateUserData, User } from '../../../app/loader/loader.types';
import { updateUser } from '../../../app/loader/services/user-services';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import BaseComponent from '../base-component';
import Button from '../button/button';
import Svg from '../svg/svg';
import SvgNames from '../svg/svg.types';
import { TextareaTypes, TextareaLength, TextareaColsNumber } from './editable-textarea.types';
import { VALID_NAME } from '../../../utils/consts';
import { ValidityMessages } from '../../../pages/splash/forms/form.types';
import DefaultUserInfo from '../../../pages/dashboard/left-menu/left-menu.types';
import './textarea.css';

export default class EditableTextarea extends BaseComponent<'div'> {
  private textarea: BaseComponent<'textarea'> = new BaseComponent(
    'textarea',
    this.element,
    `${this.classes} textarea`,
    '',
    {
      spellcheck: 'false',
      autofocus: 'off',
      autocomplete: 'off',
      required: '',
      rows: '1',
      disabled: '',
    },
  );

  private updateBtn: Button;

  private updateBtnSVG: Svg;

  private updateOkBtn: Button | undefined;

  private updateOkBtnSVG: Svg | undefined;

  private currentValue: string;

  private isUpdate: boolean = false;

  private type: TextareaTypes;

  private message: string = '';

  private maxLimit: string = '';

  private rowsNumber: number = 1;

  constructor(parent: HTMLElement, private classes: string, text: string, type: TextareaTypes) {
    super('div', parent, `${classes}_wrapper`);
    this.updateBtn = new Button(this.element, '', `${classes}_btn-update`);
    this.updateBtnSVG = new Svg(this.updateBtn.element, SvgNames.Pencil, '#979797', `${classes}_btn-update_svg`);

    this.currentValue = text;
    this.type = type;
    this.textarea.element.value = this.currentValue;

    this.addEventListeners();
    this.defineMaxLength();
    this.resizeTextarea();
  }

  private addEventListeners(): void {
    this.updateBtn.element.addEventListener('click', this.activateTextarea);
    this.textarea.element.addEventListener('keydown', this.changeDefaultBehavior);
    this.textarea.element.addEventListener('blur', this.blurCallback);
  }

  private defineMaxLength(): void {
    this.maxLimit = this.type === TextareaTypes.Bio ? TextareaLength.Bio : TextareaLength.Default;
    this.textarea.element.setAttribute('maxlength', this.maxLimit);
  }

  private activateTextarea = (): void => {
    this.isUpdate = true;
    this.textarea.element.removeAttribute('disabled');
    this.textarea.element.focus();
    this.textarea.element.addEventListener('input', this.resizeTextarea);
    // eslint-disable-next-line max-len
    this.textarea.element.selectionStart = this.textarea.element.value.length;
    this.replaceBtnSvg(SvgNames.CloseThin);
    this.appendOkButton(SvgNames.CheckThin);
    this.updateTextAlignment();
    this.replaceUpdateBtnEventListener();
  };

  private replaceBtnSvg(name: string): void {
    const newSvg: Svg = new Svg(this.updateBtn.element, name, '#979797', `${this.classes}_btn-update_svg`);
    this.updateBtnSVG.replaceSVG(this.updateBtn.element, newSvg.svg);
    this.updateBtnSVG = newSvg;
  }

  private appendOkButton(name: string): void {
    this.updateOkBtn = new Button(this.element, '', `${this.classes}_btn-update`);
    this.updateOkBtnSVG = new Svg(this.updateOkBtn.element, name, '#979797', `${this.classes}_btn-update_svg`);
    this.element.insertBefore(this.updateOkBtn.element, this.updateBtn.element);
    this.updateOkBtn.element.addEventListener('click', this.updateOkButtonCallback);
  }

  private removeOkButton(): void {
    if (this.updateOkBtn) {
      this.element.removeChild(this.updateOkBtn.element);
    }
  }

  private replaceUpdateBtnEventListener(): void {
    if (this.isUpdate === true) {
      this.updateBtn.element.removeEventListener('click', this.activateTextarea);
      this.updateBtn.element.addEventListener('click', this.cancelUpdate);
    } else {
      this.updateBtn.element.addEventListener('click', this.activateTextarea);
      this.updateBtn.element.removeEventListener('click', this.cancelUpdate);
    }
  }

  private cancelUpdate = (): void => {
    this.isUpdate = false;
    this.textarea.element.value = this.currentValue;
    this.textarea.element.setAttribute('disabled', '');
    this.replaceBtnSvg(SvgNames.Pencil);
    this.removeOkButton();
    this.replaceUpdateBtnEventListener();
    this.updateTextAlignment();
    this.resizeTextarea();
  };

  private changeDefaultBehavior = (e: KeyboardEvent): void => {
    if (e.code === 'Enter') {
      this.isUpdate = false;
      e.preventDefault();
      this.updateOkButtonCallback();
    }
  };

  private updateTextAlignment(): void {
    this.textarea.element.style.textAlign = this.isUpdate === true ? 'left' : 'center';
    this.resizeTextarea();
  }

  private updateOkButtonCallback = (): void => {
    if (this.type === TextareaTypes.Username) {
      if (!this.checkTextarea(ValidityMessages.Name)) {
        return;
      }
    } else {
      this.checkTextarea('');
    }

    this.resizeTextarea();

    const id: string | null = EditableTextarea.getIdFromLocalStorage();
    if (id) {
      const { value } = this.textarea.element;
      this.currentValue = value;
      EditableTextarea.updateUser(id, this.checkCurrentType(value))
        .then((user: User) => {
          if (user) {
            this.cancelUpdate();
          }
        })
        .catch(() => null);
    }
  };

  private checkCurrentType(value: string): UpdateUserData {
    if (this.type === TextareaTypes.Username) {
      return { username: value };
    }
    return { bio: value };
  }

  public checkTextarea(message: string): boolean {
    const validityState: ValidityState = this.textarea.element.validity;
    this.message = message;
    if (this.type === TextareaTypes.Username) {
      if (validityState.valueMissing || !this.textarea.element.value.match(VALID_NAME)) {
        this.checkInputValidity(message);
        return false;
      }
    }

    if (this.type === TextareaTypes.Bio) {
      if (validityState.valueMissing) {
        this.textarea.element.value = DefaultUserInfo.DefaultBio;
      }
    }

    this.textarea.element.setCustomValidity('');
    this.textarea.element.reportValidity();
    return true;
  }

  private checkInputValidity(message: string): void {
    this.textarea.element.setCustomValidity(message);
    this.textarea.element.reportValidity();
    this.textarea.element.addEventListener('input', this.checkIfValidInputCallback);
  }

  private checkIfValidInputCallback = (): void => {
    if (this.message && this.checkTextarea(this.message)) {
      this.textarea.element.removeEventListener('input', this.checkIfValidInputCallback);
    }
  };

  private resizeTextarea = (): void => {
    let defaultCols: number;
    if (this.type === TextareaTypes.Username) {
      // eslint-disable-next-line max-len
      defaultCols = !this.isUpdate ? TextareaColsNumber.DefaultName : TextareaColsNumber.IsUpdateName;
    } else {
      defaultCols = !this.isUpdate ? TextareaColsNumber.DefaultBio : TextareaColsNumber.IsUpdateBio;
    }

    const { value } = this.textarea.element;
    const letters: number = value.split('').length;

    this.rowsNumber = Math.ceil(letters / defaultCols);
    this.textarea.element.rows = this.rowsNumber;
  };

  private blurCallback = (e: FocusEvent): void => {
    if (!e.relatedTarget || e.relatedTarget !== this.updateOkBtn?.element) {
      this.cancelUpdate();
    }
  };

  private static updateUser(id: string, data: UpdateUserData): Promise<User> {
    return updateUser(id, data).then((user: User) => user);
  }

  private static getIdFromLocalStorage(): string | null {
    const id: string | null = checkDataInLocalStorage('myUserId');
    return id;
  }
}
