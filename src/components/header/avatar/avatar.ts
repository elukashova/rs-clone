import BaseComponent from '../../base-component/base-component';
import './avatar.css';

export default class Avatar extends BaseComponent<'span'> {
  constructor(root: HTMLElement) {
    super('span', root, 'avatar');
  }

  public showAvatarMenu(): void {
    this.element.addEventListener('click', () => {
      console.log('menu');
    });
  }
}
