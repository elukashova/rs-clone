/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import './find-friends.css';
import BaseComponent from '../../components/base-component/base-component';
import { Token } from '../../app/loader/loader-requests.types';
import { FriendData } from '../../app/loader/loader-responses.types';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import NotFriend from './not-friend/not-friend';
import Input from '../../components/base-component/text-input-and-label/text-input';
import Friend from './friend/friend';
import Pagination from '../../components/base-component/pagination-block/pagination';
import { getFriends, getNotFriends } from '../../app/loader/services/friends-services';
import SvgNames from '../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../utils/consts';
import LoadingTimer from '../../components/base-component/loading/loading';

export default class Friends extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    notFriendsTitle: 'findFriends.notFriendsTitle',
    friendsTitle: 'findFriends.friendsTitle',
    notFriendsSearch: 'findFriends.notFriendsSearch',
    noFriendsMessage: 'findFriends.noFriendsMessage',
    allFriendsMessage: 'findFriends.allFriendsMessage',
  };

  public loadingTimer = new LoadingTimer(document.body);

  public notFriendsAll: NotFriend[] = [];

  public friendsAll: Friend[] = [];

  public visibleFriends: Friend[] = [];

  public visibleNotFriends: NotFriend[] = [];

  public unhiddenFriends: Friend[] = [];

  public unhiddenNotFriends: NotFriend[] = [];

  private friendsPage = 1;

  private notFriendsPage = 1;

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private notFriendsPagination!: Pagination;

  private friendsPagination!: Pagination;

  private notFriendsTitle!: BaseComponent<'h2'>;

  private notFriendsSearch!: Input;

  private friendsTitle!: BaseComponent<'h2'>;

  private friendsSearch!: Input;

  private findingContainer!: BaseComponent<'div'>;

  private notFriendsContainer!: BaseComponent<'div'>;

  private notFriendsBlock!: BaseComponent<'div'>;

  private friendsContainer!: BaseComponent<'div'>;

  private friendsBlock!: BaseComponent<'div'>;

  constructor(parent: HTMLElement) {
    super('section', parent, 'find-friends find-friends-section');
    this.init();
  }

  private init(): void {
    this.loadingTimer.showLoadingCircle();
    setTimeout(() => {
      this.renderPage();
      this.loadingTimer.deleteLoadingCircle();
    }, 3000);
  }

  private renderPage(): void {
    this.renderTitles();
    this.getNotFriendsForRender();
    this.getFriendsForRender();
    this.addSvgIcons();
  }

  private renderTitles(): void {
    this.findingContainer = new BaseComponent('div', this.element, 'find-friends__container');

    this.notFriendsContainer = new BaseComponent('div', this.findingContainer.element, 'not-friends__block-container');

    this.notFriendsBlock = new BaseComponent('div', this.notFriendsContainer.element, 'not-friends__block');

    this.friendsContainer = new BaseComponent('div', this.findingContainer.element, 'friends__block-container');

    this.friendsBlock = new BaseComponent('div', this.friendsContainer.element, 'friends__block');

    this.notFriendsTitle = new BaseComponent(
      'h2',
      this.notFriendsBlock.element,
      'not-friends__title titles',
      this.dictionary.notFriendsTitle,
    );

    this.notFriendsSearch = new Input(
      this.notFriendsBlock.element,
      'not-friends__input-search input-search',
      this.dictionary.notFriendsSearch,
      {
        type: 'search',
      },
    );

    this.friendsTitle = new BaseComponent(
      'h2',
      this.friendsBlock.element,
      'friends__title titles',
      this.dictionary.friendsTitle,
    );

    this.friendsSearch = new Input(
      this.friendsBlock.element,
      'friends__input-search input-search',
      this.dictionary.notFriendsSearch,
      {
        type: 'search',
      },
    );
  }

  private getNotFriendsForRender(): void {
    if (this.token) {
      getNotFriends(this.token).then((usersData: FriendData[]): void => {
        if (usersData.length) {
          this.notFriendsAll = usersData.map((user: FriendData, index: number): NotFriend => {
            const notFriend: NotFriend = new NotFriend(this.notFriendsBlock.element, user, 'not-friends__element', {
              id: `not-friends-${index}`,
            });
            return notFriend;
          });
        } else {
          this.addNotFoundForNotFriends();
        }
        this.addPaginationForNotFriends();
        this.addListenersForNotFriends();
        const visibleNotFriends: NotFriend[] = this.getNotFriendsPage(this.notFriendsPage, this.notFriendsAll);
        Friends.hiddenUsers(this.notFriendsAll);
        Friends.doVisibleUsers(visibleNotFriends);
      });
    }
  }

  private addSvgIcons(): void {
    this.notFriendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    this.friendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    /* setTimeout(() => {
      this.loadingMap.deleteLoadingCircle();
    }, 1000); */
  }

  private addPaginationForNotFriends(): void {
    this.notFriendsPagination = new Pagination(
      this.notFriendsContainer,
      'not-friends__pagination',
      1,
      4,
      this.notFriendsAll.length,
    );
  }

  private addNotFoundForNotFriends(): void {
    const fountNotFriend: BaseComponent<'div'> = new BaseComponent(
      'div',
      this.notFriendsBlock.element,
      'not-friends__not-found',
      this.dictionary.allFriendsMessage,
    );
  }

  private static hiddenUsers(userArray: Friend[] | NotFriend[]): void {
    userArray.forEach((user: NotFriend | Friend): void => user.element.classList.add('hidden-user'));
  }

  private static doVisibleUsers(userArray: Friend[] | NotFriend[]): void {
    userArray.forEach((user: NotFriend | Friend): void => user.element.classList.remove('hidden-user'));
  }

  private addListenersForNotFriends(): void {
    this.notFriendsSearch.element.addEventListener('input', (): void => {
      this.searchWithPaginationResults();
    });
    this.notFriendsPagination.rightArrowBtn?.element.addEventListener('click', (): void => {
      this.visibleNotFriends.length = 0;
      this.rightArrowBtnCallback(this.notFriendsPagination);
      this.updateVisibleData();
    });
    this.notFriendsPagination.leftArrowBtn?.element.addEventListener('click', (): void => {
      this.visibleNotFriends.length = 0;
      this.leftArrowBtnCallback(this.notFriendsPagination);
      this.updateVisibleData();
    });
  }

  private searchWithPaginationResults(): void {
    this.searchByNotFriends();
    const visible: NotFriend[] = this.getNotFriendsPage(this.notFriendsPage, this.unhiddenNotFriends);

    if (visible.length < 4) {
      Friends.doVisibleUsers(this.notFriendsAll);
      this.getNotFriendsPage(this.notFriendsPage, visible);
    } else if (visible.length >= 4) {
      Friends.hiddenUsers(this.notFriendsAll);
      this.getNotFriendsPage(this.notFriendsPage, visible);
      Friends.doVisibleUsers(this.visibleNotFriends);
    }

    const totalPages: number = this.notFriendsPagination.calculateTotalPages(this.checkNotFriend());
    this.notFriendsPagination.updateTotalPages(totalPages);

    if (this.notFriendsPage === 1) {
      this.notFriendsPagination.disableLeftArrowBtn();
    }
    if (this.notFriendsPage === totalPages) {
      this.notFriendsPagination.disableRightArrowBtn();
    }
  }

  private updateVisibleData(): void {
    this.visibleNotFriends = this.getNotFriendsPage(this.notFriendsPage, this.notFriendsAll);
    Friends.hiddenUsers(this.notFriendsAll);
    Friends.doVisibleUsers(this.visibleNotFriends);
  }

  private getNotFriendsPage(page: number, array: NotFriend[]): NotFriend[] {
    const startIndex: number = (page - 1) * 4;
    const endIndex: number = startIndex + 4;
    this.visibleNotFriends = array
      .filter((notFriend: NotFriend): boolean => !notFriend.element.classList.contains('hidden'))
      .slice(startIndex, endIndex);
    return this.visibleNotFriends;
  }

  private rightArrowBtnCallback = (pagination: Pagination): void => {
    pagination.enableLeftArrowBtn();
    let current: number;
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
    let current: number;
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

  public searchByNotFriends(): void {
    this.unhiddenNotFriends.length = 0;
    this.notFriendsAll.forEach((user: NotFriend): void => user.element.classList.remove('hidden'));
    const value: string = this.notFriendsSearch.inputValue.trim().toLowerCase();
    this.notFriendsAll.forEach((user: NotFriend): void => {
      const username: string | undefined = user.username?.toLowerCase();
      if (username && !username.includes(value)) {
        user.element.classList.add('hidden');
        this.unhiddenNotFriends.splice(this.unhiddenNotFriends.indexOf(user), 1);
      } else {
        user.element.classList.remove('hidden');
        this.unhiddenNotFriends.push(user);
      }
    });
  }

  public checkNotFriend(): number {
    return this.notFriendsAll.filter((notFriend: NotFriend): boolean => !notFriend.element.classList.contains('hidden'))
      .length;
  }

  private getFriendsForRender(): void {
    if (this.token) {
      getFriends(this.token).then((usersData: FriendData[]): void => {
        if (usersData.length) {
          this.friendsAll = usersData.map((user: FriendData, index: number): Friend => {
            const friend: Friend = new Friend(this.friendsBlock.element, user, 'not-friends__element', {
              id: `not-friends-${index}`,
            });
            return friend;
          });
        } else {
          this.addNotFoundForFriends();
        }
        this.addPaginationForFriends();
        this.addListenersForFriends();
        const visibleFriends: Friend[] = this.getFriendsPage(this.friendsPage, this.friendsAll);
        Friends.hiddenUsers(this.friendsAll);
        Friends.doVisibleUsers(visibleFriends);
      });
    }
  }

  private addPaginationForFriends(): void {
    this.friendsPagination = new Pagination(this.friendsContainer, 'friends__pagination', 1, 4, this.friendsAll.length);
  }

  private addNotFoundForFriends(): void {
    const foundFriend: BaseComponent<'div'> = new BaseComponent(
      'div',
      this.friendsBlock.element,
      'not-friends__not-found',
      this.dictionary.noFriendsMessage,
    );
  }

  private addListenersForFriends(): void {
    this.friendsSearch.element.addEventListener('input', (): void => {
      this.searchWithPaginationResultsForFriends();
    });
    this.friendsPagination.rightArrowBtn?.element.addEventListener('click', (): void => {
      this.visibleFriends.length = 0;
      this.rightArrowBtnCallbackForFriends(this.friendsPagination);
      this.updateVisibleDataForFriends();
    });
    this.friendsPagination.leftArrowBtn?.element.addEventListener('click', (): void => {
      this.visibleFriends.length = 0;
      this.leftArrowBtnCallbackForFriends(this.friendsPagination);
      this.updateVisibleDataForFriends();
    });
  }

  private searchWithPaginationResultsForFriends(): void {
    this.searchByFriends();
    const visible: Friend[] = this.getFriendsPage(this.friendsPage, this.unhiddenFriends);

    if (visible.length < 4) {
      Friends.doVisibleUsers(this.friendsAll);
      this.getFriendsPage(this.friendsPage, visible);
    } else if (visible.length >= 4) {
      Friends.hiddenUsers(this.friendsAll);
      this.getFriendsPage(this.friendsPage, visible);
      Friends.doVisibleUsers(this.visibleFriends);
    }

    const totalPages: number = this.friendsPagination.calculateTotalPages(this.checkFriend());
    this.friendsPagination.updateTotalPages(totalPages);

    if (this.friendsPage === 1) {
      this.friendsPagination.disableLeftArrowBtn();
    }
    if (this.friendsPage === totalPages) {
      this.friendsPagination.disableRightArrowBtn();
    }
  }

  private updateVisibleDataForFriends(): void {
    this.visibleFriends = this.getFriendsPage(this.friendsPage, this.friendsAll);
    Friends.hiddenUsers(this.friendsAll);
    Friends.doVisibleUsers(this.visibleFriends);
  }

  private getFriendsPage(page: number, array: Friend[]): Friend[] {
    const startIndex: number = (page - 1) * 4;
    const endIndex: number = startIndex + 4;
    this.visibleFriends = array
      .filter((friend: Friend): boolean => !friend.element.classList.contains('hidden'))
      .slice(startIndex, endIndex);
    return this.visibleFriends;
  }

  private rightArrowBtnCallbackForFriends = (pagination: Pagination): void => {
    pagination.enableLeftArrowBtn();
    let current: number;
    if (pagination === this.friendsPagination) {
      this.friendsPage += 1;
      current = this.friendsPage;
    } else {
      this.friendsPage += 1;
      current = this.friendsPage;
    }
    pagination.updateCurrentPage(current);
    pagination.disableArrowsFirstLastPage(current);
  };

  private leftArrowBtnCallbackForFriends = (pagination: Pagination): void => {
    let current: number;
    if (pagination === this.friendsPagination) {
      this.friendsPage -= 1;
      current = this.friendsPage;
    } else {
      this.friendsPage -= 1;
      current = this.friendsPage;
    }
    pagination.enableRightArrowBtn();
    pagination.updateCurrentPage(current);
    pagination.disableArrowsFirstLastPage(current);
  };

  public searchByFriends(): void {
    this.unhiddenFriends.length = 0;
    this.friendsAll.forEach((user: Friend): void => user.element.classList.remove('hidden'));
    const value: string = this.friendsSearch.inputValue.trim().toLowerCase();
    this.friendsAll.forEach((user: Friend): void => {
      const username: string | undefined = user.username?.toLowerCase();
      if (username && !username.includes(value)) {
        user.element.classList.add('hidden');
        this.unhiddenFriends.splice(this.unhiddenFriends.indexOf(user), 1);
      } else {
        user.element.classList.remove('hidden');
        this.unhiddenFriends.push(user);
      }
    });
  }

  public checkFriend(): number {
    return this.friendsAll.filter((element) => !element.element.classList.contains('hidden')).length;
  }
}
