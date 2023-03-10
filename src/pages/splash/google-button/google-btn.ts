import './google-btn.css';
import jwtdecode from 'jwt-decode';
import { LogIn, SignUp } from '../../../app/loader/loader-requests.types';
import { GOOGLE_CLIENT_ID } from '../../../utils/consts';
import BaseComponent from '../../../components/base-component/base-component';
import { GoogleAccount, GoogleBtnData, GoogleBtnTypes, LogInCallback, SignUpCallback } from './google-btn.types';

export default class GoogleButton extends BaseComponent<'div'> {
  private googleLogInCallback: LogInCallback | undefined;

  private googleSignUpCallback: SignUpCallback | undefined;

  private newUser: SignUp = {
    username: '',
    email: '',
    google: true,
    avatarUrl: '',
  };

  private existingUser: LogIn = {
    email: '',
    google: true,
  };

  constructor(private data: GoogleBtnData, type: GoogleBtnTypes, private isFirstAccess: boolean) {
    super('div', data.parent, `${data.btnClass} sign_in_btn_wrapper`);
    this.googleSignUpCallback = this.isFirstAccess ? this.data.signupCallback : undefined;
    this.googleLogInCallback = !this.isFirstAccess ? this.data.loginCallback : undefined;
    this.initializeGoogleBtnId(type);
  }

  public initializeGoogleBtnId(type: GoogleBtnTypes): void {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: this.isFirstAccess ? this.handleGoogleSignup : this.handleGoogleLogin,
      auto_select: true,
    });
    this.renderGoogleBtn(type);
  }

  public renderGoogleBtn(type: GoogleBtnTypes): void {
    google.accounts.id.renderButton(this.element, {
      theme: 'outline',
      text: type,
      size: 'large',
      type: 'standard',
      shape: 'square',
    });
  }

  public handleGoogleSignup = (resp: google.accounts.id.CredentialResponse): void => {
    const account: GoogleAccount = jwtdecode(resp.credential);
    this.newUser.username = account.name;
    this.newUser.email = account.email;
    if (this.googleSignUpCallback) {
      this.googleSignUpCallback(this.newUser);
    }
  };

  public handleGoogleLogin = (resp: google.accounts.id.CredentialResponse): void => {
    const account: GoogleAccount = jwtdecode(resp.credential);
    if (this.googleLogInCallback) {
      this.existingUser.email = account.email;
      this.googleLogInCallback(this.existingUser);
    }
  };
}
