/* eslint-disable prettier/prettier */
import Routes from '../../app/router/router.types';
import { Errors, LogIn, Token } from '../../app/loader/loader.types';
import { getUser, loginUser } from '../../app/loader/services/user-services';
import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import Input from '../input/input';
import './form.css';
import { GoogleBtnClasses, GoogleBtnTypes } from '../google-button/google-btn.types';
import GoogleButton from '../google-button/google-btn';
import { setDataToLocalStorage } from '../../utils/local-storage/local-storage';
import NavigationLink from '../link/link';
import { VALID_EMAIL, VALID_PASSWORD } from '../../utils/consts';
import { InputConflictMessages, ValidityMessages } from './form.types';
import { convertRegexToPattern } from '../../utils/utils';

export default class LoginForm extends BaseComponent<'form'> {
  private formHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.element,
    'login__form_header',
    'Account Login',
  );

  private googleBtn: GoogleButton;

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'login-form-message',
    'If you have an account, you can login with e-mail',
  );

  public emailInput: Input = new Input(this.element, 'login__form-input form-input', 'Email address', {
    type: 'email',
    required: '',
    pattern: convertRegexToPattern(VALID_EMAIL),
  });

  public passwordInput: Input = new Input(this.element, 'login__form-input form-input', 'Password', {
    type: 'password',
    required: '',
    pattern: convertRegexToPattern(VALID_PASSWORD),
  });

  public loginButton: Button = new Button(this.element, 'Log in', 'login__btn-main btn_main');

  private signUpMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'login_message-sigup',
    'Not a member? ',
  );

  private signupLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Sign up here',
    parent: this.signUpMessage.element,
    additionalClasses: 'login__link-signup',
  });

  private user: LogIn = {
    email: '',
    google: true,
    password: '',
  };

  private isNewUser: boolean = false;

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
      this.passwordInput.checkInput(ValidityMessages.Password),
      this.emailInput.checkInput(ValidityMessages.Email),
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
        LoginForm.getUser(token);
        this.changeRoute();
      })
      .catch((err: Error) => {
        if (err.message === Errors.Unauthorized) {
          this.showInvalidCredentialsMessage();
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

  // этот метод потом будет вынесен в загрузку dashboard
  private static getUser(token: Token): void {
    getUser(token).then((user) => console.log(user));
  }

  private showInvalidCredentialsMessage(): void {
    const message: HTMLSpanElement = document.createElement('span');
    message.textContent = InputConflictMessages.InvalidCredentials;
    const signUpLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
      text: 'sign up',
      parent: message,
      additionalClasses: 'login__link-signup',
    });
    signUpLink.element.setAttribute('href', Routes.SignUp);
    this.element.insertBefore(message, this.loginButton.element);
  }
}
