/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './post.css';
import BaseComponent from '../../../../components/base-component/base-component';
import { CreateCommentRequest, FriendId, Token, UpdateActivity } from '../../../../app/loader/loader-requests.types';
import { ActivityResponse, CommentResponse } from '../../../../app/loader/loader-responses.types';
import PostInfo from './post-info/post-info';
import PostIcon from './post-icon/post-icon';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import Svg from '../../../../components/base-component/svg/svg';
import TextArea from '../../../../components/base-component/textarea/textarea';
import Button from '../../../../components/base-component/button/button';
import Picture from '../../../../components/base-component/picture/picture';
import GoogleMaps from '../../../../map/google-maps';
import { ProjectColors } from '../../../../utils/consts';
import { deleteActivity, updateActivity } from '../../../../app/loader/services/activity-services';
import { checkDataInLocalStorage } from '../../../../utils/local-storage';
import { createComment } from '../../../../app/loader/services/comment-services';
import PostComment from './comment/comment';
import { deleteFriend } from '../../../../app/loader/services/friends-services';
import eventEmitter from '../../../../utils/event-emitter';

export default class Post extends BaseComponent<'div'> {
  private userInfo = new BaseComponent('div', this.element, 'post__user-info');

  public photo: BaseComponent<'img'> = new Picture(this.userInfo.element, 'post__photo');

  private userContainer = new BaseComponent('div', this.userInfo.element, 'post__user-info-container');

  public name = new BaseComponent('span', this.userContainer.element, 'post__name');

  private datePlaceContainer = new BaseComponent('div', this.userContainer.element, 'post__data-place');

  public date = new BaseComponent('span', this.datePlaceContainer.element);

  public place = new BaseComponent('span', this.datePlaceContainer.element);

  private edit = new BaseComponent('span', this.userInfo.element, 'post__edit');

  private activityContainer = new BaseComponent('div', this.element, 'post__activity-container');

  public activityIcon = new BaseComponent('span', this.activityContainer.element, 'post__activity-icon');

  public activityIconSvg: Svg | undefined;

  private info = new BaseComponent('div', this.activityContainer.element, 'post__info');

  public activityTitle = new BaseComponent('h4', this.info.element, 'post__activity-title');

  public dataContainer = new BaseComponent('div', this.info.element, 'post__data');

  public distance = new PostInfo(this.dataContainer.element, 'Distance');

  public speed = new PostInfo(this.dataContainer.element, 'Speed');

  public time = new PostInfo(this.dataContainer.element, 'Time');

  public elevation = new PostInfo(this.dataContainer.element, 'Elevation');

  public map: BaseComponent<'div'> | undefined;

  public googleMap: BaseComponent<'img'> | undefined;

  private icons = new BaseComponent('div', this.element, 'post__icons');

  private likeIcon = new PostIcon(this.icons.element, SvgNames.Like, ProjectColors.Turquoise, 'post__like');

  private commentIcon = new PostIcon(this.icons.element, SvgNames.Comment, ProjectColors.Turquoise, 'post__comment');

  private textAreaWrapper: BaseComponent<'div'> = new BaseComponent('div', undefined, 'post__add-comment-wrapper');

  public userImage: BaseComponent<'img'> = new Picture(this.textAreaWrapper.element, 'post__add-comment-user');

  private commentArea = new TextArea(this.textAreaWrapper.element, 'post__add-comment', '', {
    maxlength: '200',
    placeholder: 'type something up to 200 characters',
    autofocus: '',
  });

  private addCommentButton = new Button(this.textAreaWrapper.element, 'Comment', 'post__add-comment-button');

  private showAllCommentsElement: BaseComponent<'span'> = new BaseComponent(
    'span',
    undefined,
    'post__add-comment_show-more',
  );

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private userId: string | null = checkDataInLocalStorage('MyStriversId');

  public isLiked: boolean = false;

  private isReadyToComment: boolean = false;

  public postId: number = 0;

  public likesCounter: number = 0;

  public commentsAll: HTMLElement[] = [];

  public commentsOnPage: HTMLElement[] = [];

