import BaseComponent from '../../base-component/base-component';

export default class Logo extends BaseComponent<'a'> {
  constructor(root: HTMLElement) {
    super('a', root, 'avatar', '', { href: '/' });
  }
}
