import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import LoginPage from '../pages/main/login-page';

export default class App {
  private header: Header = new Header(this.parent);

  public loginPage: LoginPage = new LoginPage(this.parent);

  private footer: Footer = new Footer(this.parent);

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
  }
}
