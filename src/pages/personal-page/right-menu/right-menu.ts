import './right-menu.css';
import BaseComponent from '../../../components/base-component/base-component';

export default class RightMenu extends BaseComponent<'aside'> {
  constructor(parent: HTMLElement) {
    super('aside', parent);
  }
}
