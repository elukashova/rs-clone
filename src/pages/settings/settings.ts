import './settings.css';
import { Token } from '../../app/loader/loader-requests.types';
import BaseComponent from '../../components/base-component/base-component';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import Picture from '../../components/base-component/picture/picture';
import Button from '../../components/base-component/button/button';
import EditableTextarea from '../../components/base-component/textarea/editable-textarea/editable-textarea';
import Input from '../../components/base-component/text-input-and-label/text-input';
import DropdownInput from '../splash/forms/dropdown-input/dropdown';
import { deleteUser, getUser } from '../../app/loader/services/user-services';
import { User } from '../../app/loader/loader-responses.types';
import { TextareaTypes } from '../../components/base-component/textarea/editable-textarea/editable-textarea.types';
import { convertRegexToPattern } from '../../utils/utils';
import { COUNTRIES_EN, COUNTRIES_RU, ProjectColors, VALID_EMAIL } from '../../utils/consts';
import Svg from '../../components/base-component/svg/svg';
import SvgNames from '../../components/base-component/svg/svg.types';
import GenderBlock from './gender-block/gender-block';
import eventEmitter from '../../utils/event-emitter';
import Routes from '../../app/router/router.types';
import LoadingTimer from '../../components/base-component/loading/loading';
import { EventData } from '../../utils/event-emitter.types';

