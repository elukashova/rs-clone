import BaseComponent from '../../base-component/base-component';
import './icon.css';

export default class HeaderIcon extends BaseComponent<'span'> {
  constructor(root: HTMLElement, additionalClasses?: string) {
    const classes = additionalClasses ? `header-icon ${additionalClasses}` : 'header-icon';
    super('span', root, classes);
  }
}
