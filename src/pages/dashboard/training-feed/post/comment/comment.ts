import './comment.css';
import BaseComponent from '../../../../../components/base-component/base-component';
import Image from '../../../../../components/base-component/image/image';
import Svg from '../../../../../components/base-component/svg/svg';
import SvgNames from '../../../../../components/base-component/svg/svg.types';
import COMMENT_DATA from '../../../../../mock/comment.data';

export default class Comment extends BaseComponent<'div'> {
  private info = new BaseComponent('div', this.element, 'comment__info');

  private photo = new Image(this.info.element, 'comment__photo');

  private name = new BaseComponent('h4', this.info.element, 'comment__name');

  private date = new BaseComponent('span', this.info.element, 'comment__date');

  private message = new BaseComponent('span', this.element, 'comment__message');

  private like = new BaseComponent('span', this.element);

  private likeSvg = new Svg(this.like.element, SvgNames.Star, 'grey', 'comment__like');

  constructor() {
    super('div', undefined, 'comment');
    const date: Date = new Date();
    this.date.element.textContent = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
    this.photo.element.src = COMMENT_DATA.user.avatarUrl;
    this.name.element.textContent = COMMENT_DATA.user.username;
    this.message.element.textContent = COMMENT_DATA.body;
    this.toggleLike();
  }

  private toggleLike(): void {
    let flag: boolean = false;
    this.like.element.addEventListener('click', () => {
      if (!flag) {
        this.likeSvg.updateFillColor('red');
        flag = true;
      } else {
        this.likeSvg.updateFillColor('grey');
        flag = false;
      }
    });
  }
}
