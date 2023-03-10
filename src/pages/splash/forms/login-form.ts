/* eslint-disable prettier/prettier */
import i18next from 'i18next';
import Routes from '../../../app/router/router.types';
import { LogIn, Token } from '../../../app/loader/loader-requests.types';
import { Errors } from '../../../app/loader/loader-responses.types';
import { loginUser } from '../../../app/loader/services/user-services';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import Input from '../../../components/base-component/text-input-and-label/text-input';
import './form.css';
import { GoogleBtnClasses, GoogleBtnTypes } from '../google-button/google-btn.types';
import GoogleButton from '../google-button/google-btn';
import { setDataToLocalStorage } from '../../../utils/local-storage';
import NavigationLink from '../../../components/base-component/link/link';
import { VALID_EMAIL, VALID_PASSWORD } from '../../../utils/consts';
import { InputConflictMessages, ValidityMessages } from './form.types';
import { convertRegexToPattern } from '../../../utils/utils';

export default class LoginForm extends BaseComponent<'form'> {
  private dictionary: Record<string, string> = {
    accountLoginHeading: 'splash.forms.accountLoginHeading',
    loginMessage: 'splash.forms.loginMessage',
    logIn: 'splash.forms.logIn',
    notMember: 'splash.forms.notMember',
    signUpHere: 'splash.forms.signUpHere',
    signUp: 'splash.forms.signUp',
    password: 'splash.forms.password',
    email: 'splash.forms.email',
  };

  private formHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.element,
    'login__form_header',
    this.dictionary.accountLoginHeading,
  );

  private googleBtn: GoogleButton;

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'login-form-message',
    this.dictionary.loginMessage,
  );

  public emailInput: Input = new Input(this.element, 'login__form-input form-input', this.dictionary.email, {
    type: 'email',
    required: '',
    pattern: convertRegexToPattern(VALID_EMAIL),
    'data-id': 'email',
  });

  public passwordInput: Input = new Input(this.element, 'login__form-input form-input', this.dictionary.password, {
    type: 'password',
    required: '',
    pattern: convertRegexToPattern(VALID_PASSWORD),
    'data-id': 'password',
  });

  public loginButton: Button = new Button(this.element, this.dictionary.logIn, 'login__btn-main btn_main');

  private signUpMessage: BaseComponent<'span'> = new BaseComponent('span', this.element, 'login_message-sigup');

  private notMember: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.signUpMessage.element,
    '',
    this.dictionary.notMember,
  );

  private signupLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
    text: this.dictionary.signUpHere,
    parent: this.signUpMessage.element,
    additionalClasses: 'login__link-signup',
  });

  private user: LogIn = {
    email: '',
    google: false,
    password: '',
  };

  private isNewUser: boolean = false;

  private isInvalidEmail: boolean = false;

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('form', parent, 'login-form login');
    this.signupLink.element.setAttribute('href', Routes.SignUp);
    this.googleBtn = new GoogleButton(
      {
        parent: this.element,
        btnClass: GoogleBtnClasses.Signin,
        loginCallback: this.signInUser,
      },
      GoogleBtnTypes.Signin,
      this.isNewUser,
    );

    this.loginButton.element.addEventListener('click', this.loginBtnCallback);
  }

  private loginBtnCallback = (e: Event): void => {
    e.preventDefault();
    if (this.checkInputs(e)) {
      e.preventDefault();
      this.collectUserData();
      this.signInUser(this.user);
    }
  };

  private collectUserData(): void {
    this.user.email = this.emailInput.inputValue;
    this.user.password = this.passwordInput.inputValue;
  }

  private checkInputs = (e: Event): boolean => {
    const conditionsArray: boolean[] = [
      this.passwordInput.checkInput(i18next.t(ValidityMessages.Password)),
      this.emailInput.checkInput(i18next.t(ValidityMessages.Email)),
    ];

    if (conditionsArray.includes(false)) {
      e.preventDefault();
      return false;
    }

    return true;
  };

  private signInUser = (user: LogIn): void => {
    LoginForm.loginUser(user)
      .then((token: Token) => {
        if (token) {
          this.changeRoute();
        }
      })
      .catch((err: Error) => {
        if (err.message === Errors.Unauthorized && this.isInvalidEmail === false) {
          this.showInvalidCredentialsMessage();
          this.isInvalidEmail = true;
        }
      });
  };

  private changeRoute(): void {
    window.history.pushState({}, '', Routes.Dashboard);
    this.replaceMainCallback();
  }

  private static loginUser(user: LogIn): Promise<Token> {
    return loginUser(user).then((token) => {
      setDataToLocalStorage(token, 'userSessionToken');
      return token;
    });
  }

  private showInvalidCredentialsMessage(): void {
    const messageContainer: BaseComponent<'span'> = new BaseComponent('span', undefined, 'login__error-message');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const message: BaseComponent<'span'> = new BaseComponent(
      'span',
      messageContainer.element,
      '',
      InputConflictMessages.InvalidCredentials,
    );

    const signUpLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
      text: this.dictionary.signUpHere,
      parent: messageContainer.element,
      additionalClasses: 'login__link-signup',
    });
    signUpLink.element.setAttribute('href', Routes.SignUp);
    this.element.insertBefore(messageContainer.element, this.loginButton.element);
  }
}
