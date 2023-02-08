import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import NavigationLink from '../link/link';
import Input from '../input/input';
import './form.css';
import Routes from '../../app/loader/router/router.types';
import { SignUp, Token } from '../../app/loader/loader.types';
import { createUser, getUser } from '../../app/loader/services/user-services';
import { setDataToLocalStorage } from '../../utils/local-storage/local-storage';
import { GoogleBtnClasses, GoogleBtnTypes } from '../google-button/google-btn.types';
import GoogleButton from '../google-button/google-btn';
import { VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from '../../utils/consts';
import { ValidityMessages } from './form.types';
import Select from '../select/select';
import { convertRegexToPattern } from '../../utils/utils';

export default class SignupForm extends BaseComponent<'form'> {
  private formHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.element,
    'signup__form_header',
    'Account Signup',
  );

  private signUpMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup__form-message',
    'Become a member and enjoy exclusive promotions.',
  );

  private nameInput: Input = new Input(this.element, 'signup__form-input form-input', 'Full Name', {
    type: 'text',
    pattern: convertRegexToPattern(VALID_NAME),
    required: '',
  });

  private emailInput: Input = new Input(this.element, 'signup__form-input form-input', 'Email address', {
    type: 'email',
    pattern: convertRegexToPattern(VALID_EMAIL),
    required: '',
  });

  private passwordInput: Input = new Input(this.element, 'signup__form-input form-input', 'Password', {
    type: 'password',
    pattern: convertRegexToPattern(VALID_PASSWORD),
    required: '',
  });

  private countrySelect: Select = new Select(this.element, [], 'signup__form-select form-select', true);

  private signupButton: Button = new Button(this.element, 'Sign up', 'signup__btn-main btn_main', {
    type: 'submit',
  });

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup__message-login',
    'Already a member? ',
  );

  private loginLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Log in here',
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
      try {
        this.collectUserData();
        this.signUpUser(this.newUser);
      } catch (err) {
        console.log(err); // temporary console.log
      }
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
    SignupForm.createUser(user).then((token) => SignupForm.getUser(token));
    this.changeRoute();
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

  // этот метод потом будет вынесен в загрузку dashboard
  private static getUser(token: Token): void {
    getUser(token).then((user) => console.log(user));
  }
}
