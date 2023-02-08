import BaseComponent from '../components/base-component/base-component';
import GoogleMaps from '../map/google-maps';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
// import PersonalPage from '../pages/personal-page/personal-page';
import Main from '../pages/main/main-page';
import NewRoutePage from '../pages/new-route-page/new-route-page';
import Router from './loader/router/router';

export default class App {
  private header: Header;

  private main: Main = new Main();

  private footer: Footer;

  // private personalPage: PersonalPage = new PersonalPage(this.parent);

  private newRoutePage = new NewRoutePage(this.parent);

  private router: Router = new Router(this.main);

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
    this.header = new Header(this.parent, this.router.locationHandler);
    this.parent.append(this.main.element);
    this.footer = new Footer(this.parent);
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
    this.parent.style.height = '100%';
    const mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.parent, 'map', '', { id: 'map' });
    const map1 = new GoogleMaps(mapDiv.element, 'map1', 8, { lat: -33.397, lng: 150.644 });

    console.log(map1);
    this.handleRouting();
  }

  public handleRouting(): void {
    this.router.locationHandler();
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
