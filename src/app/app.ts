import Footer from '../components/footer/footer';
import Header from '../components/header/header';
// import Dashboard from '../pages/dashboard/dashboard';
import Main from '../pages/main/main-page';
// import NewRoutePage from '../pages/new-route-page/new-route-page';
import Router from './router/router';
import Routes from './router/router.types';
import eventEmitter from '../utils/event-emitter';
import ModalAvatar from '../components/avatar-modal/avatar-modal';
import { EventData } from '../utils/event-emitter.types';

export default class App {
  private header: Header;

  private main: Main = new Main();

  private footer: Footer;

  private router: Router;

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
    this.router = new Router(this.main, this.handleSplashStylesCallback);
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

  private handleSplashStylesCallback = (location: string): void => {
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
    modal.element.addEventListener('click', modal.closeModalCallback);
  }

  // скрипт с ключом для гугл апи
  /* public static addKey(parent: HTMLElement): BaseComponent<'script'> {
    const apiKey = 'AIzaSyC90BCUHG7PI6cW9XNex-5bY3Dd44Rqhgs';
    // получать язык из указанной страны или менять русский/английский при переводе
    const language = 'en';
    // eslint-disable-next-line operator-linebreak
    const srcString = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&language=${language}&libraries=visualization,geometry`;
    const script = new BaseComponent('script', parent, '', '', {
      async: '',
      defer: '',
      src: srcString,
    });
    return script;
  } */
}
