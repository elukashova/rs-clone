import Header from '../components/header/header';

export default class App {
  private header: Header = new Header(this.parent);

  constructor(private readonly parent: HTMLElement) {
    this.parent.classList.add('root');
  }

  public init(): void {
    this.parent.style.backgroundColor = 'grey';
  }
}
