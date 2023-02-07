import BaseComponent from '../components/base-component/base-component';
import GoogleMaps from '../map/google-maps';

export default class App {
  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
    this.parent.style.height = '100%';
    const mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.parent, 'map', '', { id: 'map' });
    /* const mapDiv2: BaseComponent<'div'> = new BaseComponent('div', this.parent, 'map', '', {
      id: 'map',
      style: 'height: 50vh',
    }); */
    const map1 = new GoogleMaps(mapDiv.element, 'map1', 8, { lat: -33.397, lng: 150.644 });
    // const map2 = new GoogleMaps(mapDiv2.element, 'map1', 8, { lat: -3.397, lng: 153.644 });
    console.log(map1 /* map2 */);
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
