import './comment.css';
import BaseComponent from '../../../../../components/base-component/base-component';
import Svg from '../../../../../components/base-component/svg/svg';
import SvgNames from '../../../../../components/base-component/svg/svg.types';
import Picture from '../../../../../components/base-component/picture/picture';
import { ProjectColors } from '../../../../../utils/consts';
import { CommentResponse } from '../../../../../app/loader/loader-responses.types';
import { deleteComment, updateComment } from '../../../../../app/loader/services/comment-services';
import { UpdateComment } from '../../../../../app/loader/loader-requests.types';
import { checkDataInLocalStorage } from '../../../../../utils/local-storage';
import eventEmitter from '../../../../../utils/event-emitter';

export default class PostComment extends BaseComponent<'div'> {
  private photo = new Picture(this.element, 'comment__photo');

  private commentWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'comment__wrapper');

  private info = new BaseComponent('div', this.commentWrapper.element, 'comment__info');

  private name = new BaseComponent('h4', this.info.element, 'comment__name');

  public date = new BaseComponent('span', this.info.element, 'comment__date');

  private message = new BaseComponent('span', this.commentWrapper.element, 'comment__message');

  private iconsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.commentWrapper.element, 'comment__icons');

  private like = new BaseComponent('span', this.iconsWrapper.element);

  private likeSvg = new Svg(this.like.element, SvgNames.Heart, ProjectColors.Grey, 'comment__like');

  private userId: string | null = checkDataInLocalStorage('MyStriversId');

  public commentId: number = 0;

  private likesAll: string[] = [];

  private isLiked: boolean = false;

  public commentAuthorId: string = '';

  public createdAt: Date;

  public postAuthorId: string = '';

  constructor(data: CommentResponse, postAuthorId: string) {
    super('div', undefined, 'comment');
    this.createdAt = data.createdAt;
    this.postAuthorId = postAuthorId;
    this.retrieveDataForComment(data);
    this.like.element.addEventListener('click', this.toggleLike);
  }

  private retrieveDataForComment(data: CommentResponse): void {
    this.photo.element.src = data.avatarUrl;
    this.date.element.textContent = PostComment.createTimeSinceComment(data.createdAt);
    this.commentId = data.id;
    this.commentAuthorId = data.userId;
    this.name.element.textContent = data.username;
    this.message.element.textContent = data.body;
    if (data.likes && data.likes.length > 0) {
      this.likesAll = data.likes;
      this.checkIfLikedPost(this.likesAll);
    }
    this.renderSvgButtons();
  }

  private toggleLike = (): void => {
    this.isLiked = !this.isLiked;
    this.updateLikeInfoOnServer(this.isLiked);
    this.updateLikeColor();
  };

  private updateLikeColor(): void {
    if (!this.isLiked) {
      this.likeSvg.updateFillColor(ProjectColors.Grey);
    } else {
      this.likeSvg.updateFillColor(ProjectColors.Orange);
    }
  }

  private checkIfLikedPost(likes: string[]): void {
    if (this.userId) {
      this.isLiked = likes.includes(this.userId);
    }
    this.updateLikeColor();
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

  private updateLikeInfoOnServer(flag: boolean): void {
    if (this.userId) {
      const likeData: UpdateComment = {
        userId: this.userId,
        like: flag,
      };
      updateComment(this.commentId, likeData);
    }
  }

  private renderSvgButtons(): void {
    if (this.userId) {
      if (this.userId === this.commentAuthorId || this.userId === this.postAuthorId) {
        const deleteActivitySvg: Svg = new Svg(
          this.iconsWrapper.element,
          SvgNames.DeletePost,
          ProjectColors.Grey,
          'comment__delete-svg',
        );
        deleteActivitySvg.svg.addEventListener('click', this.deleteComment);
      }
    }
  }

  private deleteComment = (): void => {
    deleteComment(this.commentId).then(() => {
      this.element.remove();
      eventEmitter.emit('commentDeleted', { commentId: this.commentId });
    });
  };
}
