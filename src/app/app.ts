import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import Main from '../pages/main/main-page';
import LoginPage from '../pages/main/section-login';
import SignupPage from '../pages/main/section-signup';
import Routes from './apptypes';

export default class App {
  private header: Header;

  private main: Main;

  private footer: Footer;

  private signupPage: SignupPage | null = null;

  private loginPage: LoginPage | null = null;

  constructor(private readonly parent: HTMLElement) {
    this.header = new Header(this.parent, this.locationHandler);
    this.main = new Main(this.parent);
    this.footer = new Footer(this.parent);
    this.parent.classList.add('root');
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
    this.locationHandler();
  }

  public locationHandler = async (): Promise<void> => {
    const location: string = window.location.pathname.length === 0 ? '/' : window.location.pathname;

    switch (location) {
      case Routes.SignUp:
        this.signupPage = new SignupPage(this.locationHandler);
        this.main.setContent(this.signupPage);
        break;
      case Routes.LogIn:
        this.loginPage = new LoginPage();
        this.main.setContent(this.loginPage);
        break;
      default:
        console.log('will be 404 page'); // temporary placeholder
    }
  };
}