  public commentsLimitPerPost: number = 2;

  private isShown: boolean = false;

  private isFirstAppend: boolean = true;

  public postAuthorId: string = '';

  constructor() {
    super('div', undefined, 'post');
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.likeIcon.icon.svg.addEventListener('click', this.addLike);
    this.commentIcon.element.addEventListener('click', this.handleCommentArea);
    this.commentArea.element.addEventListener('input', this.handleCommentButton);
    this.addCommentButton.element.addEventListener('click', this.postComment);
  }

  private postComment = (): void => {
    this.handleCommentArea();
    const commentData: CreateCommentRequest = {
      activityId: this.postId,
      body: this.commentArea.textValue,
    };
    if (this.token) {
      createComment(this.token, commentData)
        .then((response: CommentResponse) => {
          const comment: PostComment = new PostComment(response);
          this.checkIfNotFirstComment(comment);
          this.icons.element.classList.add('comments-added');
          this.commentArea.textValue = '';
        })
        .catch(() => null);
    }
  };

  private checkIfNotFirstComment(comment: PostComment): void {
    if (this.commentsOnPage.length === 0) {
      this.element.append(comment.element);
    } else if (this.commentsOnPage.length === 1) {
      const [existingComment] = this.commentsOnPage;
      this.element.insertBefore(comment.element, existingComment);
    } else {
      if (this.commentsOnPage.length === this.commentsLimitPerPost) {
        this.handleShowAllElement();
      }
      const [commentToLeave, commentToRemove] = this.commentsOnPage;
      this.element.removeChild(commentToRemove);
      this.commentsOnPage.pop();
      this.element.insertBefore(comment.element, commentToLeave);
    }

    this.commentsOnPage.unshift(comment.element);
    this.commentsAll.unshift(comment.element);
    this.updateCommentsNumber(this.commentsAll.length);
  }

  private addLike = (): void => {
    if (!this.isLiked) {
      this.isLiked = true;
      this.likesCounter += 1;
    } else {
      this.isLiked = false;
      this.likesCounter -= 1;
    }
    this.updateLikesCounter();
    this.updateLikeColor();
    if (this.token) {
      updateActivity(this.postId, { kudos: this.isLiked }, this.token).catch(() => null);
    }
  };

  private handleCommentButton = (): void => {
    if (this.commentArea.textValue) {
      this.addCommentButton.element.disabled = false;
    } else {
      this.addCommentButton.element.disabled = true;
    }
  };

  // Метод вывода статичной карты
  public async initStaticMap(activity: ActivityResponse): Promise<void> {
    if (activity.route && activity.route.startPoint && activity.route.endPoint) {
      this.map = new BaseComponent('div', undefined, 'map');
      const startLat = +activity.route.startPoint.split(',')[0];
      const startLng = +activity.route.startPoint.split(',')[1];
      const endLat = +activity.route.endPoint.split(',')[0];
      const endLng = +activity.route.endPoint.split(',')[1];
      const url = await GoogleMaps.drawStaticMap(
        { lat: startLat, lng: startLng }, // надо будет заменить с сервера стартовую точку
        { lat: endLat, lng: endLng }, // надо будет заменить с сервера конечную точку
        activity.route.travelMode || 'walking', // надо будет заменить с сервера travelMode
      );
      this.googleMap = new BaseComponent('img', this.map.element, '', '', {
        src: `${url}`,
      });
      this.element.insertBefore(this.map.element, this.icons.element);
    }
  }

  private updateLikeColor(): void {
    if (this.isLiked === true) {
      this.likeIcon.icon.updateFillColor(ProjectColors.Orange);
    } else {
      this.likeIcon.icon.updateFillColor(ProjectColors.Turquoise);
    }
  }

  public checkIfLikedPost(likes: string[]): void {
    if (this.userId) {
      this.isLiked = likes.includes(this.userId);
      this.updateLikeColor();
    }
  }

  public updateLikesCounter(number?: number): void {
    if (number) {
      this.likesCounter = number;
    }
    this.likeIcon.value = `${this.likesCounter}`;
  }

