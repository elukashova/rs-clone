import BaseComponent from '../../base-component/base-component';
import './icon.css';
import getClassNames from '../../../utils/utils';

export default class HeaderIcon extends BaseComponent<'span'> {
  constructor(root: HTMLElement, additionalClasses?: string) {
    const classes = getClassNames('header-icon', additionalClasses);
    super('span', root, classes);
  }
}
