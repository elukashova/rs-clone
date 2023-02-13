import './random-friend-card.css';
import AvatarSources from '../../../../components/avatar-modal/avatar-modal.types';
import BaseComponent from '../../../../components/base-component/base-component';
import Image from '../../../../components/base-component/image/image';
import RandomFriend from './random-friend-card.types';
import SvgButton from '../../../../components/base-component/button/svg-btn';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../../utils/consts';

export default class RandomFriendCard extends BaseComponent<'div'> {
  private data: RandomFriend = {
    username: 'Name',
    avatar: AvatarSources.Avatar1,
    country: 'Country',
  };

  private plusButton: SvgButton = new SvgButton(this.element, '', 'suggested-friends__btn');

  private infoWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'suggested-friends__info');

  private avatar: Image = new Image(this.infoWrapper.element, 'suggested-friends__friend_photo', {
    src: this.data.avatar,
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
    this.data.username,
  );

  private country: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.detailsWrapper.element,
    'suggested-friends__info_country',
    this.data.country,
  );

  constructor(parent: HTMLElement) {
    super('div', parent, 'suggested-friends__friend');
    this.plusButton.appendSvg(SvgNames.Plus, 'suggested-friends', ProjectColors.Turquoise);
  }
}
