import './comment.css';
import BaseComponent from '../../../../../components/base-component/base-component';
import Svg from '../../../../../components/base-component/svg/svg';
import SvgNames from '../../../../../components/base-component/svg/svg.types';
import Picture from '../../../../../components/base-component/picture/picture';
import { ProjectColors } from '../../../../../utils/consts';
import { CommentResponse } from '../../../../../app/loader/loader-responses.types';

export default class PostComment extends BaseComponent<'div'> {
  private photo = new Picture(this.element, 'comment__photo');

  private commentWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'comment__wrapper');

  private info = new BaseComponent('div', this.commentWrapper.element, 'comment__info');

  private name = new BaseComponent('h4', this.info.element, 'comment__name');

  private date = new BaseComponent('span', this.info.element, 'comment__date');

  private message = new BaseComponent('span', this.commentWrapper.element, 'comment__message');

  private iconsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.commentWrapper.element, 'comment__icons');

  private like = new BaseComponent('span', this.iconsWrapper.element);

  private likeSvg = new Svg(this.like.element, SvgNames.Heart, ProjectColors.Turquoise, 'comment__like');

  private userId: string;

  constructor(data: CommentResponse) {
    super('div', undefined, 'comment');
    this.photo.element.src = data.avatarUrl;
    this.date.element.textContent = PostComment.createTimeSinceComment(data.createdAt);
    this.userId = data.userId;
    this.name.element.textContent = data.username;
    this.message.element.textContent = data.body;
    this.toggleLike();
  }

  private toggleLike(): void {
    let flag: boolean = false;
    this.like.element.addEventListener('click', () => {
      if (!flag) {
        this.likeSvg.updateFillColor(ProjectColors.Orange);
        flag = true;
      } else {
        this.likeSvg.updateFillColor(ProjectColors.Grey);
        flag = false;
      }
    });
  }

  private static createTimeSinceComment(commentDate: Date): string {
    const intervals = [
      { text: 'year', seconds: 31536000 },
      { text: 'month', seconds: 2592000 },
      { text: 'day', seconds: 86400 },
      { text: 'hour', seconds: 3600 },
      { text: 'minute', seconds: 60 },
      { text: 'second', seconds: 1 },
    ];

    const date: Date = new Date(commentDate);

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const interval = intervals.find((int) => int.seconds < seconds);
    if (interval) {
      const count = Math.floor(seconds / interval.seconds);
      return `${count} ${interval.text}${count !== 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  }
}
