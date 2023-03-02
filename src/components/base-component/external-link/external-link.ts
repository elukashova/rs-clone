import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import './external-link.css';

export default class ExternalLink extends BaseComponent<'a'> {
  constructor(parent: HTMLElement, link: string, additionalClasses?: string) {
    const classes = getClassNames('link', additionalClasses);
    super('a', parent, classes, '', { href: link });
  }
}
