import './random-friend-card.css';
import BaseComponent from '../../../../components/base-component/base-component';
import SvgButton from '../../../../components/base-component/button/svg-btn';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../../utils/consts';
import Picture from '../../../../components/base-component/picture/picture';
import { checkDataInLocalStorage } from '../../../../utils/local-storage';
import { FriendId, Token } from '../../../../app/loader/loader-requests.types';
import { FriendData } from '../../../../app/loader/loader-responses.types';
import { addFriend, deleteFriend } from '../../../../app/loader/services/friends-services';
import eventEmitter from '../../../../utils/event-emitter';

export default class RandomFriendCard extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    secret: 'dashboard.rightMenu.randomFriend.secret',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

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
    this.user.country || this.dictionary.secret,
  );

  private isAdded: boolean = false;

  private requestInfo = {
    friendId: this.user.id,
  };

  constructor(private user: FriendData) {
    super('div', undefined, 'suggested-friends__friend');
    this.plusButton.appendSvg(SvgNames.Plus, 'suggested-friends', ProjectColors.Turquoise);
    this.plusButton.element.addEventListener('click', this.addFriendCallback);
  }

  private addFriendCallback = (): void => {
    if (this.token) {
      RandomFriendCard.addNewFriend(this.token, this.requestInfo);
      this.isAdded = true;
      eventEmitter.emit('friendAdded', {});
      this.setButtonFunction();
    }
  };

  private deleteFriendCallback = (): void => {
    if (this.token) {
      RandomFriendCard.deleteFriend(this.token, this.requestInfo);
      this.isAdded = false;
      eventEmitter.emit('friendDeleted', {});
      this.setButtonFunction();
    }
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

  private static addNewFriend(token: Token, data: FriendId): Promise<void> {
    return addFriend(token, data);
  }

  private static deleteFriend(token: Token, data: FriendId): Promise<void> {
    return deleteFriend(token, data);
  }
}
