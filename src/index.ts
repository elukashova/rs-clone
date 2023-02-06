import App from './app/app';
import GoogleButton from './app/google-api/google-btn';
import GoogleBtn from './app/google-api/google-btn.types';

const app = new App(document.body);
const googleBtn = new GoogleButton(document.body, GoogleBtn.SignUp);

window.onload = (): void => {
  app.init();
  googleBtn.initializeGoogleBtnId();
  // GoogleButton.renderGoogleBtn(GoogleBtn.SignUp);
};

window.onpopstate = (): void => {
  app.handleRouting();
};
