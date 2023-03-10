import './loading.css';
import BaseComponent from '../base-component';
import Picture from '../picture/picture';

export default class LoadingTimer extends BaseComponent<'div'> {
  public circle!: Picture;

  constructor(private parent: HTMLElement) {
    super('div', parent, 'loading-background');
    this.circle = new Picture(this.element, 'loading-circle', { src: './assets/icons/timer.gif', alt: 'timer' });
  }

  public showLoadingCircle(): void {
    setTimeout(() => {
      this.element.classList.add('loading-background_active');
      this.circle.element.classList.add('loading-circle_active');
    }, 200);
  }

  public deleteLoadingCircle(): void {
    setTimeout(() => {
      this.element.classList.remove('loading-background_active');
      this.circle.element.classList.remove('loading-circle_active');
    }, 300);

    setTimeout(() => {
      this.parent.removeChild(this.element);
    }, 600);
  }
}
