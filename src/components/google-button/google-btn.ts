import BaseComponent from '../base-component/base-component';
import GoogleBtn from './google-btn.types';

export default class GoogleButton extends BaseComponent<'div'> {
  private clientId: string = '867792290204-n80gt7ebkoqsg6cqr8592g0fle342tjj.apps.googleusercontent.com';

  constructor(parent: HTMLElement, type: GoogleBtn) {
    super('div', parent, type);
    this.initializeGoogleBtnId();
  }

  public initializeGoogleBtnId(): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: GoogleButton.handleGoogleCredentials,
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

  public static handleGoogleCredentials = (resp: google.accounts.id.CredentialResponse): void => {
    console.log(resp);
  };
}
