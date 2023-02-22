import './settings.css';
import { Token } from '../../app/loader/loader-requests.types';
import BaseComponent from '../../components/base-component/base-component';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import Picture from '../../components/base-component/picture/picture';
import Button from '../../components/base-component/button/button';
import EditableTextarea from '../../components/base-component/textarea/editable-textarea/editable-textarea';
import Input from '../../components/base-component/text-input-and-label/text-input';
import DropdownInput from '../splash/forms/dropdown-input/dropdown';
import { getUser } from '../../app/loader/services/user-services';
import { User } from '../../app/loader/loader-responses.types';
import { TextareaTypes } from '../../components/base-component/textarea/editable-textarea/editable-textarea.types';
import { convertRegexToPattern } from '../../utils/utils';
import { ProjectColors, VALID_EMAIL } from '../../utils/consts';
import Select from '../../components/base-component/select/select';
import Svg from '../../components/base-component/svg/svg';
import SvgNames from '../../components/base-component/svg/svg.types';

export default class Settings extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    // перевести все
    heading: 'My profile',
    deleteAccount: 'Delete account',
    updateAccount: 'Update account',
    name: 'Name',
    email: 'Email',
    dateOfBirth: 'Date of birth',
    gender: 'Gender',
    genderDefault: 'Prefer not to say',
    genderMan: 'Man',
    genderWoman: 'Woman',
    country: 'Country',
    bio: 'Short bio',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private settingsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'settings__wrapper');

  private heading: BaseComponent<'h2'> = new BaseComponent(
    'h2',
    this.settingsWrapper.element,
    'settings__heading',
    this.dictionary.heading,
  );

  private avatarWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.settingsWrapper.element,
    'settings__avatar-wrapper',
  );

  private profileImage: Picture = new Picture(this.avatarWrapper.element, 'settings__photo');

  private changePhotoButton: Button = new Button(this.avatarWrapper.element, '', 'settings__photo_btn');

  private changePhotoSVG: Svg = new Svg(
    this.changePhotoButton.element,
    SvgNames.Plus2,
    ProjectColors.DarkTurquoise,
    'settings__photo_btn_svg',
  );

  private inputsWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.settingsWrapper.element,
    'settings__inputs-wrapper',
  );

  private nameWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.inputsWrapper.element,
    'settings__inputs_name-wrapper',
  );

  private nameLabel: BaseComponent<'label'> = new BaseComponent(
    'label',
    this.nameWrapper.element,
    'settings__name_label',
    this.dictionary.name,
  );

  private name: EditableTextarea | null = null;

  private email: Input | null = null;

  private dateOfBirth: Input | null = null;

  private gender: Select | null = null;

  private genderOptions: string[] = [
    this.dictionary.genderDefault,
    this.dictionary.genderMan,
    this.dictionary.genderWoman,
  ];

  private country: DropdownInput | null = null;

  private bio: EditableTextarea | null = null;

  private deleteAccountButton: Button = new Button(
    this.settingsWrapper.element,
    this.dictionary.deleteAccount,
    'settings__btn-delete',
  );

  constructor(parent: HTMLElement) {
    super('section', parent, 'settings section');
    if (this.token) {
      getUser(this.token).then((user: User) => {
        this.renderPage(user);
      });
    }
  }

  private renderPage(user: User): void {
    this.profileImage.element.src = user.avatarUrl;
    this.name = new EditableTextarea(
      this.nameWrapper.element,
      'settings__name',
      user.username,
      TextareaTypes.Username,
      false,
    );
    this.email = new Input(this.inputsWrapper.element, 'signup__form-input form-input', this.dictionary.email, {
      value: user.email,
      type: 'email',
      pattern: convertRegexToPattern(VALID_EMAIL),
      required: '',
    });
    this.dateOfBirth = new Input(
      this.inputsWrapper.element,
      'add-activity__input input-date',
      this.dictionary.dateOfBirth,
      {
        type: 'date',
      },
    );
    this.gender = new Select(this.inputsWrapper.element, this.genderOptions, 'settings', 'settings__select-wrapper');
    this.country = new DropdownInput(this.inputsWrapper.element, 'settings', 'Country');
    this.bio = new EditableTextarea(this.inputsWrapper.element, 'settings__about', user.bio, TextareaTypes.Bio, false);
  }
}
