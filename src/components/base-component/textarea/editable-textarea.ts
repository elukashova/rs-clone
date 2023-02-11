import { UpdateUserData, User } from '../../../app/loader/loader.types';
import { updateUser } from '../../../app/loader/services/user-services';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import BaseComponent from '../base-component';
import Button from '../button/button';
import Svg from '../svg/svg';
import SvgNames from '../svg/svg.types';
import './editable-textarea.css';
import TextareaTypes from './editable-textarea.types';

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

  constructor(parent: HTMLElement, private classes: string, text: string, type: TextareaTypes) {
    super('div', parent, `${classes}_wrapper`);
    this.updateBtn = new Button(this.element, '', `${classes}_btn-update`);
    this.updateBtnSVG = new Svg(this.updateBtn.element, SvgNames.Pencil, '#979797', `${classes}_btn-update_svg`);
    this.currentValue = text;
    this.type = type;
    this.textarea.element.value = this.currentValue;
    this.updateBtn.element.addEventListener('click', this.activateTextarea);
    this.textarea.element.addEventListener('keydown', EditableTextarea.changeDefaultBehavior);
  }

  private activateTextarea = (): void => {
    this.isUpdate = true;
    this.textarea.element.removeAttribute('disabled');
    this.textarea.element.focus();
    this.replaceBtnSvg(SvgNames.CloseThin);
    this.appendOkButton(SvgNames.CheckThin);
    this.updateTextAlignmentn();
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
    this.updateOkBtn.element.addEventListener('click', this.appendOkButtonCallback);
  }

  private removeOkButton(): void {
    if (this.updateOkBtn) {
      this.element.removeChild(this.updateOkBtn.element);
    }
  }

  private replaceUpdateBtnEventListener(): void {
    if (this.isUpdate === true) {
      this.updateBtn.element.removeEventListener('click', this.activateTextarea);
      this.updateBtn.element.addEventListener('click', this.cancelNameUpdate);
    } else {
      this.updateBtn.element.addEventListener('click', this.activateTextarea);
      this.updateBtn.element.removeEventListener('click', this.cancelNameUpdate);
    }
  }

  private cancelNameUpdate = (): void => {
    this.isUpdate = false;
    this.textarea.element.value = this.currentValue;
    this.textarea.element.setAttribute('disabled', '');
    this.replaceBtnSvg(SvgNames.Pencil);
    this.removeOkButton();
    this.replaceUpdateBtnEventListener();
    this.updateTextAlignmentn();
  };

  private static changeDefaultBehavior = (e: KeyboardEvent): void => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  };

  private updateTextAlignmentn(): void {
    this.textarea.element.style.textAlign = this.isUpdate === true ? 'left' : 'center';
  }

  private appendOkButtonCallback = (): void => {
    const id: string | null = EditableTextarea.getIdFromLocalStorage();
    if (id) {
      const { value } = this.textarea.element;
      this.currentValue = value;
      EditableTextarea.updateUser(id, this.checkCurrentType(value))
        .then((user: User) => {
          if (user) {
            console.log(user);
            this.cancelNameUpdate();
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

  private static updateUser(id: string, data: UpdateUserData): Promise<User> {
    return updateUser(id, data).then((user: User) => user);
  }

  private static getIdFromLocalStorage(): string | null {
    const id: string | null = checkDataInLocalStorage('myUserId');
    return id;
  }
}
