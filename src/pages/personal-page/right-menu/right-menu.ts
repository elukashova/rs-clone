import './right-menu.css';
import BaseComponent from '../../../components/base-component/base-component';
import YourTasks from './your-tasks/your-tasks';
import RecommendedFriends from './recommended-friends/recommended-friends';

export default class RightMenu extends BaseComponent<'aside'> {
  public yourTasks = new YourTasks(this.element);

  public recommendedFriends = new RecommendedFriends(this.element);

  constructor(parent: HTMLElement) {
    super('aside', parent, 'right-menu');
  }
}
