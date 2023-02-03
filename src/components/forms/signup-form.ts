import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import NavigationLink from '../link/link';
import Input from '../input/input';
import './form.css';
import Routes from '../../app/apptypes';

export default class SignupForm extends BaseComponent<'form'> {
  private formHeader: BaseComponent<'h4'> = new BaseComponent('h4', this.element, 'signup-header', 'Account Signup');

  private signUpMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup-form-message',
    'Become a member and enjoy exclusive promotions.',
  );

  private nameInput: Input = new Input(this.element, 'signup__form-input form-input', 'Full Name', { type: 'text' });

  private emailInput: Input = new Input(this.element, 'signup__form-input form-input', 'Email address', {
    type: 'email',
  });

  private countryInput: Input = new Input(this.element, 'signup__form-input form-input', 'Country', { type: 'text' });

  private dateInput: Input = new Input(this.element, 'signup__form-input form-input', 'Date Of Birth', {
    type: 'date',
  });

  private signupButton: Button = new Button(this.element, 'Sign up', 'signup__btn-main btn_main');

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup__message-login',
    'Already a member? ',
  );

  private loginLink: NavigationLink = new NavigationLink(this.callback, {
    text: 'Login here',
    parent: this.logInMessage.element,
    additionalClasses: 'signup__link-login',
  });

  private googleButton: Button = new Button(this.element, 'Sign up with Google', 'signup__btn-google');

  constructor(parent: HTMLElement, private callback: () => Promise<void>) {
    super('form', parent, 'signup-form signup');
    this.loginLink.element.setAttribute('href', Routes.LogIn);
  }
}
