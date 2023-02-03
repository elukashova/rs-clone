import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import PersonalPage from '../pages/personal-page/personal-page';
// import LoginPage from '../pages/main/login-page';
// import SignupPage from '../pages/main/signup-page';

export default class App {
  private header: Header = new Header(this.parent);

  // public loginPage: LoginPage = new LoginPage(this.parent);

  // public signupPage: SignupPage = new SignupPage(this.parent);

  public personalPage: PersonalPage = new PersonalPage(this.parent);

  private footer: Footer = new Footer(this.parent);

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
  }
}
