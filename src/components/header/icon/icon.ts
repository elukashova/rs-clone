import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../../base-component/base-component';
import './icon.css';

export default class HeaderIcon extends BaseComponent<'img'> {
  // eslint-disable-next-line max-len
  constructor(
    parent: HTMLElement,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    const classes = getClassNames('header-icon', additionalClasses);
    super('img', parent, classes, '', attributes);
  }
}
