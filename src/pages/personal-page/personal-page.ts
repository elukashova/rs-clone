import './personal-page.css';
import BaseComponent from '../../components/base-component/base-component';
import LeftMenu from './left-menu/left-menu';

export default class PersonalPage extends BaseComponent<'section'> {
  private leftMenu = new LeftMenu(this.element);

  constructor(parent: HTMLElement) {
    super('section', parent, 'personal-page');
  }
}
