import { getClassNames } from '../../../utils/utils';
import BaseComponent from '../../base-component/base-component';
import './avatar.css';

export default class Avatar extends BaseComponent<'img'> {
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

  public changeAvatarImage(newPath: string): void {
    this.element.setAttribute('src', newPath);
  }
}
