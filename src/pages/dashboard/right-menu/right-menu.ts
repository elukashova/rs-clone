import './right-menu.css';
import BaseComponent from '../../../components/base-component/base-component';
import Routes from '../../../app/router/router.types';
import NavigationLink from '../../../components/base-component/link/link';
import { Link } from '../../../components/base-component/link/link.types';
import RandomFriendCard from './random-friend-card/random-friend-card';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import { Token } from '../../../app/loader/loader-requests.types';
import { FriendData } from '../../../app/loader/loader-responses.types';
import { getNotFriends } from '../../../app/loader/services/friends-services';
import { provideRandomUsers } from '../../../utils/utils';

export default class RightMenu extends BaseComponent<'aside'> {
  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private friendsCardsLimit: number = 0;

  private friendsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'suggested-friends__wrapper');

  private friendsHeading = new BaseComponent(
    'h4',
    this.friendsWrapper.element,
    'suggested-friends__heading',
    'Suggested friends',
  );

  private friendCard: RandomFriendCard | undefined;

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

  private AddRouteLink = new NavigationLink(this.replaceMainCallback, this.data);

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('aside', parent, 'right-menu');
    if (this.token) {
      getNotFriends(this.token).then((users: FriendData[]) => {
        this.friendsCardsLimit = users.length < 3 ? users.length : 3;
        if (users.length !== 0) {
          const usersToShow: FriendData[] = provideRandomUsers(users, this.friendsCardsLimit);
          usersToShow.forEach((user) => {
            const card: RandomFriendCard = new RandomFriendCard(user);
            this.friendsWrapper.element.append(card.element);
          });
        }
      });
    }
  }
}
