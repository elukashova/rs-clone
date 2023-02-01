import BaseComponent from '../base-component/base-component';
import getClassNames from '../../utils/utils';

export default class Button extends BaseComponent<'button'> {
  constructor(parent: HTMLElement, text: string, additionalClasses?: string) {
    const classes = getClassNames('btn', additionalClasses);
    super('button', parent, classes, text);
  }
}
