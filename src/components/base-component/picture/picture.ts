import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../base-component';
import './picture.css';

export default class Picture extends BaseComponent<'img'> {
  constructor(
    parent: HTMLElement,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    const classes = getClassNames('icon', additionalClasses);
    super('img', parent, classes, '', attributes);
  }
}
