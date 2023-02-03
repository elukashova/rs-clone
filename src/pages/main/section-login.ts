import BaseComponent from '../../components/base-component/base-component';
import LoginForm from '../../components/forms/login-form';
import './main-page.css';

export default class LoginPage extends BaseComponent<'section'> {
  private loginForm: LoginForm = new LoginForm(this.element);

  constructor() {
    super('section', undefined, 'login-page');
  }
}
