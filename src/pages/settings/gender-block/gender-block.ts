import './gender-block.css';
import BaseComponent from '../../../components/base-component/base-component';
import Input from '../../../components/base-component/text-input-and-label/text-input';
import EditBlock from '../../../components/base-component/edit-block/edit-block';
import SvgNames from '../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../utils/consts';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import { Token, UpdateUserData } from '../../../app/loader/loader-requests.types';
import { updateUser } from '../../../app/loader/services/user-services';
import { User } from '../../../app/loader/loader-responses.types';

export default class GenderBlock extends BaseComponent<'div'> {
  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private dictionary: Record<string, string> = {
    // перевести все
    genderTitle: 'Gender',
    genderDefault: 'Prefer not to say',
    genderMan: 'Man',
    genderWoman: 'Woman',
  };

  private genderTitle: BaseComponent<'label'> = new BaseComponent(
    'label',
    this.element,
    'settings__gender_title',
    this.dictionary.genderTitle,
  );

  private genderCurrentChoice: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'settings__gender_current',
  );

  private radioButtons: BaseComponent<'div'> = new BaseComponent('div', this.element, 'settings__buttons-radio');

  private genderDefault: Input = new Input(
    this.radioButtons.element,
    'settings__input-radio',
    this.dictionary.genderDefault,
    {
      type: 'radio',
      name: 'gender',
      value: 'Prefer not to say',
    },
  );

  private genderMan: Input = new Input(this.radioButtons.element, 'settings__input-radio', this.dictionary.genderMan, {
    type: 'radio',
    name: 'gender',
    value: 'Man',
  });

  private genderWoman: Input = new Input(
    this.radioButtons.element,
    'settings__input-radio',
    this.dictionary.genderWoman,
    {
      type: 'radio',
      name: 'gender',
      value: 'Woman',
    },
  );

  private editBlockWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'settings__gender_edit-wrapper',
  );

  private editBlock: EditBlock = new EditBlock(this.editBlockWrapper.element, 'settings__gender');

  private isUpdate: boolean = false;

  private currentValue: string = '';

  private currentChoice: UpdateUserData = {
    gender: '',
  };

  constructor(parent: HTMLElement) {
    super('div', parent, 'settings__gender_wrapper');
    this.editBlock.editBtn.element.addEventListener('click', this.showChoiceOptions);
    this.handleGenderInputs();
    this.addEventListeners();
  }

  public set newCurrentValue(text: string) {
    this.genderCurrentChoice.element.textContent = text;
  }

  private addEventListeners(): void {
    // eslint-disable-next-line max-len
    [this.genderDefault.input.element, this.genderMan.input.element, this.genderWoman.input.element].forEach(
      (input) => {
        input.addEventListener('click', this.saveCurrentChoice);
      },
    );
  }

  private saveCurrentChoice = (e: Event): void => {
    if (e.target instanceof HTMLInputElement) {
      this.currentChoice.gender = e.target.value;
    }
  };

  private showChoiceOptions = (): void => {
    this.isUpdate = true;
    this.currentValue = `${this.genderCurrentChoice.element.textContent}`;
    this.highlightCurrentChoice();
    this.genderCurrentChoice.element.classList.add('current-hidden');
    this.radioButtons.element.classList.add('visible-buttons');
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.CloseThin, 'settings__gender', ProjectColors.Grey);
    this.editBlock.appendOkButton(this.updateOkButtonCallback);
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.showChoiceOptions);
  };

  private highlightCurrentChoice(): void {
    // eslint-disable-next-line max-len
    [this.genderDefault.input.element, this.genderMan.input.element, this.genderWoman.input.element].forEach(
      (input) => {
        if (input.value === this.currentValue) {
          // eslint-disable-next-line no-param-reassign
          input.checked = true;
        }
      },
    );
  }

  private handleGenderInputs(): void {
    [this.genderDefault, this.genderMan, this.genderWoman].forEach((input) => {
      input.element.classList.remove('input');
      input.input.element.classList.remove('input-text');
      input.label.element.classList.add('radio-label');
      input.input.element.classList.add('input-radio');
    });
  }

  private updateOkButtonCallback = (): void => {
    if (this.token) {
      updateUser(this.token, this.currentChoice)
        .then((user: User) => {
          if (user) {
            this.cancelUpdate();
            this.newCurrentValue = `${this.currentChoice.gender}`;
          }
        })
        .catch(() => null);
    }
  };

  private cancelUpdate = (): void => {
    this.isUpdate = false;
    this.radioButtons.element.classList.remove('visible-buttons');
    this.genderCurrentChoice.element.classList.remove('current-hidden');
    this.genderCurrentChoice.element.textContent = this.currentValue;
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.Pencil, 'settings__gender', ProjectColors.Grey);
    this.editBlock.removeOkButton();
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.showChoiceOptions);
  };
}
