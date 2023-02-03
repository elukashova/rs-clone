import BaseComponent from '../../components/base-component/base-component';
import SignupForm from '../../components/forms/signup-form';
import './main-page.css';

export default class SignupPage extends BaseComponent<'section'> {
  private signupForm: SignupForm = new SignupForm(this.element, this.callback);

  constructor(private callback: () => Promise<void>) {
    super('section', undefined, 'signup-page');
  }
}
