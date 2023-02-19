import BaseComponent from '../../../../../components/base-component/base-component';

export default class PostReactions extends BaseComponent<'div'> {
  private counterWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'post-reactions__counter-wrapper',
  );

  private avatarsWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.counterWrapper.element,
    'post-reactions__counter-avatars',
  );

  constructor(parent: HTMLElement) {
    super('div', parent, 'post-reactions');
  }
}
