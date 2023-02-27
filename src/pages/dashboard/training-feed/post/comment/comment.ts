import './comment.css';
import i18next from 'i18next';
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
import Button from '../../../../../components/base-component/button/button';

export default class PostComment extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    commentBtn: 'dashboard.trainingFeed.post.commentBtn',
    year: 'other.comment.year',
    month: 'other.comment.month',
    day: 'other.comment.day',
    hour: 'other.comment.hour',
    minute: 'other.comment.minute',
    second: 'other.comment.second',
    now: 'other.comment.now',
  };

  private photo = new Picture(this.element, 'comment__photo', { alt: 'photo' });

  private commentWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'comment__wrapper');

  private info = new BaseComponent('div', this.commentWrapper.element, 'comment__info');

  private name = new BaseComponent('h4', this.info.element, 'comment__name');

  public date = new BaseComponent('span', this.info.element, 'comment__date');

  private textWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.commentWrapper.element,
    'comment__text-wrapper',
  );

  private message: BaseComponent<'textarea'> = new BaseComponent(
    'textarea',
    this.textWrapper.element,
    'comment__message',
    '',
    {
      maxlength: '200',
      disabled: '',
    },
  );

  private iconsWrapper: BaseComponent<'div'> = new BaseComponent('div', this.commentWrapper.element, 'comment__icons');

  private like = new BaseComponent('span', this.iconsWrapper.element);

  private editingIconsWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.iconsWrapper.element,
    'comment__icons-editing',
  );

  private likeSvg = new Svg(this.like.element, SvgNames.Heart, ProjectColors.Grey, 'comment__like');

  private commentButton: Button | undefined;

  private editCommentSvg: Svg | undefined;

  private cancelEditSvg: Svg | undefined;

  private userId: string | null = checkDataInLocalStorage('MyStriversId');

  public commentId: number = 0;

  private likesAll: string[] = [];

  private isLiked: boolean = false;

  public commentAuthorId: string = '';

  public createdAt: Date;

  public postAuthorId: string = '';

  public isUpdate: boolean = false;

  private currentCommentText: string = '';

  constructor(data: CommentResponse, postAuthorId: string) {
    super('div', undefined, 'comment');
    this.createdAt = data.createdAt;
    this.postAuthorId = postAuthorId;
    this.retrieveDataForComment(data);
    this.like.element.addEventListener('click', this.toggleLike);
    this.message.element.addEventListener('keydown', this.changeDefaultBehavior);
    i18next.on('languageChanged', () => {
      this.date.element.textContent = this.createTimeSinceComment(data.createdAt);
    });
  }

  private retrieveDataForComment(data: CommentResponse): void {
    this.photo.element.src = data.avatarUrl;
    this.date.element.textContent = this.createTimeSinceComment(data.createdAt);
    this.commentId = data.id;
    this.commentAuthorId = data.userId;
    this.name.element.textContent = data.username;
    this.message.element.textContent = data.body;
    this.currentCommentText = data.body;
    if (data.likes && data.likes.length > 0) {
      this.likesAll = data.likes;
      this.checkIfLikedPost(this.likesAll);
    }
    this.renderDeleteButton();
    this.renderEditButton();
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

  private createTimeSinceComment(commentDate: Date): string {
    const intervals = [
      { text: this.dictionary.year, seconds: 31536000 },
      { text: this.dictionary.month, seconds: 2592000 },
      { text: this.dictionary.day, seconds: 86400 },
      { text: this.dictionary.hour, seconds: 3600 },
      { text: this.dictionary.minute, seconds: 60 },
      { text: this.dictionary.second, seconds: 1 },
    ];

    const date: Date = new Date(commentDate);

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const interval = intervals.find((int) => int.seconds < seconds);
    if (interval) {
      const count = Math.floor(seconds / interval.seconds);
      return i18next.t(interval.text, { count });
    }
    return i18next.t(this.dictionary.now);
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

  private renderDeleteButton(): void {
    if (this.userId) {
      if (this.userId === this.commentAuthorId || this.userId === this.postAuthorId) {
        const deleteCommentSvg: Svg = new Svg(
          this.editingIconsWrapper.element,
          SvgNames.DeletePost,
          ProjectColors.Grey,
          'comment__delete-svg',
        );
        deleteCommentSvg.svg.addEventListener('click', this.deleteComment);
      }
    }
  }

  private deleteComment = (): void => {
    deleteComment(this.commentId).then(() => {
      this.element.remove();
      eventEmitter.emit('commentDeleted', { commentId: this.commentId });
    });
  };

  private renderEditButton(): void {
    if (this.userId && this.userId === this.commentAuthorId) {
      this.editCommentSvg = new Svg(
        this.editingIconsWrapper.element,
        SvgNames.Edit,
        ProjectColors.Grey,
        'comment__edit-svg',
      );
      this.editCommentSvg.svg.addEventListener('click', this.activateTextarea);
    }
  }

  private activateTextarea = (): void => {
    this.message.element.removeAttribute('disabled');
    this.message.element.focus();
    this.message.element.classList.add('active-comment');
    this.message.element.selectionStart = this.message.element.value.length;

    this.renderCommentButton();
    this.message.element.addEventListener('input', this.handleCommentButton);

    if (this.editCommentSvg) {
      this.editCommentSvg.svg.removeEventListener('click', this.activateTextarea);
      this.editingIconsWrapper.element.removeChild(this.editCommentSvg.svg);
      this.cancelEditSvg = new Svg(
        this.editingIconsWrapper.element,
        SvgNames.CloseThin,
        ProjectColors.Grey,
        'comment__edit-svg',
      );
      this.cancelEditSvg.svg.addEventListener('click', this.cancelUpdate);
    }
  };

  private cancelUpdate = (): void => {
    this.message.element.value = this.currentCommentText;
    this.removeCommentButton();
    this.resetCommentArea();
  };

  private changeDefaultBehavior = (e: KeyboardEvent): void => {
    if (e.code === 'Enter') {
      e.preventDefault();
      this.updateComment();
    }
  };

  private renderCommentButton(): void {
    this.commentButton = new Button(this.textWrapper.element, this.dictionary.commentBtn, 'comment__comment-button');
    this.commentButton.element.addEventListener('click', this.updateComment);
  }

  private handleCommentButton = (): void => {
    if (this.message.element.value.length === 0) {
      if (this.commentButton) {
        this.commentButton.element.disabled = true;
      }
    } else if (this.commentButton) {
      this.commentButton.element.disabled = false;
    }
  };

  private updateComment = (): void => {
    this.currentCommentText = this.message.element.value;
    const dataForUpdate: UpdateComment = {
      body: this.message.element.value,
    };
    updateComment(this.commentId, dataForUpdate).then(() => {
      this.removeCommentButton();
      this.resetCommentArea();
    });
  };

  private resetCommentArea(): void {
    this.message.element.setAttribute('disabled', '');
    this.message.element.classList.remove('active-comment');
    if (this.cancelEditSvg) {
      this.cancelEditSvg.svg.removeEventListener('click', this.cancelUpdate);
      this.editingIconsWrapper.element.removeChild(this.cancelEditSvg.svg);
      this.editCommentSvg = new Svg(
        this.editingIconsWrapper.element,
        SvgNames.Edit,
        ProjectColors.Grey,
        'comment__edit-svg',
      );
      this.editCommentSvg.svg.addEventListener('click', this.activateTextarea);
    }
  }

  private removeCommentButton(): void {
    if (this.commentButton) {
      this.commentButton.element.removeEventListener('click', this.updateComment);
      this.textWrapper.element.removeChild(this.commentButton.element);
    }
  }
}
