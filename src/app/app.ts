import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import Main from '../pages/main/main-page';
import Router from './router/router';
import Routes from './router/router.types';
import eventEmitter from '../utils/event-emitter';
import ModalAvatar from '../components/avatar-modal/avatar-modal';
import { EventData } from '../utils/event-emitter.types';
import { checkDataInLocalStorage } from '../utils/local-storage';
import { Token } from './loader/loader-requests.types';

export default class App {
  private header: Header;

  private main: Main = new Main();

  private footer: Footer;

  private router: Router;

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
    this.router = new Router(this.main, this.handleStylesCallback);
    this.header = new Header(this.parent, this.router.locationHandler);
    this.parent.append(this.main.element);
    this.footer = new Footer(this.parent, this.router.locationHandler);
    this.subscribeToEvents();
  }

  public init(): void {
    this.parent.style.height = '100%';
    this.handleRouting();
  }

  public handleRouting(): void {
    this.router.locationHandler();
  }

  private handleStylesCallback = (location: string): void => {
    switch (location) {
      case Routes.SignUp:
        this.main.element.style.backgroundImage = 'url(/assets/backgrounds/signup-background.jpg)';
        this.main.element.style.backgroundPosition = 'center';
        this.header.removeElementNotDashboard();
        break;
      case Routes.LogIn:
        this.main.element.style.backgroundImage = 'url(/assets/backgrounds/login-background.jpg)';
        this.main.element.style.backgroundPosition = '30% 20%';
        this.header.removeElementNotDashboard();
        break;
      case Routes.AboutTeam:
        if (!this.token) {
          this.header.removeElementNotDashboard();
        }
        break;
      default:
        this.main.element.style.backgroundImage = '';
        this.parent.style.background = '#F6F4F9';
        this.header.appendElementsInDashboard();
    }
  };

  private subscribeToEvents(): void {
    eventEmitter.on('openAvatarModal', (url: EventData): void => {
      this.showModalWindow(url);
    });
  }

  private showModalWindow(url: EventData): void {
    const modal: ModalAvatar = new ModalAvatar(this.parent, url);
    this.parent.style.overflow = 'hidden';
    modal.element.addEventListener('click', modal.closeModalCallback);
  }
}
