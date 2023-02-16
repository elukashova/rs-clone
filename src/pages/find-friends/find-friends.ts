import './find-friends.css';
import BaseComponent from '../../components/base-component/base-component';
import { User, Token /* FriendId */ } from '../../app/loader/loader.types';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import { ProjectColors } from '../../utils/consts';
import NotFriend from './not-friend/not-friend';
import Input from '../../components/base-component/text-input-and-label/text-input';
import SvgNames from '../../components/base-component/svg/svg.types';
import Friend from './friend/friend';
import Pagination from '../../components/base-component/pagination-block/pagination';
import { /* addFriend, */ getFriends, getNotFriends } from '../../app/loader/services/friends-services';
/* import eventEmitter from '../../utils/event-emitter'; */

export default class Friends extends BaseComponent<'section'> {
  public notFriendsAll: NotFriend[] = [];

  public friendsAll: Friend[] = [];

  private findingContainer = new BaseComponent('div', this.element, 'find-friends__container');

  private notFriendsContainer = new BaseComponent('div', this.findingContainer.element, 'not-friends__block-container');

  private notFriendsBlock = new BaseComponent('div', this.notFriendsContainer.element, 'not-friends__block');

  private notFriendsTitle = new BaseComponent('h3', this.notFriendsBlock.element, 'not-friends__title', 'Find friends');

  private notFriendsSearch = new Input(
    this.notFriendsBlock.element,
    'not-friends__input-search input-search',
    'Sportsman name',
    {
      type: 'search',
    },
  );

  private friendsContainer = new BaseComponent('div', this.findingContainer.element, 'friends__block-container');

  private friendsBlock = new BaseComponent('div', this.friendsContainer.element, 'friends__block');

  private friendsTitle = new BaseComponent('h3', this.friendsBlock.element, 'friends__title', 'My Subscriptions');

  private friendsSearch = new Input(this.friendsBlock.element, 'friends__input-search input-search', 'Sportsman name', {
    type: 'search',
  });

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private currentUser!: User;

  private notFriendsPagination!: Pagination;

  private friendsPagination!: Pagination;

  private friendsIsAdded: boolean = true;

  private notFriendsIsAdded: boolean = false;

  constructor(parent: HTMLElement) {
    super('section', parent, 'find-friends find-friends-section');
    this.renderPage();
    this.addListeners();
  }

  private renderPage(): void {
    this.getFriendsForRender();
    this.getNotFriendsForRender();
    this.addSvgIcons();
    this.renderPaginations();
  }

  private getFriendsForRender(): void {
    if (this.token) {
      getFriends(this.token).then((usersData) => {
        usersData.forEach((user, index) => {
          const friend = new Friend(this.friendsBlock.element, user, 'friends__element', {
            id: `friends-${index}`,
          });
          this.friendsAll.push(friend);
        });
      });
    }
  }

  private getNotFriendsForRender(): void {
    if (this.token) {
      getNotFriends(this.token).then((usersData) => {
        usersData.forEach((user, index) => {
          const notFriend = new NotFriend(this.notFriendsBlock.element, user, 'not-friends__element', {
            id: `not-friends-${index}`,
          });
          this.notFriendsAll.push(notFriend);
        });
      });
    }
  }

  private addListeners(): void {
    this.notFriendsSearch.element.addEventListener('input', (): void => {
      Friends.search(this.notFriendsAll, this.notFriendsSearch);
    });
    this.friendsSearch.element.addEventListener('input', (): void => {
      Friends.search(this.friendsAll, this.friendsSearch);
    });

    /*  this.friendsAll.forEach((friend) => {
      friend.unsubscribeButton.element.addEventListener('click', (): void => {
        // Friends.removeElement(friend.element);
        // метод, который удалит пользователя из друзей
      });
    }); */
  }

  /* private addFriendCallback = (): void => {
    if (this.token) {
      Friends.addNewFriend(this.token);
      this.notFriendsIsAdded = true;
      eventEmitter.emit('addFriend', {});
      this.setButtonFunction();
    }
  };

  private deleteFriendCallback = (): void => {
    if (this.token) {
      Friends.deleteFriend(this.token, this.requestInfo);
      this.notFriendsIsAdded = false;
      eventEmitter.emit('deleteFriend', {});
      this.setButtonFunction();
    }
  };

  private setButtonFunction(): void {
    if (this.isAdded === false) {
      this.plusButton.replaceBtnSvg(SvgNames.Plus, 'suggested-friends', ProjectColors.Turquoise);
      this.plusButton.element.removeEventListener('click', this.deleteFriendCallback);
      this.plusButton.element.addEventListener('click', this.addFriendCallback);
    } else {
      this.plusButton.replaceBtnSvg(SvgNames.CloseThin,
         'close-btn suggested-friends', ProjectColors.Orange);
      this.plusButton.element.removeEventListener('click', this.addFriendCallback);
      this.plusButton.element.addEventListener('click', this.deleteFriendCallback);
    }
  }

  private static deleteFriend(token: Token, data: FriendId): Promise<void> {
    return deleteFriend(token, data);
  }

  private static addNewFriend(token: Token, data: FriendId): Promise<void> {
    return addFriend(token, data);
  }
 */
  private addSvgIcons(): void {
    this.notFriendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    this.friendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
  }

  private renderPaginations(): void {
    this.notFriendsPagination = new Pagination(this.notFriendsContainer, 'not-friends__pagination', 1, 4, 10);

    this.friendsPagination = new Pagination(this.friendsContainer, 'friends__pagination', 1, 4, 10);
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
