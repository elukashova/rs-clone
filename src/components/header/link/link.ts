import BaseComponent from '../../base-component/base-component';

export default class NavigationLink extends BaseComponent<'a'> {
  constructor(root: HTMLElement, text: string, additionalClasses?: string) {
    const classes = additionalClasses ? `nav-link ${additionalClasses}` : 'nav-link';
    super('a', root, classes, text, { href: '/challenges' });
  }
}
