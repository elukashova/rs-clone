import './random-friend-card.css';
import BaseComponent from '../../../../components/base-component/base-component';
import SvgButton from '../../../../components/base-component/button/svg-btn';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../../utils/consts';
import Picture from '../../../../components/base-component/picture/picture';
import { checkDataInLocalStorage } from '../../../../utils/local-storage';
import { FriendData, FriendId } from '../../../../app/loader/loader.types';
import { addFriend, deleteFriend } from '../../../../app/loader/services/friends-services';

export default class RandomFriendCard extends BaseComponent<'div'> {
  private id: string | null = RandomFriendCard.getIdFromLocalStorage();

  private plusButton: SvgButton = new SvgButton(this.element, '', 'suggested-friends__btn');

  private infoWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'suggested-friends__info');

  private avatar: Picture = new Picture(this.infoWrapper.element, 'suggested-friends__friend_photo', {
    src: this.user.avatarUrl,
  });

  private detailsWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.infoWrapper.element,
    'suggested-friends__info_details',
  );

  private name: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.detailsWrapper.element,
    'suggested-friends__info_name',
    this.user.username,
  );

  private country: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.detailsWrapper.element,
    'suggested-friends__info_country',
    this.user.country || 'Secret place',
  );

  private isAdded: boolean = false;

  private userInfo: FriendData = {
    id: '',
    username: '',
    country: '',
    avatarUrl: '',
  };

  private testInfo = {
    friendId: this.user.id,
  };

  constructor(private user: FriendData) {
    super('div', undefined, 'suggested-friends__friend');
    this.userInfo = {
      ...user,
    };
    this.plusButton.appendSvg(SvgNames.Plus, 'suggested-friends', ProjectColors.Turquoise);
    this.plusButton.element.addEventListener('click', this.addFriendCallback);
  }

  private addFriendCallback = (): void => {
    if (this.id && this.isAdded === false) {
      RandomFriendCard.addNewFriend(this.id, this.testInfo);
      this.isAdded = true;
    } else if (this.id && this.isAdded === true) {
      this.isAdded = false;
    }
    this.setButtonFunction();
  };

  private deleteFriendCallback = (): void => {
    if (this.id && this.isAdded === true) {
      RandomFriendCard.deleteFriend(this.id, this.testInfo);
      this.isAdded = false;
    } else if (this.id && this.isAdded === false) {
      this.isAdded = true;
    }
    this.setButtonFunction();
  };

  private setButtonFunction(): void {
    if (this.isAdded === false) {
      this.plusButton.replaceBtnSvg(SvgNames.Plus, 'suggested-friends', ProjectColors.Turquoise);
      this.plusButton.element.removeEventListener('click', this.deleteFriendCallback);
      this.plusButton.element.addEventListener('click', this.addFriendCallback);
    } else {
      this.plusButton.replaceBtnSvg(SvgNames.CloseThin, 'close-btn suggested-friends', ProjectColors.Orange);
      this.plusButton.element.removeEventListener('click', this.addFriendCallback);
      this.plusButton.element.addEventListener('click', this.deleteFriendCallback);
    }
  }

  private static addNewFriend(id: string, data: FriendId): Promise<void> {
    return addFriend(id, data);
  }

  private static deleteFriend(id: string, data: FriendId): Promise<void> {
    return deleteFriend(id, data);
  }

  private static getIdFromLocalStorage(): string | null {
    const id: string | null = checkDataInLocalStorage('myUserId');
    return id;
  }
}
