import i18next from 'i18next';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import NavigationLink from '../../../components/base-component/link/link';
import Input from '../../../components/base-component/text-input-and-label/text-input';
import './form.css';
import Routes from '../../../app/router/router.types';
import { SignUp, Token } from '../../../app/loader/loader-requests.types';
import { Errors } from '../../../app/loader/loader-responses.types';
import { createUser } from '../../../app/loader/services/user-services';
import { setDataToLocalStorage } from '../../../utils/local-storage';
import { GoogleBtnClasses, GoogleBtnTypes } from '../google-button/google-btn.types';
import GoogleButton from '../google-button/google-btn';
import { COUNTRIES_EN, COUNTRIES_RU, VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from '../../../utils/consts';
import { InputConflictMessages, ValidityMessages } from './form.types';
import { convertRegexToPattern } from '../../../utils/utils';
import DropdownInput from './dropdown-input/dropdown';
import eventEmitter from '../../../utils/event-emitter';

export default class SignupForm extends BaseComponent<'form'> {
  private dictionary: Record<string, string> = {
    accountSignupHeading: 'splash.forms.accountSignupHeading',
    alreadyMember: 'splash.forms.alreadyMember',
    logIn: 'splash.forms.logIn',
    becomeMember: 'splash.forms.becomeMember',
    logInHere: 'splash.forms.logInHere',
    signUp: 'splash.forms.signUp',
    password: 'splash.forms.password',
    email: 'splash.forms.email',
    name: 'splash.forms.name',
    country: 'splash.forms.country',
  };

  private formHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.element,
    'signup__form_header',
    this.dictionary.accountSignupHeading,
  );

  private signUpMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup__form-message',
    this.dictionary.becomeMember,
  );

  private nameInput: Input = new Input(this.element, 'signup__form-input form-input', this.dictionary.name, {
    type: 'text',
    pattern: convertRegexToPattern(VALID_NAME),
    required: '',
    'data-id': 'name',
    maxLength: '30',
  });

  private emailInput: Input = new Input(this.element, 'signup__form-input form-input', this.dictionary.email, {
    type: 'email',
    pattern: convertRegexToPattern(VALID_EMAIL),
    required: '',
    'data-id': 'email',
  });

  private passwordInput: Input = new Input(this.element, 'signup__form-input form-input', this.dictionary.password, {
    type: 'password',
    pattern: convertRegexToPattern(VALID_PASSWORD),
    required: '',
    'data-id': 'password',
  });

  private countryInput: DropdownInput = new DropdownInput(this.element, 'signup', this.dictionary.country);

  private signupButton: Button = new Button(this.element, this.dictionary.signUp, 'signup__btn-main btn_main', {
    type: 'submit',
  });

  private logInMessage: BaseComponent<'span'> = new BaseComponent('span', this.element, 'signup__message-login');

  private alreadyMember: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.logInMessage.element,
    '',
    this.dictionary.alreadyMember,
  );

  private loginLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
    text: this.dictionary.logInHere,
    parent: this.logInMessage.element,
    additionalClasses: 'signup__link-login',
  });

  private googleButton: GoogleButton;

  private newUser: SignUp = {
    username: '',
    email: '',
    google: false,
    password: '',
    country: '',
  };

  private isNewUser: boolean = true;

  private isRegisteredEmail: boolean = false;

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('form', parent, 'signup-form signup', '', {
      autocomplete: 'off',
    });

    this.googleButton = new GoogleButton(
      {
        parent: this.element,
        btnClass: GoogleBtnClasses.Signup,
        signupCallback: this.signUpUser,
      },
      GoogleBtnTypes.Signup,
      this.isNewUser,
    );

    const inputClasses = ['signup__dropdown_input', 'signup__dropdown'];
    inputClasses.forEach((className) => this.countryInput.input.element.classList.add(className));

    this.createCountriesList();
    this.loginLink.element.setAttribute('href', Routes.LogIn);
    this.signupButton.element.addEventListener('click', this.signupBtnCallback);
    eventEmitter.on('languageChanged', () => {
      this.countryInput.clearOptions();
      this.createCountriesList();
    });
  }

  private signupBtnCallback = (e: Event): void => {
    if (this.checkInputs(e)) {
      e.preventDefault();
      this.collectUserData();
      this.signUpUser(this.newUser);
    }
  };

  private collectUserData(): void {
    this.newUser.username = this.nameInput.inputValue;
    this.newUser.email = this.emailInput.inputValue;
    this.newUser.password = this.passwordInput.inputValue;
    this.newUser.country = this.countryInput.inputValue;
  }

  private checkInputs = (e: Event): boolean => {
    const conditionsArray: boolean[] = [
      this.countryInput.checkIfValidCountry(),
      this.passwordInput.checkInput(i18next.t(ValidityMessages.Password)),
      this.emailInput.checkInput(i18next.t(ValidityMessages.Email)),
      this.nameInput.checkInput(i18next.t(ValidityMessages.Name)),
    ];

    if (conditionsArray.includes(false)) {
      e.preventDefault();
      return false;
    }

    return true;
  };

  private signUpUser = (user: SignUp): void => {
    SignupForm.createUser(user)
      .then((token: Token) => {
        if (token) {
          this.changeRoute();
        }
      })
      .catch((err: Error) => {
        if (err.message === Errors.UserAlreadyExists && this.isRegisteredEmail === false) {
          this.showUserAlreadyRegisteredMessage();
          this.isRegisteredEmail = true;
        }
      });
  };

  private changeRoute(): void {
    window.history.pushState({}, '', Routes.Dashboard);
    this.replaceMainCallback();
  }

  private static createUser(user: SignUp): Promise<Token> {
    return createUser(user).then((token) => {
      setDataToLocalStorage(token, 'userSessionToken');
      return token;
    });
  }

  private showUserAlreadyRegisteredMessage(): void {
    const messageContainer: BaseComponent<'span'> = new BaseComponent('span', undefined, 'signup__error-message');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const message: BaseComponent<'span'> = new BaseComponent(
      'span',
      messageContainer.element,
      '',
      InputConflictMessages.UserAlreadyExists,
    );

    const logInLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
      text: this.dictionary.logInHere,
      parent: messageContainer.element,
      additionalClasses: 'signup__link-login',
    });
    logInLink.element.setAttribute('href', Routes.LogIn);
    this.element.insertBefore(messageContainer.element, this.signupButton.element);
  }

  private createCountriesList(): void {
    const currentLanguage: string = localStorage.getItem('i18nextLng')?.toString() || 'en';
    switch (currentLanguage) {
      case 'rus':
        this.countryInput.retrieveDataForDropdown(COUNTRIES_RU);
        break;
      default:
        this.countryInput.retrieveDataForDropdown(COUNTRIES_EN);
    }
  }
}
