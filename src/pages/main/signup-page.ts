import BaseComponent from '../../components/base-component/base-component';
import SignupForm from '../../components/forms/signup-form';
import './main-page.css';

export default class SignupPage extends BaseComponent<'main'> {
  private signupForm: SignupForm = new SignupForm(this.element);

  constructor(parent: HTMLElement) {
    super('main', parent, 'signup-page');
  }
}
