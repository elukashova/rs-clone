import './your-tasks.css';
import BaseComponent from '../../../../components/base-component/base-component';
import Task from './task/task';
import Button from '../../../../components/button/button';

export default class YourTasks extends BaseComponent<'div'> {
  private heading = new BaseComponent('h5', this.element, 'your-tasks__heading', 'Ваши Задачи');

  private myTasks = new BaseComponent('div', this.element, 'your-tasks__tasks');

  private allTasksButton = new Button(this.element, 'Все Задачи');

  private allTasks: HTMLElement[] = [];

  constructor(parent: HTMLElement) {
    super('div', parent, 'your-tasks');
    this.renderTasks();
  }

  // будет рендерить все таски которые есть в базе
  private renderTasks(): void {
    this.addTasks('', 'super event', '10000');
    this.allTasks?.forEach((task) => this.myTasks.element.append(task));
  }

  // будет добавлять таски в базу. Логику нужно будет адаптировать под БД
  public addTasks(photo: string, name: string, participants: string): void {
    const task = new Task(photo, name, participants).element;
    this.allTasks?.push(task);
  }
}
