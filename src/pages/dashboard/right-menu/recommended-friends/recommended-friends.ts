import './recommended-friends.css';
import BaseComponent from '../../../../components/base-component/base-component';
import RandomFriend from './add-friend/random-friend';
import RandomFriendCard from '../random-friend-card/random-friend-card';

export default class RecommendedFriends extends BaseComponent<'div'> {
  private heading = new BaseComponent('h5', this.element, 'recommended-friends__heading', 'Suggested friends');

  private friends = new BaseComponent('div', this.element, 'recommended-friends__friends');

  private friendCard = new RandomFriendCard(this.element);

  private randomFriends: HTMLElement[] = [];

  constructor(parent: HTMLElement) {
    super('div', parent, 'recommended-friends');
    this.renderFriends();
  }

  // будет рендерить вceх друзей которые есть в базе
  private renderFriends(): void {
    this.addFriends('', 'Nia Wolovitz', 'Israel');
    this.randomFriends?.forEach((friend) => this.friends.element.append(friend));
  }

  // будет добавлять друзей в базу. Логику нужно будет адаптировать под БД
  public addFriends(photo: string, name: string, participants: string): void {
    const friend = new RandomFriend(photo, name, participants).element;
    this.randomFriends?.push(friend);
  }
}
