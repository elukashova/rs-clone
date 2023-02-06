import jwtdecode from 'jwt-decode';
import { SignUp } from '../../app/loader/loader.types';
// import Routes from '../../app/loader/router/router.types';
import BaseComponent from '../base-component/base-component';
import { GoogleAccount, GoogleBtnData } from './google-btn.types';

export default class GoogleButton extends BaseComponent<'div'> {
  private clientId: string = '867792290204-n80gt7ebkoqsg6cqr8592g0fle342tjj.apps.googleusercontent.com';

  private signUpCallback: (user: SignUp) => void;

  private newUser: SignUp = {
    name: '',
    email: '',
    google: true,
    avatar_url: '',
  };

  constructor(data: GoogleBtnData, private replaceMainCallback: () => Promise<void>) {
    super('div', data.parent, data.type);
    this.signUpCallback = data.callback;
    this.initializeGoogleBtnId();
  }

  public initializeGoogleBtnId(): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleGoogleCredentials,
      auto_select: true,
    });
    this.renderGoogleBtn();
    // google.accounts.id.prompt();
  }

  public renderGoogleBtn(): void {
    google.accounts.id.renderButton(this.element, {
      theme: 'outline',
      text: 'signup_with',
      size: 'large',
      type: 'standard',
    });
  }

  public handleGoogleCredentials = (resp: google.accounts.id.CredentialResponse): void => {
    const account: GoogleAccount = jwtdecode(resp.credential);
    this.newUser.name = account.name;
    this.newUser.email = account.email;
    this.newUser.avatar_url = account.picture;
    this.signUpCallback(this.newUser);
  };
}
