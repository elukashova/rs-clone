import './right-menu.css';
import BaseComponent from '../../../components/base-component/base-component';
import Routes from '../../../app/router/router.types';
import NavigationLink from '../../../components/base-component/link/link';
import RandomFriendCard from './random-friend-card/random-friend-card';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import { Token } from '../../../app/loader/loader-requests.types';
import { FriendData } from '../../../app/loader/loader-responses.types';
import { getNotFriends } from '../../../app/loader/services/friends-services';
import { provideRandomUsers } from '../../../utils/utils';
import Task from './your-tasks/task/task';
import Svg from '../../../components/base-component/svg/svg';
import SvgNames from '../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../utils/consts';

export default class RightMenu extends BaseComponent<'aside'> {
  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private friendsCardsLimit: number = 0;

  private challengesAll: Task[] = [];

  private addChallengeLinkWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'add-challenge__wrapper',
  );

  private addChallengeIconWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.addChallengeLinkWrapper.element,
    'add-challenge__icon-wrapper',
  );

  private addChallengeLinkIcon = new Svg(
    this.addChallengeIconWrapper.element,
    SvgNames.Goal,
    ProjectColors.Turquoise,
    'add-challenge__icon',
  );

  private challengeHeading = new NavigationLink(this.replaceMainCallback, {
    text: 'Your challenges',
    parent: this.addChallengeLinkWrapper.element,
    additionalClasses: 'right-menu__link add-challenge__link link',
    attributes: { href: Routes.Challenges },
  });

  private friendsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'suggested-friends__wrapper');

  private addFriendsIconWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.friendsWrapper.element,
    'suggested-friends__icon-wrapper',
  );

  private addFriendsIcon = new Svg(
    this.addFriendsIconWrapper.element,
    SvgNames.Hands,
    ProjectColors.Turquoise,
    'suggested-friends__icon',
  );

  private friendsHeading = new NavigationLink(this.replaceMainCallback, {
    text: 'Suggested friends',
    parent: this.friendsWrapper.element,
    additionalClasses: 'right-menu__link suggested-friends__link link',
    attributes: { href: Routes.FindFriends },
  });

  private friendCard: RandomFriendCard | undefined;

  private addRouteLinkWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'add-route__wrapper');

  private addRouteIconWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.addRouteLinkWrapper.element,
    'add-route__icon-wrapper',
  );

  private addRouteLinkIcon = new Svg(
    this.addRouteIconWrapper.element,
    SvgNames.MapMarker,
    ProjectColors.Turquoise,
    'add-route__icon',
  );

  private addRouteLink = new NavigationLink(this.replaceMainCallback, {
    text: 'Add new route',
    parent: this.addRouteLinkWrapper.element,
    additionalClasses: 'right-menu__link add-route__link link',
    attributes: { href: Routes.AddRoute },
  });

  private newChallenge!: Task;

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('aside', parent, 'right-menu');

    this.doRequestAndRenderChallenges();
    this.doRequestAndShowFriends();
  }

  private doRequestAndShowFriends(): void {
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

  private doRequestAndRenderChallenges(): void {
    if (this.token) {
      // получаем данные с сервера по челленджам
      /* getNotFriends(this.token).then((users: FriendData[]) => {}); */
    }
    const challenges = ['sloth', 'yoga', 'hiking', 'photo'];
    for (let i: number = 0; i < 3; i += 1) {
      this.newChallenge = new Task(this.addChallengeLinkWrapper.element, challenges[i]);
      this.challengesAll.push(this.newChallenge);
    }
  }
}
