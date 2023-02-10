import BaseComponent from '../../components/base-component/base-component';
import LoginForm from '../../components/authorization/forms/login-form';
import './main-page.css';

export default class LoginPage extends BaseComponent<'section'> {
  private loginForm: LoginForm = new LoginForm(this.element, this.replaceMainCallback);

  constructor(private replaceMainCallback: () => void) {
    super('section', undefined, 'login-page');
  }
}
