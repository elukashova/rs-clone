import './find-friends.css';
import users from './user-test';
import BaseComponent from '../../components/base-component/base-component';
import { User, Token } from '../../app/loader/loader.types';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import { ProjectColors } from '../../utils/consts';
import NotFriend from './not-friend/not-friend';
import Input from '../../components/base-component/text-input-and-label/text-input';
import SvgNames from '../../components/base-component/svg/svg.types';
import Friend from './friend/friend';
import { UserData } from './type-friends';

export default class Friends extends BaseComponent<'section'> {
  public notFriendsAll: NotFriend[] = [];

  public friendsAll: Friend[] = [];

  private findingContainer = new BaseComponent('div', this.element, 'find-friends__container');

  private notFriendsBlock = new BaseComponent('div', this.findingContainer.element, 'not-friends__block');

  private notFriendsTitle = new BaseComponent('h3', this.notFriendsBlock.element, 'not-friends__title', 'Find friends');

  private notFriendsSearch = new Input(
    this.notFriendsBlock.element,
    'not-friends__input-search input-search',
    'Sportsman name',
    {
      type: 'search',
    },
  );

  private friendsBlock = new BaseComponent('div', this.findingContainer.element, 'friends__block');

  private friendsTitle = new BaseComponent('h3', this.friendsBlock.element, 'friends__title', 'My Subscriptions');

  private friendsSearch = new Input(this.friendsBlock.element, 'friends__input-search input-search', 'Sportsman name', {
    type: 'search',
  });

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private currentUser!: User;

  constructor(parent: HTMLElement) {
    super('section', parent, 'find-friends find-friends-section');
    /* if (this.token) {
      getUser(this.token).then((user) => {
        console.log(user);
        this.currentUser = {
          ...user,
        };
      });
    } */
    this.renderPage(users);
    this.notFriendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    this.friendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');

    this.notFriendsSearch.element.addEventListener('input', (): void => {
      Friends.search(this.notFriendsAll, this.notFriendsSearch);
    });
    this.friendsSearch.element.addEventListener('input', (): void => {
      Friends.search(this.friendsAll, this.friendsSearch);
    });
  }

  private renderPage(data: UserData[]): void {
    data.forEach((user, index) => {
      const notFriend = new NotFriend(
        this.notFriendsBlock.element,
        'not-friends__element',
        {
          id: `not-friends-${index}`,
        },
        user,
      );
      this.notFriendsAll.push(notFriend);
    });

    data.forEach((user, index) => {
      const friend = new Friend(
        this.friendsBlock.element,
        'friends__element',
        {
          id: `friends-${index}`,
        },
        user,
      );
      this.friendsAll.push(friend);
    });
  }

  public static search(array: NotFriend[] | Friend[], input: Input): void {
    array.forEach((user: NotFriend | Friend): void => user.element.classList.remove('hidden'));
    const value = input.inputValue.trim().toLowerCase();
    array.forEach((user: NotFriend | Friend): void => {
      if (user && user.username && !user.username.toLowerCase().includes(value)) {
        user.element.classList.add('hidden');
      } else {
        user.element.classList.remove('hidden');
      }
    });
  }
}