export default class Settings extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    heading: 'settings.heading',
    deleteAccount: 'settings.deleteAccount',
    updateAccount: 'settings.updateAccount',
    name: 'settings.name',
    email: 'settings.email',
    dateOfBirth: 'settings.dateOfBirth',
    country: 'settings.country',
    bio: 'settings.bio',
  };

  public loadingTimer = new LoadingTimer(document.body);

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private name: EditableTextarea | null = null;

  private email: Input | null = null;

  private dateOfBirth: Input | null = null;

  private genderBlock: GenderBlock | null = null;

  private countryWrapper: BaseComponent<'div'> | null = null;

  private countryLabel: BaseComponent<'label'> | null = null;

  private country: DropdownInput | null = null;

  private bioWrapper: BaseComponent<'div'> | null = null;

  private bioLabel: BaseComponent<'label'> | null = null;

  private bio: EditableTextarea | null = null;

  private heading!: BaseComponent<'h2'>;

  private avatarWrapper!: BaseComponent<'div'>;

  private profileImage!: Picture;

  private changePhotoButton!: Button;

  private changePhotoSVG!: Svg;

  private inputsWrapper!: BaseComponent<'div'>;

  private nameWrapper!: BaseComponent<'div'>;

  private nameLabel!: BaseComponent<'label'>;

  private deleteAccountButton!: Button;

  private settingsWrapper!: BaseComponent<'div'>;

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('section', parent, 'settings section', '', { style: 'display: none' });
    this.init();

    eventEmitter.on('languageChanged', () => {
      if (this.country) {
        this.country.clearOptions();
        this.createCountriesList();
      }
    });

    eventEmitter.on('updateAvatar', (source: EventData) => {
      this.updateProfilePicture(source);
    });
  }

  private init(): void {
    this.loadingTimer.showLoadingCircle();
    setTimeout(() => {
      this.doRequest();
      this.element.style.display = 'flex';
      this.loadingTimer.deleteLoadingCircle();
    }, 3000);
  }

  private doRequest(): void {
    if (this.token) {
      getUser(this.token).then((user: User) => {
        this.renderPage(user);
        this.addEventListeners();
      });
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private renderPage(user: User): void {
    this.settingsWrapper = new BaseComponent('div', this.element, 'settings__wrapper');
    this.heading = new BaseComponent('h2', this.settingsWrapper.element, 'settings__heading', this.dictionary.heading);
    this.avatarWrapper = new BaseComponent('div', this.settingsWrapper.element, 'settings__avatar-wrapper');
    this.profileImage = new Picture(this.avatarWrapper.element, 'settings__photo', { alt: 'profile photo' });
    this.changePhotoButton = new Button(this.avatarWrapper.element, '', 'settings__photo_btn');
    this.changePhotoSVG = new Svg(
      this.changePhotoButton.element,
      SvgNames.Plus2,
      ProjectColors.DarkTurquoise,
      'settings__photo_btn_svg',
    );
    this.inputsWrapper = new BaseComponent('div', this.settingsWrapper.element, 'settings__inputs-wrapper');
    this.nameWrapper = new BaseComponent('div', this.inputsWrapper.element, 'settings__inputs_name-wrapper');
    this.nameLabel = new BaseComponent('label', this.nameWrapper.element, 'settings__name_label', this.dictionary.name);
    this.profileImage.element.src = user.avatarUrl;
    this.name = new EditableTextarea(
      this.nameWrapper.element,
      'settings__name',
      user.username,
      TextareaTypes.Username,
      false,
    );
    this.name.textarea.element.maxLength = 30;
    this.email = new Input(this.inputsWrapper.element, 'settings__input', this.dictionary.email, {
      value: user.email,
      type: 'email',
      pattern: convertRegexToPattern(VALID_EMAIL),
      required: '',
      disabled: '',
    });
    this.dateOfBirth = new Input(
      this.inputsWrapper.element,
      'settings__input settings__input-date',
      this.dictionary.dateOfBirth,
      {
        type: 'date',
        disabled: '',
      },
    );
    this.genderBlock = new GenderBlock(this.inputsWrapper.element);
    this.countryWrapper = new BaseComponent('div', this.inputsWrapper.element, 'settings__country-wrapper');
    this.countryLabel = new BaseComponent(
      'label',
      this.countryWrapper.element,
      'settings__country_label',
      this.dictionary.country,
    );
    this.country = new DropdownInput(this.countryWrapper.element, 'settings', '');
    this.bioWrapper = new BaseComponent('div', this.inputsWrapper.element, 'settings__inputs_bio-wrapper');
    this.bioLabel = new BaseComponent('label', this.bioWrapper.element, 'settings__bio_label', this.dictionary.bio);
    this.bio = new EditableTextarea(this.bioWrapper.element, 'settings__about', user.bio, TextareaTypes.Bio, false);
    this.genderBlock.newCurrentValue = user.gender;
    [this.email, this.dateOfBirth].forEach((input) => input.attachEditButton('settings__input'));
    this.country.attachEditButton('settings__gender', this.countryWrapper.element);
    this.email.title.element.classList.add('settings__input_title');
    this.deleteAccountButton = new Button(
      this.settingsWrapper.element,
      this.dictionary.deleteAccount,
      'settings__btn-delete',
    );
    this.setCurrentValues(user);
    this.createCountriesList();
  }

  private addEventListeners(): void {
    this.changePhotoButton.element.addEventListener('click', this.changePhotoBtnCallback);
    this.deleteAccountButton.element.addEventListener('click', this.deleteAccountCallback);
  }

  private changePhotoBtnCallback = (): void => {
    if (this.profileImage) {
      eventEmitter.emit('openAvatarModal', { url: this.profileImage.element.src });
    }
  };

  private setCurrentValues(user: User): void {
    if (this.country) {
      this.country.input.element.value = user.country;
    }

    if (this.dateOfBirth) {
      this.dateOfBirth.newInputValue = user.birth;
    }
  }

  private createCountriesList(): void {
    const currentLanguage: string = localStorage.getItem('i18nextLng')?.toString() || 'en';
    if (this.country) {
      switch (currentLanguage) {
        case 'rus':
          this.country.retrieveDataForDropdown(COUNTRIES_RU);
          break;
        default:
          this.country.retrieveDataForDropdown(COUNTRIES_EN);
      }
    }
  }

  private deleteAccountCallback = (e: Event): void => {
    e.preventDefault();
    if (this.token) {
      deleteUser(this.token).then(() => {
        this.token = null;
        localStorage.removeItem('userSessionToken');
        localStorage.removeItem('MyStriversId');
        localStorage.removeItem('UserAvatarUrl');
        window.history.pushState({}, '', Routes.SignUp);
        this.replaceMainCallback();
      });
    }
  };

  private updateProfilePicture(url: EventData): void {
    this.profileImage.element.src = `${url.url}`;
  }
}
