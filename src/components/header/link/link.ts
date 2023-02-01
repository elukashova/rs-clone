import BaseComponent from '../../base-component/base-component';
import getClassNames from '../../../utils/utils';

export default class NavigationLink extends BaseComponent<'a'> {
  constructor(parent: HTMLElement, text: string, additionalClasses?: string) {
    const classes = getClassNames('nav-link', additionalClasses);
    super('a', parent, classes, text, { href: '/challenges' });
  }
}
