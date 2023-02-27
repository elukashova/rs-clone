import i18next from 'i18next';
import { Token, UpdateUserData } from '../../../../app/loader/loader-requests.types';
import { User } from '../../../../app/loader/loader-responses.types';
import { updateUser } from '../../../../app/loader/services/user-services';
import { checkDataInLocalStorage } from '../../../../utils/local-storage';
import BaseComponent from '../../base-component';
import SvgNames from '../../svg/svg.types';
import { TextareaTypes, TextareaLength, TextareaColsNumber } from './editable-textarea.types';
import { ProjectColors, VALID_NAME } from '../../../../utils/consts';
import { ValidityMessages } from '../../../../pages/splash/forms/form.types';
import '../textarea.css';
import EditBlock from '../../edit-block/edit-block';

export default class EditableTextarea extends BaseComponent<'div'> {
  public textarea: BaseComponent<'textarea'> = new BaseComponent(
    'textarea',
    this.element,
    `${this.classes} textarea`,
    '',
    {
      spellcheck: 'false',
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

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  constructor(
    parent: HTMLElement,
    private classes: string,
    text: string,
    type: TextareaTypes,
    private isDashboard: boolean,
  ) {
    super('div', parent, `${classes}_wrapper`);

    this.currentValue = text;
    this.type = type;
    this.textarea.element.value = this.currentValue;

    this.addEventListeners();
    this.defineMaxLength();
    this.resizeTextarea();

    if (!this.isDashboard) {
      this.textarea.element.style.textAlign = 'left';
    } else {
      this.updateTextAlignment();
    }
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
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.CloseThin, this.classes, ProjectColors.Grey);
    this.editBlock.appendOkButton(this.updateOkButtonCallback);
    this.updateTextAlignment();
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.activateTextarea);
  };

  private cancelUpdate = (): void => {
    this.isUpdate = false;
    this.textarea.element.value = this.currentValue;
    this.textarea.element.setAttribute('disabled', '');
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.Pencil, this.classes, ProjectColors.Grey);
    this.editBlock.removeOkButton();
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.activateTextarea);
    if (this.isDashboard) {
      this.updateTextAlignment();
    }
    this.resizeTextarea();
  };

  private changeDefaultBehavior = (e: KeyboardEvent): void => {
    if (e.code === 'Enter') {
      this.isUpdate = false;
      e.preventDefault();
      this.updateOkButtonCallback();
    }
  };

  public updateTextAlignment(): void {
    this.textarea.element.style.textAlign = this.isUpdate === true ? 'left' : 'center';
    this.resizeTextarea();
  }

  private updateOkButtonCallback = (): void => {
    if (this.type === TextareaTypes.Username) {
      if (!this.checkTextarea(i18next.t(ValidityMessages.Name))) {
        return;
      }
    } else {
      this.checkTextarea('');
    }

    this.resizeTextarea();

    if (this.token) {
      const { value } = this.textarea.element;
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
        this.textarea.element.value = '';
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
    if (this.type === TextareaTypes.Username && this.isDashboard) {
      // eslint-disable-next-line max-len
      defaultCols = !this.isUpdate ? TextareaColsNumber.DefaultName : TextareaColsNumber.IsUpdateName;
    } else if (this.type === TextareaTypes.Username && !this.isDashboard) {
      // eslint-disable-next-line max-len
      defaultCols = !this.isUpdate ? TextareaColsNumber.DefaultName * 2 : TextareaColsNumber.IsUpdateName * 2;
    } else {
      defaultCols = !this.isUpdate ? TextareaColsNumber.DefaultBio : TextareaColsNumber.IsUpdateBio;
    }

    const { value } = this.textarea.element;
    const letters: number = value.split('').length;

    if (letters === 0) {
      this.rowsNumber = 1;
    } else {
      this.rowsNumber = Math.ceil(letters / defaultCols);
    }
    this.textarea.element.rows = this.rowsNumber;
  };

  private blurCallback = (e: FocusEvent): void => {
    if (!e.relatedTarget || e.relatedTarget !== this.editBlock.okButton?.element) {
      this.cancelUpdate();
    }
  };
}
