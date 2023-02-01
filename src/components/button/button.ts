import BaseComponent from '../base-component/base-component';

export default class Button extends BaseComponent<'button'> {
  constructor(root: HTMLElement, text: string, additionalClasses?: string) {
    const classes = additionalClasses ? `btn ${additionalClasses}` : 'btn';
    super('button', root, classes, text);
  }
}
