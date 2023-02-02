import BaseComponent from '../../components/base-component/base-component';
import LoginForm from '../../components/forms/login-form';

export default class LoginPage extends BaseComponent<'main'> {
  public loginForm: LoginForm = new LoginForm(this.element);

  constructor(parent: HTMLElement) {
    super('main', parent);
  }
}
