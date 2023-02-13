import './right-menu.css';
import BaseComponent from '../../../components/base-component/base-component';
// import YourTasks from './your-tasks/your-tasks';
// import RecommendedFriends from './recommended-friends/recommended-friends';
import Routes from '../../../app/router/router.types';
import NavigationLink from '../../../components/base-component/link/link';
import { Link } from '../../../components/base-component/link/link.types';
import RandomFriendCard from './random-friend-card/random-friend-card';

export default class RightMenu extends BaseComponent<'aside'> {
  private linkWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'add-route-link__wrapper');

  private linkText: string = 'Add new route';

  private data: Link = {
    text: this.linkText,
    parent: this.linkWrapper.element,
    additionalClasses: 'add-route-link',
    attributes: {
      href: Routes.AddRoute,
    },
  };

  // public yourTasks = new YourTasks(this.element);
  private AddRouteLink = new NavigationLink(this.replaceMainCallback, this.data);

  private friendsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'suggested-friends__wrapper');

  private friendsHeading = new BaseComponent(
    'h4',
    this.friendsWrapper.element,
    'suggested-friends__heading',
    'Suggested friends',
  );

  private friendCard = new RandomFriendCard(this.friendsWrapper.element);

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('aside', parent, 'right-menu');
  }
}
