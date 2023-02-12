import { UpdateUserData, User } from '../../../app/loader/loader.types';
import { updateUser } from '../../../app/loader/services/user-services';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import BaseComponent from '../base-component';
import SvgNames from '../svg/svg.types';
import { TextareaTypes, TextareaLength, TextareaColsNumber } from './editable-textarea.types';
import { ProjectColors, VALID_NAME } from '../../../utils/consts';
import { ValidityMessages } from '../../../pages/splash/forms/form.types';
import DefaultUserInfo from '../../../pages/dashboard/left-menu/left-menu.types';
import './textarea.css';
import EditBlock from '../edit-block/edit-block';

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

  private editBlock: EditBlock = new EditBlock(this.element, this.classes);

  private currentValue: string;

  private isUpdate: boolean = false;

  private type: TextareaTypes;

  private message: string = '';

  private maxLimit: string = '';

  private rowsNumber: number = 1;

  constructor(parent: HTMLElement, private classes: string, text: string, type: TextareaTypes) {
    super('div', parent, `${classes}_wrapper`);

    this.currentValue = text;
    this.type = type;
    this.textarea.element.value = this.currentValue;

    this.addEventListeners();
    this.defineMaxLength();
    this.resizeTextarea();
  }

  private addEventListeners(): void {
    this.editBlock.editBtn.element.addEventListener('click', this.activateTextarea);
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
    this.textarea.element.selectionStart = this.textarea.element.value.length;
    // eslint-disable-next-line max-len
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.CloseThin, this.classes, ProjectColors.Grey);
    this.editBlock.appendOkButton(this.updateOkButtonCallback);
    this.updateTextAlignment();
    this.replaceUpdateBtnEventListener();
  };

  private replaceUpdateBtnEventListener(): void {
    if (this.isUpdate === true) {
      this.editBlock.editBtn.element.removeEventListener('click', this.activateTextarea);
      this.editBlock.editBtn.element.addEventListener('click', this.cancelUpdate);
    } else {
      this.editBlock.editBtn.element.addEventListener('click', this.activateTextarea);
      this.editBlock.editBtn.element.removeEventListener('click', this.cancelUpdate);
    }
  }

  private cancelUpdate = (): void => {
    this.isUpdate = false;
    this.textarea.element.value = this.currentValue;
    this.textarea.element.setAttribute('disabled', '');
    // eslint-disable-next-line max-len
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.Pencil, this.classes, ProjectColors.Grey);
    this.editBlock.removeOkButton();
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
    if (!e.relatedTarget || e.relatedTarget !== this.editBlock.okButton?.element) {
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
