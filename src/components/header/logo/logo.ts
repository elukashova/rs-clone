import BaseComponent from '../../base-component/base-component';
import './logo.css';

export default class Logo extends BaseComponent<'a'> {
  constructor(root: HTMLElement) {
    super('a', root, 'logo', '', { href: '/' });
  }
}
