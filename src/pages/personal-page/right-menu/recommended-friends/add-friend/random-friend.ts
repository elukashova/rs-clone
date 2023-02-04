import './random-friend.css';
import BaseComponent from '../../../../../components/base-component/base-component';

export default class RandomFriend extends BaseComponent<'div'> {
  public addIcon = new BaseComponent('span', this.element, 'random-friend__icon');

  public photo = new BaseComponent('img', undefined, 'random-friend_photo');

  public name = new BaseComponent('span', undefined, 'random-friend__name');

  public place = new BaseComponent('span', undefined, 'random-friend__place');

  constructor(photo: string, name: string, participants: string) {
    super('div', undefined, 'random-friend');
    this.init(photo, name, participants);
  }

  public init(photo: string, name: string, place: string): void {
    this.photo.element.src = photo;
    this.name.element.textContent = name;
    this.place.element.textContent = place;
    const container = document.createElement('div');
    container.append(this.name.element, this.place.element);
    this.element.append(this.photo.element, container);
  }
}
