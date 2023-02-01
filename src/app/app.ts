import Header from '../components/header/header';

export default class App {
  private header: Header;

  constructor(private readonly root: HTMLElement) {
    this.root.classList.add('root');
    this.header = new Header(this.root);
  }

  public init(): void {
    this.root.style.backgroundColor = 'grey';
  }
}
