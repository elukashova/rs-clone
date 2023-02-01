import BaseComponent from '../../base-component/base-component';
import './logo.css';

export default class Logo extends BaseComponent<'a'> {
  constructor(parent: HTMLElement) {
    super('a', parent, 'logo', '', { href: '/' });
  }
}
