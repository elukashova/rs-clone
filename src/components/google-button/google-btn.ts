import jwtdecode from 'jwt-decode';
import { LogIn, SignUp } from '../../app/loader/loader.types';
import BaseComponent from '../base-component/base-component';
import { GoogleAccount, GoogleBtnData, GoogleBtnType, LogInCallback, SignUpCallback } from './google-btn.types';

export default class GoogleButton extends BaseComponent<'div'> {
  private clientId: string = '867792290204-n80gt7ebkoqsg6cqr8592g0fle342tjj.apps.googleusercontent.com';

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

  constructor(private data: GoogleBtnData, type: GoogleBtnType, private isFirstAccess: boolean) {
    super('div', data.parent, data.btnClass);
    this.googleSignUpCallback = this.isFirstAccess ? this.data.signupCallback : undefined;
    this.googleLogInCallback = !this.isFirstAccess ? this.data.loginCallback : undefined;
    this.initializeGoogleBtnId(type);
  }

  public initializeGoogleBtnId(type: GoogleBtnType): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.isFirstAccess ? this.handleGoogleSignup : this.handleGoogleLogin,
      auto_select: true,
    });
    this.renderGoogleBtn(type);
  }

  public renderGoogleBtn(type: GoogleBtnType): void {
    google.accounts.id.renderButton(this.element, {
      theme: 'outline',
      text: type,
      size: 'large',
      type: 'standard',
    });
  }

  public handleGoogleSignup = (resp: google.accounts.id.CredentialResponse): void => {
    const account: GoogleAccount = jwtdecode(resp.credential);
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
