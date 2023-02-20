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
import Task from './task/task';
import Svg from '../../../components/base-component/svg/svg';
import SvgNames from '../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../utils/consts';

export default class RightMenu extends BaseComponent<'aside'> {
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

  private addRouteIconWrapper: BaseComponent<'div'> | null = null;

  private addRouteLinkIcon: Svg | null = null;

  private addRouteLink: NavigationLink | null = null;

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
          this.friendsWrapper = new BaseComponent('div', this.element, 'suggested-friends__wrapper');

          this.addFriendsHeaderWrapper = new BaseComponent(
            'div',
            this.friendsWrapper.element,
            'suggested-friends__header-wrapper',
          );

          this.friendsHeading = new NavigationLink(this.replaceMainCallback, {
            text: 'Suggested friends',
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
    if (this.token) {
      // получаем данные с сервера по челленджам
      /* getNotFriends(this.token).then((users: FriendData[]) => {}); */
    }
    const challenges = ['sloth', 'yoga', 'hiking', 'photo']; /* 'sloth', 'yoga', 'hiking', 'photo' */
    if (challenges.length) {
      this.addChallengeLinkWrapper = new BaseComponent('div', this.element, 'add-challenge__wrapper');

      this.addChallengeHeaderWrapper = new BaseComponent(
        'div',
        this.addChallengeLinkWrapper.element,
        'add-challenge__header-wrapper',
      );

      this.challengeHeading = new NavigationLink(this.replaceMainCallback, {
        text: 'Your challenges',
        parent: this.addChallengeHeaderWrapper.element,
        additionalClasses: 'right-menu__link add-challenge__link link',
        attributes: { href: Routes.Challenges },
      });
      for (let i: number = 0; i < 3; i += 1) {
        this.newChallenge = new Task(this.addChallengeLinkWrapper.element, challenges[i]);
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
      text: 'Add new route',
      parent: this.addRouteLinkWrapper.element,
      additionalClasses: 'right-menu__link add-route__link link',
      attributes: { href: Routes.AddRoute },
    });
  }
}
