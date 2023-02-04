/* eslint-disable max-len */
import BaseComponent from '../base-component/base-component';
import getClassNames from '../../utils/utils';
import { Link } from './link.types';

export default class NavigationLink extends BaseComponent<'a'> {
  constructor(private replaceMainCallback: () => Promise<void>, data: Link) {
    const classes = getClassNames('nav-link', data.additionalClasses);
    super('a', data.parent, classes, data.text);
    this.element.addEventListener('click', this.loginLinkCallback);
  }

  private loginLinkCallback = (e: Event): void => {
    e.preventDefault();
    window.history.pushState({}, '', this.element.href);
    this.replaceMainCallback();
  };
}
