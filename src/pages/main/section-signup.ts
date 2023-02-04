import BaseComponent from '../../components/base-component/base-component';
import SignupForm from '../../components/forms/signup-form';
import './main-page.css';

export default class SignupPage extends BaseComponent<'section'> {
  private signupForm: SignupForm = new SignupForm(this.element, this.replaceMainCallback);

  constructor(private replaceMainCallback: () => Promise<void>) {
    super('section', undefined, 'signup-page');
  }
}
