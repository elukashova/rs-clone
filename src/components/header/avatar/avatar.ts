import BaseComponent from '../../base-component/base-component';
import './avatar.css';

export default class Avatar extends BaseComponent<'span'> {
  constructor(parent: HTMLElement) {
    super('span', parent, 'avatar');
  }
}
