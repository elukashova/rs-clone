import './right-menu.css';
import BaseComponent from '../../../components/base-component/base-component';
import Routes from '../../../app/router/router.types';
import NavigationLink from '../../../components/base-component/link/link';
import RandomFriendCard from './random-friend-card/random-friend-card';
import { checkDataInLocalStorage } from '../../../utils/local-storage';
import { Token } from '../../../app/loader/loader-requests.types';
import { FriendData, User } from '../../../app/loader/loader-responses.types';
import { getNotFriends } from '../../../app/loader/services/friends-services';
import { provideRandomUsers } from '../../../utils/utils';
import Svg from '../../../components/base-component/svg/svg';
import SvgNames from '../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../utils/consts';
import Task from './task/task';

export default class RightMenu extends BaseComponent<'aside'> {
  private dictionary: Record<string, string> = {
    addNewRoute: 'dashboard.rightMenu.addNewRoute',
    heading: 'dashboard.rightMenu.friendsHeading',
    headingChallenges: 'challenges.headingChallenges',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private friendsCardsLimit: number = 0;

  private challengesAll: Task[] = [];

  private newChallenge!: Task;

  private addChallengeLinkWrapper: BaseComponent<'div'> | null = null;

  private addChallengeHeaderWrapper: BaseComponent<'div'> | null = null;

  private challengeHeading: NavigationLink | null = null;

  private friendsWrapper: BaseComponent<'div'> | null = null;

  private addFriendsHeaderWrapper: BaseComponent<'div'> | null = null;

  private friendsHeading: NavigationLink | null = null;

  private addRouteLinkWrapper: BaseComponent<'div'> | null = null;

  private addRouteLinkIcon: Svg | null = null;

  private addRouteIconWrapper: BaseComponent<'div'> | null = null;

  private addRouteLink: NavigationLink | null = null;

  private challenges: string[] | undefined;

  /* public myChallenges: string[] | undefined = []; */

  // eslint-disable-next-line max-len
  constructor(parent: HTMLElement, private replaceMainCallback: () => void, user: User) {
    super('aside', parent, 'right-menu');
    this.challenges = user.challenges;
    this.doRequestAndRenderChallenges();
    this.makeRequestAndShowFriends();
  }

  private makeRequestAndShowFriends(): void {
    if (this.token) {
      getNotFriends(this.token).then((users: FriendData[]) => {
        this.friendsCardsLimit = users.length < 3 ? users.length : 3;
        if (users.length !== 0) {
          this.friendsWrapper = new BaseComponent('div', this.element, 'suggested-friends__wrapper');

          this.addFriendsHeaderWrapper = new BaseComponent(
            'div',
            this.friendsWrapper.element,
            'suggested-friends__header-wrapper',
          );

          this.friendsHeading = new NavigationLink(this.replaceMainCallback, {
            text: this.dictionary.heading,
            parent: this.addFriendsHeaderWrapper.element,
            additionalClasses: 'right-menu__link suggested-friends__link link',
            attributes: { href: Routes.FindFriends },
          });

          const usersToShow: FriendData[] = provideRandomUsers(users, this.friendsCardsLimit);
          usersToShow.forEach((user) => {
            const card: RandomFriendCard = new RandomFriendCard(user);
            if (this.friendsWrapper) {
              this.friendsWrapper.element.append(card.element);
            }
          });
          this.renderNewRoute();
        } else {
          this.renderNewRoute();
        }
      });
    }
  }

  private doRequestAndRenderChallenges(): void {
    if (this.challenges && this.challenges.length) {
      this.addChallengeLinkWrapper = new BaseComponent('div', this.element, 'add-challenge__wrapper');

      this.addChallengeHeaderWrapper = new BaseComponent(
        'div',
        this.addChallengeLinkWrapper.element,
        'add-challenge__header-wrapper',
      );

      this.challengeHeading = new NavigationLink(this.replaceMainCallback, {
        text: this.dictionary.headingChallenges,
        parent: this.addChallengeHeaderWrapper.element,
        additionalClasses: 'right-menu__link add-challenge__link link',
        attributes: { href: Routes.Challenges },
      });
      const numInstances = Math.min(this.challenges.length, 3);
      for (let i: number = 0; i < numInstances; i += 1) {
        this.newChallenge = new Task(this.addChallengeLinkWrapper.element, this.challenges[i]);
        this.challengesAll.push(this.newChallenge);
      }
    }
  }

  private renderNewRoute(): void {
    this.addRouteLinkWrapper = new BaseComponent('div', this.element, 'add-route__wrapper');

    this.addRouteIconWrapper = new BaseComponent('div', this.addRouteLinkWrapper.element, 'add-route__icon-wrapper');

    this.addRouteLinkIcon = new Svg(
      this.addRouteIconWrapper.element,
      SvgNames.AddMap,
      ProjectColors.Orange,
      'add-route__icon',
    );

    this.addRouteLink = new NavigationLink(this.replaceMainCallback, {
      text: this.dictionary.addNewRoute,
      parent: this.addRouteLinkWrapper.element,
      additionalClasses: 'right-menu__link add-route__link link',
      attributes: { href: Routes.AddRoute },
    });
  }
}
