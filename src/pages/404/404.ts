import BaseComponent from '../../components/base-component/base-component';
import './404.css';

export default class Page404 extends BaseComponent<'section'> {
  private imgWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'page-not-found__wrapper');

  private img: BaseComponent<'img'> = new BaseComponent('img', this.imgWrapper.element, 'page-not-found__image', '', {
    src: 'assets/images/404.png',
  });

  constructor(parent: HTMLElement) {
    super('section', parent, 'section page-not-found');
  }
}
