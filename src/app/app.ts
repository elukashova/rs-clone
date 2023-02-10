import BaseComponent from '../components/base-component/base-component';
import GoogleMaps from '../map/google-maps';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
// import Dashboard from '../pages/dashboard/dashboard';
import Main from '../pages/main/main-page';
// import NewRoutePage from '../pages/new-route-page/new-route-page';
import Router from './router/router';
import Routes from './router/router.types';

export default class App {
  private header: Header;

  private main: Main = new Main();

  private footer: Footer;

  private router: Router;

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
    this.router = new Router(this.main, this.replaceRootBackground);
    this.header = new Header(this.parent, this.router.locationHandler);
    this.parent.append(this.main.element);
    this.footer = new Footer(this.parent, this.router.locationHandler);
  }

  public init(): void {
    this.parent.style.height = '100%';
    const mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.parent, 'map', '', { id: 'map' });
    const map1 = new GoogleMaps(
      mapDiv.element,
      'map1',
      8,
      { lat: -33.397, lng: 150.644 },
      google.maps.TravelMode.BICYCLING,
    );
    console.log(map1);
    this.handleRouting();
  }

  public handleRouting(): void {
    this.router.locationHandler();
  }

  private replaceRootBackground = (location: string): void => {
    switch (location) {
      case Routes.SignUp:
        this.parent.style.backgroundImage = 'url(/assets/backgrounds/signup-background.jpg)';
        break;
      case Routes.LogIn:
        this.parent.style.backgroundImage = 'url(/assets/backgrounds/login-background.jpg)';
        break;
      default:
        console.log('hey');
        this.parent.style.backgroundImage = '';
        this.parent.style.backgroundColor = '#F6F4F9';
    }
  };

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
