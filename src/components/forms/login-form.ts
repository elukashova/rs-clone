import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import Input from '../input/input';

export default class LoginForm extends BaseComponent<'form'> {
  private formHeader: BaseComponent<'h4'> = new BaseComponent('h4', this.element, 'login-form-header', 'Account Login');

  public googleButton: Button = new Button(this.element, '', 'google-button');

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'login-form-message',
    'If you have an account, you can login with e-mail',
  );

  public emailInput: Input = new Input(this.element, 'login-form-email', 'Email address', { type: 'email' });

  public passwordInput: Input = new Input(this.element, 'login-form-password', 'Password', { type: 'password' });

  public loginButton: Button = new Button(this.element, 'Login', 'btn_login');

  constructor(parent: HTMLElement) {
    super('form', parent, 'login-form');
  }
}
