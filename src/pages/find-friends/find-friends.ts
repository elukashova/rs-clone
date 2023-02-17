import './find-friends.css';
import BaseComponent from '../../components/base-component/base-component';
import { FriendData, Token } from '../../app/loader/loader.types';
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

  public visibleFriends: Friend[] | NotFriend[] = [];

  public visibleNotFriends: NotFriend[] | Friend[] = [];

  private friendsPage = 1;

  private notFriendsPage = 0;

  private findingContainer = new BaseComponent('div', this.element, 'find-friends__container');

  private notFriendsContainer = new BaseComponent('div', this.findingContainer.element, 'not-friends__block-container');

  private notFriendsBlock = new BaseComponent('div', this.notFriendsContainer.element, 'not-friends__block');

  private notFriendsTitle = new BaseComponent('h2', this.notFriendsBlock.element, 'not-friends__title', 'Find friends');

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

  private friendsTitle = new BaseComponent('h2', this.friendsBlock.element, 'friends__title', 'My Subscriptions');

  private friendsSearch = new Input(this.friendsBlock.element, 'friends__input-search input-search', 'Sportsman name', {
    type: 'search',
  });

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private notFriendsPagination!: Pagination;

  private friendsPagination!: Pagination;

  private searchString: string = '';

  constructor(parent: HTMLElement) {
    super('section', parent, 'find-friends find-friends-section');
    this.renderPage();
    this.addSvgIcons();
  }

  private renderPage(): void {
    this.getFriendsForRender();
    this.getNotFriendsForRender();
  }

  private getFriendsForRender(): void {
    if (this.token) {
      getFriends(this.token).then((usersData: FriendData[]) => {
        usersData.forEach((user, index) => {
          const friend = new Friend(this.friendsBlock.element, user, 'friends__element', {
            id: `friends-${index}`,
          });
          this.friendsAll.push(friend);
        });
        this.friendsPagination = new Pagination(
          this.friendsContainer,
          'friends__pagination',
          1,
          4,
          this.friendsAll.length,
        );
        this.addListenersForFriends();
        // Friends.search(this.friendsAll, this.friendsSearch);
        const visibleFriends = Friends.getFriendsPage(1, this.friendsAll);
        Friends.hiddenUsers(this.friendsAll);
        Friends.doVisibleUsers(visibleFriends);
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
        this.notFriendsPagination = new Pagination(
          this.notFriendsContainer,
          'not-friends__pagination',
          1,
          4,
          this.notFriendsAll.length,
        );
        this.addListenersForNotFriends();
        const visibleNotFriends = Friends.getNotFriendsPage(1, this.notFriendsAll);
        Friends.hiddenUsers(this.notFriendsAll);
        Friends.doVisibleUsers(visibleNotFriends);
      });
    }
  }

  private static hiddenUsers(userArray: Friend[] | NotFriend[]): void {
    userArray.forEach((user) => user.element.classList.add('hidden-user'));
  }

  private static doVisibleUsers(userArray: Friend[] | NotFriend[]): void {
    userArray.forEach((user) => user.element.classList.remove('hidden-user'));
  }

  private addListenersForNotFriends(): void {
    this.notFriendsSearch.element.addEventListener('input', (): void => {
      Friends.search(this.notFriendsAll, this.notFriendsSearch);
      if (this.visibleNotFriends.length < 4) {
        this.visibleNotFriends = Friends.getNotFriendsPage(this.notFriendsPage, this.notFriendsAll);
        console.log(this.visibleNotFriends);
        this.visibleNotFriends.forEach((visible) => visible.element.classList.remove('hidden'));
        Friends.hiddenUsers(this.notFriendsAll);
        Friends.doVisibleUsers(this.visibleNotFriends);
      }
    });
    this.notFriendsPagination.rightArrowBtn?.element.addEventListener('click', () => {
      this.visibleNotFriends.length = 0;
      this.rightArrowBtnCallback(this.notFriendsPagination);
      this.visibleNotFriends = Friends.getNotFriendsPage(this.notFriendsPage, this.notFriendsAll);
      Friends.hiddenUsers(this.notFriendsAll);
      Friends.doVisibleUsers(this.visibleNotFriends);
    });
    this.notFriendsPagination.leftArrowBtn?.element.addEventListener('click', () => {
      this.visibleNotFriends.length = 0;
      this.leftArrowBtnCallback(this.notFriendsPagination);
      this.visibleNotFriends = Friends.getNotFriendsPage(this.notFriendsPage, this.notFriendsAll);
      Friends.hiddenUsers(this.notFriendsAll);
      Friends.doVisibleUsers(this.visibleNotFriends);
    });
  }

  private addListenersForFriends(): void {
    this.friendsSearch.element.addEventListener('input', (): void => {
      Friends.search(this.friendsAll, this.friendsSearch);
    });
    this.friendsPagination.rightArrowBtn?.element.addEventListener('click', () => {
      this.visibleFriends.length = 0;
      this.rightArrowBtnCallback(this.friendsPagination);
    });
    this.friendsPagination.leftArrowBtn?.element.addEventListener('click', () => {
      this.visibleFriends.length = 0;
      this.leftArrowBtnCallback(this.friendsPagination);
    });
  }

  private static getFriendsPage(page: number, array: Friend[]): Friend[] {
    const startIndex = (page - 1) * 4;
    const endIndex = startIndex + 4;
    return array.filter((friend) => !friend.element.classList.contains('hidden')).slice(startIndex, endIndex);
  }

  private static getNotFriendsPage(page: number, array: NotFriend[]): NotFriend[] {
    const startIndex = (page - 1) * 4;
    const endIndex = startIndex + 4;
    return array.filter((notFriend) => !notFriend.element.classList.contains('hidden')).slice(startIndex, endIndex);
  }

  private rightArrowBtnCallback = (pagination: Pagination): void => {
    pagination.enableLeftArrowBtn();
    let current;
    if (pagination === this.friendsPagination) {
      this.friendsPage += 1;
      current = this.friendsPage;
    } else {
      this.notFriendsPage += 1;
      current = this.notFriendsPage;
    }
    pagination.updateCurrentPage(current);
    pagination.disableArrowsFirstLastPage(current);
  };

  private leftArrowBtnCallback = (pagination: Pagination): void => {
    let current;
    if (pagination === this.friendsPagination) {
      this.friendsPage -= 1;
      current = this.friendsPage;
    } else {
      this.notFriendsPage -= 1;
      current = this.notFriendsPage;
    }
    pagination.enableRightArrowBtn();
    pagination.updateCurrentPage(current);
    pagination.disableArrowsFirstLastPage(current);
  };

  private addSvgIcons(): void {
    this.notFriendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    this.friendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
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
