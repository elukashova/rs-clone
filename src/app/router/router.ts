import Main from '../../pages/main/main-page';
import LoginPage from '../../pages/main/section-login';
import SignupPage from '../../pages/main/section-signup';
import Dashboard from '../../pages/dashboard/dashboard';
import Routes from './router.types';
import AddActivity from '../../pages/add-activity/add-activity';
import Friends from '../../pages/find-friends/find-friends';
import NewRoutePage from '../../pages/new-route-page/new-route-page';
import Challenges from '../../pages/challenges/challenges';
import OurTeam from '../../pages/our-team/our-team';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import { Token } from '../loader/loader-requests.types';
import Settings from '../../pages/settings/settings';
import Page404 from '../../pages/404/404';

export default class Router {
  private main: Main;

  private signupPage: SignupPage | null = null;

  private loginPage: LoginPage | null = null;

  private personalPage: Dashboard | null = null;

  private addActivity: AddActivity | null = null;

  private findFriends: Friends | null = null;

  private addRoute: NewRoutePage | null = null;

  private challenges: Challenges | null = null;

  private aboutTeam: OurTeam | null = null;

  private settings: Settings | null = null;

  private page404: Page404 | null = null;

  private token: Token | null = null;

  constructor(main: Main, private replaceBackgroundCallback: (location: string) => void) {
    this.main = main;
  }

  public locationHandler = (): void => {
    this.checkToken();

    const pathnameLength: number = window.location.pathname.length;
    // eslint-disable-next-line max-len
    let location: string = pathnameLength === 0 && !this.token ? Routes.SignUp : window.location.pathname;

    if (location !== Routes.SignUp && location !== Routes.LogIn && !this.token) {
      location = Routes.SignUp;
      window.history.pushState({}, '', Routes.SignUp);
    }

    if (this.token && (location === Routes.SignUp || location === Routes.LogIn)) {
      location = Routes.Dashboard;
      window.history.pushState({}, '', Routes.Dashboard);
    }

    if (location === Routes.LogOut) {
      localStorage.removeItem('userSessionToken');
      this.token = null;
      location = Routes.LogIn;
      window.history.pushState({}, '', Routes.LogIn);
    }

    this.replaceBackgroundCallback(location);
    this.switchLocation(location);
  };

  // eslint-disable-next-line max-lines-per-function
  private switchLocation(location: string): void {
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
        this.personalPage = new Dashboard(this.locationHandler);
        this.main.setContent(this.personalPage);
        break;
      case Routes.AddActivity:
        this.addActivity = new AddActivity(this.main.element, this.locationHandler);
        this.main.setContent(this.addActivity);
        break;
      case Routes.FindFriends:
        this.findFriends = new Friends(this.main.element);
        this.main.setContent(this.findFriends);
        break;
      case Routes.AddRoute:
        this.addRoute = new NewRoutePage(this.main.element);
        this.main.setContent(this.addRoute);
        break;
      case Routes.AboutTeam:
        this.aboutTeam = new OurTeam(this.main.element);
        this.main.setContent(this.aboutTeam);
        break;
      case Routes.Challenges:
        this.challenges = new Challenges(this.main.element);
        this.main.setContent(this.challenges);
        break;
      case Routes.Settings:
        this.settings = new Settings(this.main.element, this.locationHandler);
        this.main.setContent(this.settings);
        break;
      default:
        this.page404 = new Page404(this.main.element);
        this.main.setContent(this.page404);
    }
  }

  private checkToken(): boolean {
    this.token = checkDataInLocalStorage('userSessionToken');
    if (!this.token) {
      return false;
    }
    return true;
  }
}
