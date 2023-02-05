import BaseComponent from '../components/base-component/base-component';
/* import Footer from '../components/footer/footer';
import Header from '../components/header/header'; */

export default class App {
  /* private header: Header = new Header(this.parent); */

  private mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.parent, 'map', '', {
    id: 'map',
    style: 'height: 50vh',
  });

  /* private footer: Footer = new Footer(this.parent); */

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
    this.parent.style.height = '100%';
  }

  // скрипт с ключом для гугл апи
  public static addKey(parent: HTMLElement): BaseComponent<'script'> {
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
  }
}
