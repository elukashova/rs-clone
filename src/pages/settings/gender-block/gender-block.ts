import './gender-block.css';
import BaseComponent from '../../../components/base-component/base-component';
import Input from '../../../components/base-component/text-input-and-label/text-input';
import EditBlock from '../../../components/base-component/edit-block/edit-block';
import SvgNames from '../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../utils/consts';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import { Token } from '../../../app/loader/loader-requests.types';

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
    },
  );

  private genderMan: Input = new Input(this.radioButtons.element, 'settings__input-radio', this.dictionary.genderMan, {
    type: 'radio',
  });

  private genderWoman: Input = new Input(
    this.radioButtons.element,
    'settings__input-radio',
    this.dictionary.genderWoman,
    {
      type: 'radio',
    },
  );

  private editBlockWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'settings__gender_edit-wrapper',
  );

  private editBlock: EditBlock = new EditBlock(this.editBlockWrapper.element, 'settings__gender');

  private isUpdate: boolean = false;

  constructor(parent: HTMLElement) {
    super('div', parent, 'settings__gender_wrapper');
    this.editBlock.editBtn.element.addEventListener('click', this.showChoiceOptions);
    this.handleGenderInputs();
    // this.renderRadioButtons();
  }

  private showChoiceOptions = (): void => {
    this.isUpdate = true;
    this.radioButtons.element.classList.add('visible-buttons');
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.CloseThin, 'settings__gender', ProjectColors.Grey);
    this.editBlock.appendOkButton(this.updateOkButtonCallback);
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.showChoiceOptions);
  };

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
      // const { value } = this.textarea.element;
      // this.currentValue = value;
      // updateUser(this.token, this.checkCurrentType(value))
      //   .then((user: User) => {
      //     if (user) {
      //       this.cancelUpdate();
      //     }
      //   })
      //   .catch(() => null);
      console.log(this.token);
    }
  };

  private cancelUpdate = (): void => {
    this.isUpdate = false;
    this.radioButtons.element.classList.remove('visible-buttons');
    // this.textarea.element.value = this.currentValue;
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.Pencil, 'settings__gender', ProjectColors.Grey);
    this.editBlock.removeOkButton();
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelUpdate, this.showChoiceOptions);
  };
}