  private handleCommentArea = (): void => {
    if (!this.isReadyToComment) {
      this.element.append(this.textAreaWrapper.element);
      this.addCommentButton.element.disabled = true;
      this.isReadyToComment = true;
    } else {
      this.element.removeChild(this.textAreaWrapper.element);
      this.isReadyToComment = false;
    }
  };

  public appendExistingComments(comments: CommentResponse[]): void {
    const sortedComments: CommentResponse[] = Post.sortCommentsByDate(comments);
    sortedComments.forEach((comment) => {
      const newComment: PostComment = new PostComment(comment);
      this.commentsAll.push(newComment.element);
    });

    if (sortedComments.length < this.commentsLimitPerPost) {
      const [comment] = this.commentsAll;
      this.element.append(comment);
      this.commentsOnPage.push(comment);
    } else {
      for (let i: number = 0; i < this.commentsLimitPerPost; i += 1) {
        this.element.append(this.commentsAll[i]);
        this.commentsOnPage.push(this.commentsAll[i]);
      }

      if (sortedComments.length > this.commentsLimitPerPost) {
        this.handleShowAllElement();
      }
    }

    this.icons.element.classList.add('comments-added');
  }

  private showAllComments = (): void => {
    const remainingComments: HTMLElement[] = this.commentsAll.filter(
      (comment) => !this.commentsOnPage.includes(comment),
    );
    remainingComments.forEach((comment) => this.element.append(comment));
    this.handleShowAllElement();
  };

  private handleShowAllElement(): void {
    if (!this.isFirstAppend) {
      this.element.removeChild(this.showAllCommentsElement.element);
    }

    if (!this.isShown) {
      this.updateCommentsNumber(this.commentsAll.length);
      this.showAllCommentsElement.element.addEventListener('click', this.showAllComments);
      this.showAllCommentsElement.element.removeEventListener('click', this.hideComments);
      this.isShown = true;
      this.isFirstAppend = false;
    } else {
      this.showAllCommentsElement.element.textContent = 'Show recent comments';
      this.showAllCommentsElement.element.addEventListener('click', this.hideComments);
      this.showAllCommentsElement.element.removeEventListener('click', this.showAllComments);
      this.isShown = false;
    }
    this.element.append(this.showAllCommentsElement.element);
  }

  private updateCommentsNumber(number: number): void {
    this.showAllCommentsElement.element.textContent = `See all ${number} comments`;
  }

  private hideComments = (): void => {
    const commentsToHide: HTMLElement[] = this.commentsAll.filter((comment) => !this.commentsOnPage.includes(comment));
    commentsToHide.forEach((comment) => this.element.removeChild(comment));
    this.handleShowAllElement();
  };

  public defineButtonBasenOnAuthor(): void {
    if (this.userId) {
      if (this.postAuthorId === this.userId) {
        const deleteActivitySvg: Svg = new Svg(
          this.edit.element,
          SvgNames.DeletePost,
          ProjectColors.Grey,
          'post__edit-svg',
        );
        deleteActivitySvg.svg.addEventListener('click', this.deletePostAndActivity);
      } else {
        const unfollowFriendSvg: Svg = new Svg(
          this.edit.element,
          SvgNames.Unfollow,
          ProjectColors.Grey,
          'post__edit-svg',
        );
        unfollowFriendSvg.svg.addEventListener('click', this.removeFriend);
      }
    }
  }

  private deletePostAndActivity = (): void => {
    deleteActivity(this.postId)
      .then(() => this.element.remove())
      .catch(() => null);
  };

  private removeFriend = (): void => {
    if (this.token) {
      const requestInfo: FriendId = {
        friendId: this.postAuthorId,
      };
      deleteFriend(this.token, requestInfo).then(() => {
        eventEmitter.emit('friendDeleted', { friendId: this.postAuthorId });
      });
    }
  };

  private static sortCommentsByDate(comments: CommentResponse[]): CommentResponse[] {
    const commentsToSort: CommentResponse[] = [...comments];
    return commentsToSort.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
