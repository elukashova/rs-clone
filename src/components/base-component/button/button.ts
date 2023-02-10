import BaseComponent from '../base-component';
import { getClassNames } from '../../../utils/utils';
import './button.css';

export default class Button extends BaseComponent<'button'> {
  // eslint-disable-next-line max-len
  constructor(parent: HTMLElement, text: string, additionalClasses?: string, attributes?: Record<string, string>) {
    const classes = getClassNames('btn', additionalClasses);
    super('button', parent, classes, text, attributes);
  }
}
