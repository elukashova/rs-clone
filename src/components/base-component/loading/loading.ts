import './loading.css';
import BaseComponent from '../base-component';
import Picture from '../picture/picture';

export default class LoadingTimer extends BaseComponent<'div'> {
  public background!: BaseComponent<'div'>;

  public circle!: Picture;

  private createLoadingCircle(): void {
    this.background = new BaseComponent('div', document.body, 'loading-background');
    this.circle = new Picture(document.body, 'loading-circle', { src: './assets/icons/timer.gif' });
  }

  public showLoadingCircle(): void {
    this.createLoadingCircle();
    setTimeout(() => {
      this.background.element.classList.add('loading-background_active');
      this.circle.element.classList.add('loading-circle_active');
    }, 200);
  }

  public deleteLoadingCircle(): void {
    setTimeout(() => {
      this.background.element.classList.remove('loading-background_active');
      this.circle.element.classList.remove('loading-circle_active');
    }, 300);

    setTimeout(() => {
      document.body.removeChild(this.background.element);
      document.body.removeChild(this.circle.element);
    }, 600);
  }
}
