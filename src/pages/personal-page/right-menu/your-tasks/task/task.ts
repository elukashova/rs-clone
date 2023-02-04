import './task.css';
import BaseComponent from '../../../../../components/base-component/base-component';
import Button from '../../../../../components/button/button';

export default class Task extends BaseComponent<'div'> {
  public photo = new BaseComponent('img', undefined, 'task__photo');

  public name = new BaseComponent('span', undefined, 'task__name');

  public participants = new BaseComponent('span', undefined, 'tasl__participants');

  private allTasksButton: Button | undefined;

  constructor(photo: string, name: string, participants: string) {
    super('div', undefined, 'task');
    this.init(photo, name, participants);
  }

  public init(photo: string, name: string, participants: string): void {
    this.photo.element.src = photo;
    this.name.element.textContent = name;
    this.participants.element.textContent = `${participants} участников`;
    const container = document.createElement('div');
    container.append(this.name.element, this.participants.element);
    this.element.append(this.photo.element, container);
  }
}
