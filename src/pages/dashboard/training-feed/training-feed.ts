import './training-feed.css';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import ACTIVITY_DATA from '../../../mock/activity.data';
import Post from './post/post';

export default class TrainingFeed extends BaseComponent<'article'> {
  public message = new BaseComponent('span', undefined, 'training-feed__message', 'Лента пока пуста, Вы можете');

  public addTrainingButton: Button | undefined;

  public findFriendsButton: Button | undefined;

  private buttonContainer: BaseComponent<'div'> | undefined;

  constructor(parent: HTMLElement) {
    super('article', parent, 'training-feed');
    this.showGreetingMessage();
    this.addTrainingButton?.element.addEventListener('click', () => {
      this.addPost();
    });
  }

  private addPost(): void {
    this.element.append(new Post(ACTIVITY_DATA).element); // добавляем один пост
  }

  public showGreetingMessage(): void {
    this.element.append(this.message.element);
    this.buttonContainer = new BaseComponent('div', this.element, 'training-feed__buttons');
    this.addTrainingButton = new Button(this.buttonContainer.element, 'Add Activity', 'btn_main');
    this.findFriendsButton = new Button(this.buttonContainer.element, 'Find Friends', 'btn_main');
  }

  public deleteGreetingMessage(): void {
    this.message.element.remove();
    this.addTrainingButton?.element.remove();
    this.findFriendsButton?.element.remove();
  }
}
