import Routes from '../../app/app.types';
import { LogIn, Token } from '../../app/loader/loader.types';
import { loginUser } from '../../app/loader/services/user.services';
import BaseComponent from '../base-component/base-component';
import Button from '../button/button';
import Input from '../input/input';
import './form.css';

export default class LoginForm extends BaseComponent<'form'> {
  private formHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.element,
    'login__form_header',
    'Account Login',
  );

  public googleButton: Button = new Button(this.element, 'Sign up with Google', 'login__btn-google');

  private logInMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.element,
    'login-form-message',
    'If you have an account, you can login with e-mail',
  );

  public emailInput: Input = new Input(this.element, 'login__form-input', 'Email address', { type: 'email' });

  public passwordInput: Input = new Input(this.element, 'login__form-input', 'Password', { type: 'password' });

  public loginButton: Button = new Button(this.element, 'Login', 'login__btn-main btn_main');

  private user: LogIn = {
    email: '',
    password: '',
  };

  constructor(parent: HTMLElement, private replaceMainCallback: () => Promise<void>) {
    super('form', parent, 'login-form login');
    this.addLoginEventListeners();
  }

  private addLoginEventListeners(): void {
    this.emailInput.element.addEventListener('input', this.emailInputCallback);
    this.passwordInput.element.addEventListener('input', this.passwordInputCallback);
    this.loginButton.element.addEventListener('click', this.loginBtnCallback);
  }

  private emailInputCallback = (): void => {
    this.user.email = this.emailInput.getValue();
  };

  private passwordInputCallback = (): void => {
    this.user.password = this.passwordInput.getValue();
  };

  private loginBtnCallback = async (e: Event): Promise<void> => {
    e.preventDefault();
    try {
      const userToken: Token = await loginUser(this.user);
      console.log(userToken); // temporary console.log
      window.history.pushState({}, '', Routes.Dashboard);
      this.replaceMainCallback();
    } catch (err) {
      console.log(err); // temporary console.log
    }
  };
}
