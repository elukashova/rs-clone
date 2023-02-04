import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import NavigationLink from '../link/link';
import Input from '../input/input';
import './form.css';
import Routes from '../../app/loader/router/router.types';
import { SignUp, Token } from '../../app/loader/loader.types';
import { createUser } from '../../app/loader/services/user-services';

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

  private googleButton: Button = new Button(this.element, 'Sign up with Google', 'signup__btn-google');

  private newUser: SignUp = {
    username: '',
    email: '',
    password: '',
    country: '',
  };

  constructor(parent: HTMLElement, private replaceMainCallback: () => Promise<void>) {
    super('form', parent, 'signup-form signup');
    this.loginLink.element.setAttribute('href', Routes.LogIn);
    this.addSignupEventListeners();
  }

  private addSignupEventListeners(): void {
    this.nameInput.element.addEventListener('input', this.nameInputCallback);
    this.emailInput.element.addEventListener('input', this.emailInputCallback);
    this.passwordInput.element.addEventListener('input', this.passwordInputCallback);
    this.countryInput.element.addEventListener('input', this.countryInputCallback);
    this.signupButton.element.addEventListener('click', this.signupBtnCallback);
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
      const userToken: Token = await createUser(this.newUser);
      console.log(userToken); // temporary console.log
      window.history.pushState({}, '', Routes.Dashboard);
      this.replaceMainCallback();
    } catch (err) {
      console.log(err); // temporary console.log
    }
  };
}
