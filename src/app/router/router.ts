import Main from '../../pages/main/main-page';
import LoginPage from '../../pages/main/section-login';
import SignupPage from '../../pages/main/section-signup';
import Routes from './router.types';

export default class Router {
  private main: Main;

  private signupPage: SignupPage | null = null;

  private loginPage: LoginPage | null = null;

  constructor(main: Main) {
    this.main = main;
  }

  public locationHandler = (): void => {
    const location: string = window.location.pathname.length === 0 ? '/' : window.location.pathname;

    switch (location) {
      case Routes.SignUp:
        this.signupPage = new SignupPage(this.locationHandler);
        this.main.setContent(this.signupPage);
        break;
      case Routes.LogIn:
        this.loginPage = new LoginPage(this.locationHandler);
        this.main.setContent(this.loginPage);
        break;
      case Routes.Dashboard:
        console.log('dashboard page'); // temporary placeholder
        break;
      default:
        console.log('will be 404 page'); // temporary placeholder
    }
  };
}
