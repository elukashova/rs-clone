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
import { REST_COUNTRIES, VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from '../../../utils/consts';
import { CountryResponse, InputConflictMessages, ValidityMessages } from './form.types';
import { convertRegexToPattern } from '../../../utils/utils';
import DropdownInput from './dropdown-input/dropdown';

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

  private countryInput: DropdownInput = new DropdownInput(this.element, 'signup', 'Country');

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

    this.createCountriesList();
    this.loginLink.element.setAttribute('href', Routes.LogIn);
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
    this.newUser.country = this.countryInput.inputValue;
  }

  private checkInputs = (e: Event): boolean => {
    const conditionsArray: boolean[] = [
      this.countryInput.checkIfValidCountry(),
      this.passwordInput.checkInput(ValidityMessages.Password),
      this.emailInput.checkInput(ValidityMessages.Email),
      this.nameInput.checkInput(ValidityMessages.Name),
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
    const message: BaseComponent<'span'> = new BaseComponent(
      'span',
      undefined,
      'signup__error-message',
      InputConflictMessages.UserAlreadyExists,
    );

    const logInLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
      text: 'log in',
      parent: message.element,
      additionalClasses: 'signup__link-login',
    });
    logInLink.element.setAttribute('href', Routes.LogIn);
    this.element.insertBefore(message.element, this.signupButton.element);
  }

  private createCountriesList(): void {
    SignupForm.retrieveCountriesData().then((countriesList: string[]) => {
      this.countryInput.retrieveDataForDropdown(countriesList);
    });
  }

  private static async retrieveCountriesData(): Promise<string[]> {
    return SignupForm.loadCountryInputOptions().then((countries: CountryResponse[]) => {
      const names: string[] = countries.reduce((result: string[], country: CountryResponse) => {
        result.push(country.name.replace(/\(.*?\)/g, '').split(',')[0]);
        return result;
      }, []);
      return names;
    });
  }

  private static loadCountryInputOptions(): Promise<CountryResponse[]> {
    return fetch(REST_COUNTRIES).then((response: Response) => response.json());
  }
}
