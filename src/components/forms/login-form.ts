import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import Input from '../input/input';
import './form.css';

export default class LoginForm extends BaseComponent<'form'> {
  private formHeader: BaseComponent<'h4'> = new BaseComponent('h4', this.element, 'login-form-header', 'Account Login');

  public googleButton: Button = new Button(this.element, 'Sign UP with gOOgle', 'google-button');

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'login-form-message',
    'If you have an account, you can login with e-mail',
  );

  public emailInput: Input = new Input(this.element, 'form-input', 'Email address', { type: 'email' });

  public passwordInput: Input = new Input(this.element, 'form-input', 'Password', { type: 'password' });

  public loginButton: Button = new Button(this.element, 'Login', 'btn_main');

  constructor(parent: HTMLElement) {
    super('form', parent, 'login-form');
  }
}
