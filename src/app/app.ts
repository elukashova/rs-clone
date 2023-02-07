import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import PersonalPage from '../pages/personal-page/personal-page';
import Main from '../pages/main/main-page';
import Router from './loader/router/router';

export default class App {
  private header: Header;

  private main: Main = new Main();

  private footer: Footer;

  private personalPage: PersonalPage = new PersonalPage(this.parent);

  private router: Router = new Router(this.main);

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
    this.header = new Header(this.parent, this.router.locationHandler);
    this.parent.append(this.main.element);
    this.footer = new Footer(this.parent);
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
    this.handleRouting();
  }

  public handleRouting(): void {
    this.router.locationHandler();
  }
}
