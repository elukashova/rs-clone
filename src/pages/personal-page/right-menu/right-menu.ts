import './right-menu.css';
import BaseComponent from '../../../components/base-component/base-component';
import YourTasks from './your-tasks/your-tasks';

export default class RightMenu extends BaseComponent<'aside'> {
  public yourTasks = new YourTasks(this.element);

  constructor(parent: HTMLElement) {
    super('aside', parent, 'right-menu');
  }
}
