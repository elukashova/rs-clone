/* eslint-disable max-len */
import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import { Link } from './link.types';

export default class NavigationLink extends BaseComponent<'a'> {
  constructor(public replaceMainCallback: () => void, data: Link) {
    const classes = getClassNames('nav-link', data.additionalClasses);
    super('a', data.parent, classes, data.text, data.attributes);
    this.element.addEventListener('click', this.loginLinkCallback);
  }

  public loginLinkCallback = (e: Event): void => {
    e.preventDefault();
    window.history.pushState({}, '', this.element.href);
    this.replaceMainCallback();
  };
}
