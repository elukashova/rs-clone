import './personal-page.css';
import BaseComponent from '../../components/base-component/base-component';
import LeftMenu from './left-menu/left-menu';
import TrainingFeed from './training-feed/training-feed';
import RightMenu from './right-menu/right-menu';

export default class PersonalPage extends BaseComponent<'section'> {
  private leftMenu = new LeftMenu(this.element);

  private trainingFeed = new TrainingFeed(this.element);

  private rightMenu = new RightMenu(this.element);

  constructor(parent: HTMLElement) {
    super('section', parent, 'personal-page');
  }
}
