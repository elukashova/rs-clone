import jwtdecode from 'jwt-decode';
import { LogIn, SignUp } from '../../app/loader/loader.types';
import { GOOGLE_CLIENT_ID } from '../../utils/consts';
import BaseComponent from '../base-component/base-component';
import { GoogleAccount, GoogleBtnData, GoogleBtnTypes, LogInCallback, SignUpCallback } from './google-btn.types';

export default class GoogleButton extends BaseComponent<'div'> {
  private googleLogInCallback: LogInCallback | undefined;

  private googleSignUpCallback: SignUpCallback | undefined;

  private newUser: SignUp = {
    username: '',
    email: '',
    google: true,
    avatar_url: '',
  };

  private existingUser: LogIn = {
    email: '',
    google: true,
  };

  constructor(private data: GoogleBtnData, type: GoogleBtnTypes, private isFirstAccess: boolean) {
    super('div', data.parent, data.btnClass);
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
    });
  }

  public handleGoogleSignup = (resp: google.accounts.id.CredentialResponse): void => {
    const account: GoogleAccount = jwtdecode(resp.credential);
    console.log(jwtdecode(resp.credential));
    this.newUser.username = account.name;
    this.newUser.email = account.email;
    this.newUser.avatar_url = account.picture;
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
