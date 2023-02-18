import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import NavigationLink from '../../../components/base-component/link/link';
import Input from '../../../components/base-component/text-input-and-label/text-input';
import './form.css';
import Routes from '../../../app/router/router.types';
import { Errors, SignUp, Token } from '../../../app/loader/loader.types';
import { createUser } from '../../../app/loader/services/user-services';
import { setDataToLocalStorage } from '../../../utils/local-storage';
import { GoogleBtnClasses, GoogleBtnTypes } from '../google-button/google-btn.types';
import GoogleButton from '../google-button/google-btn';
import { VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from '../../../utils/consts';
import { InputConflictMessages, ValidityMessages } from './form.types';
import Select from '../../../components/base-component/select/select';
import { convertRegexToPattern } from '../../../utils/utils';

export default class SignupForm extends BaseComponent<'form'> {
  private dictionary: Record<string, string> = {
    accountSignupHeading: 'splash.forms.accountSignupHeading',
    alreadyMember: 'splash.forms.alreadyMember',
    logIn: 'splash.forms.logIn',
    becomeMember: 'splash.forms.becomeMember',
    logInHere: 'splash.forms.logInHere',
    signUp: 'splash.forms.signUp',
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

  private nameInput: Input = new Input(this.element, 'signup__form-input form-input', 'Full Name', {
    type: 'text',
    pattern: convertRegexToPattern(VALID_NAME),
    required: '',
  }); // не будет работать

  private emailInput: Input = new Input(this.element, 'signup__form-input form-input', 'Email address', {
    type: 'email',
    pattern: convertRegexToPattern(VALID_EMAIL),
    required: '',
  }); // не будет работать

  private passwordInput: Input = new Input(this.element, 'signup__form-input form-input', 'Password', {
    type: 'password',
    pattern: convertRegexToPattern(VALID_PASSWORD),
    required: '',
  }); // не будет работать

  private countrySelect: Select = new Select(this.element, [], 'signup__form-select form-select', true);

  private signupButton: Button = new Button(this.element, this.dictionary.signUp, 'signup__btn-main btn_main', {
    type: 'submit',
  });

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup__message-login',
    'already a member? ',
  ); // не будет работать

  private loginLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
    text: 'login here',
    parent: this.logInMessage.element,
    additionalClasses: 'signup__link-login',
  }); // не будет работать

  private googleButton: GoogleButton;

  private newUser: SignUp = {
    username: '',
    email: '',
    google: false,
    password: '',
    country: '',
  };

  private isNewUser: boolean = true;

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('form', parent, 'signup-form signup', '', {
      autocomplete: 'on',
    });

    this.loginLink.element.setAttribute('href', Routes.LogIn);
    this.googleButton = new GoogleButton(
      {
        parent: this.element,
        btnClass: GoogleBtnClasses.Signup,
        signupCallback: this.signUpUser,
      },
      GoogleBtnTypes.Signup,
      this.isNewUser,
    );

    this.signupButton.element.addEventListener('click', this.signupBtnCallback);
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
    this.newUser.country = this.countrySelect.selectValue;
  }

  private checkInputs = (e: Event): boolean => {
    const conditionsArray: boolean[] = [
      this.passwordInput.checkInput(ValidityMessages.Password),
      this.emailInput.checkInput(ValidityMessages.Email),
      this.nameInput.checkInput(ValidityMessages.Name),
      Boolean(this.countrySelect.selectValue),
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
        if (err.message === Errors.UserAlreadyExists) {
          this.showUserAlreadyRegisteredMessage();
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
    const message: HTMLSpanElement = document.createElement('span');
    message.textContent = InputConflictMessages.UserAlreadyExists;
    const logInLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
      text: this.dictionary.logIn,
      parent: message,
      additionalClasses: 'signup__link-login',
    });
    logInLink.element.setAttribute('href', Routes.LogIn);
    this.element.insertBefore(message, this.signupButton.element);
  }
}
