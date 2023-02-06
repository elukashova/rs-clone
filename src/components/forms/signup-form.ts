import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import NavigationLink from '../link/link';
import Input from '../input/input';
import './form.css';
import Routes from '../../app/loader/router/router.types';
import { SignUp, Token } from '../../app/loader/loader.types';
import { createUser, getUser } from '../../app/loader/services/user-services';
import { setDataToLocalStorage } from '../../utils/local-storage/local-storage';
import GoogleBtn from '../google-button/google-btn.types';
import GoogleButton from '../google-button/google-btn';
// import googleButton from '../google-button/google-button';

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

  private nameInput: Input = new Input(this.element, 'signup__form-input form-input', 'Full Name', { type: 'text' });

  private emailInput: Input = new Input(this.element, 'signup__form-input form-input', 'Email address', {
    type: 'email',
  });

  private passwordInput: Input = new Input(this.element, 'signup__form-input form-input', 'Password', {
    type: 'password',
  });

  private countryInput: Input = new Input(this.element, 'signup__form-input form-input', 'Country', { type: 'text' });

  private signupButton: Button = new Button(this.element, 'Sign up', 'signup__btn-main btn_main');

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup__message-login',
    'Already a member? ',
  );

  private loginLink: NavigationLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Login here',
    parent: this.logInMessage.element,
    additionalClasses: 'signup__link-login',
  });

  private googleBtn = new GoogleButton(this.element, GoogleBtn.SignUp);

  private newUser: SignUp = {
    username: '',
    email: '',
    password: '',
    country: '',
  };

  constructor(parent: HTMLElement, private replaceMainCallback: () => Promise<void>) {
    super('form', parent, 'signup-form signup');
    this.loginLink.element.setAttribute('href', Routes.LogIn);
    // this.element.append(googleButton.element);
    this.addSignupEventListeners();
  }

  private addSignupEventListeners(): void {
    this.nameInput.element.addEventListener('input', this.nameInputCallback);
    this.emailInput.element.addEventListener('input', this.emailInputCallback);
    this.passwordInput.element.addEventListener('input', this.passwordInputCallback);
    this.countryInput.element.addEventListener('input', this.countryInputCallback);
    this.signupButton.element.addEventListener('click', this.signupBtnCallback);
    // this.googleButton.element.addEventListener('click', this.googleBtnCallback);
  }

  private nameInputCallback = (): void => {
    this.newUser.username = this.nameInput.getValue();
  };

  private emailInputCallback = (): void => {
    this.newUser.email = this.emailInput.getValue();
  };

  private passwordInputCallback = (): void => {
    this.newUser.password = this.passwordInput.getValue();
  };

  private countryInputCallback = (): void => {
    this.newUser.country = this.countryInput.getValue();
  };

  private signupBtnCallback = async (e: Event): Promise<void> => {
    e.preventDefault();
    try {
      this.createUser().then((token) => SignupForm.getUser(token));
      window.history.pushState({}, '', Routes.Dashboard);
      this.replaceMainCallback();
    } catch (err) {
      console.log(err); // temporary console.log
    }
  };

  // private googleBtnCallback = (e: Event): void => {
  //   e.preventDefault();
  // };

  private async createUser(): Promise<Token> {
    return createUser(this.newUser).then((token) => {
      setDataToLocalStorage(token, 'userSessionToken');
      return token;
    });
  }

  // этот метод потом будет вынесен в загрузку dashboard
  private static async getUser(token: Token): Promise<void> {
    const user = await getUser(token);
    console.log(user);
  }
}
