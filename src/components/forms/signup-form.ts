import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import Input from '../input/input';
import './form.css';

export default class SignupForm extends BaseComponent<'form'> {
  private formHeader: BaseComponent<'h4'> = new BaseComponent('h4', this.element, 'signup-header', 'Account Signup');

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'signup-form-message',
    'Become a member and enjoy exclusive promotions.',
  );

  public nameInput: Input = new Input(this.element, 'form-input', 'Full Name', { type: 'text' });

  public emailInput: Input = new Input(this.element, 'form-input', 'Email address', { type: 'email' });

  public countryInput: Input = new Input(this.element, 'form-input', 'Country', { type: 'text' });

  public dateInput: Input = new Input(this.element, 'form-input', 'Date Of Birth', { type: 'date' });

  public signupButton: Button = new Button(this.element, 'Login', 'btn_main');

  public googleButton: Button = new Button(this.element, 'Sign UP with gOOgle', 'google-button');

  constructor(parent: HTMLElement) {
    super('form', parent, 'signup-form');
  }
}
