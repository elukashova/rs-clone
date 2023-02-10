import './training-feed.css';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';

export default class TrainingFeed extends BaseComponent<'article'> {
  public message = new BaseComponent('span', undefined, 'training-feed__message', 'Лента пока пуста, Вы можете');

  public addTrainingButton: Button | undefined;

  public findFriendsButton: Button | undefined;

  private buttonContainer: BaseComponent<'div'> | undefined;

  constructor(parent: HTMLElement) {
    super('article', parent, 'training-feed');
    this.showGreetingMessage();
  }

  public showGreetingMessage(): void {
    this.element.append(this.message.element);
    this.buttonContainer = new BaseComponent('div', this.element, 'training-feed__buttons');
    this.addTrainingButton = new Button(this.buttonContainer.element, 'Добавить Тренировку', 'btn_main');
    this.addTrainingButton = new Button(this.buttonContainer.element, 'Найти Друзей', 'btn_main');
  }

  public deleteGreetingMessage(): void {
    this.message.element.remove();
    this.addTrainingButton?.element.remove();
    this.findFriendsButton?.element.remove();
  }
}
