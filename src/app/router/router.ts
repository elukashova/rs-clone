import Main from '../../pages/main/main-page';
import LoginPage from '../../pages/main/section-login';
import SignupPage from '../../pages/main/section-signup';
import Dashboard from '../../pages/dashboard/dashboard';
import Routes from './router.types';

export default class Router {
  private main: Main;

  private signupPage: SignupPage | null = null;

  private loginPage: LoginPage | null = null;

  private personalPage: Dashboard | null = null;

  constructor(main: Main, private replaceBackgroundCallback: (location: string) => void) {
    this.main = main;
  }

  public locationHandler = (): void => {
    const location: string = window.location.pathname.length === 0 ? '/' : window.location.pathname;
    this.replaceBackgroundCallback(location);

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
        this.personalPage = new Dashboard();
        this.main.setContent(this.personalPage);
        break;
      default:
        console.log('will be 404 page'); // temporary placeholder
    }
  };
}
