/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './post.css';
import BaseComponent from '../../../../components/base-component/base-component';
import { CreateCommentRequest, FriendId, Token, UpdateActivity } from '../../../../app/loader/loader-requests.types';
import { ActivityResponse, CommentResponse, Kudo, User } from '../../../../app/loader/loader-responses.types';
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
import PostReactions from './post-reactions/post-reactions';
import { EventData } from '../../../../utils/event-emitter.types';

export default class Post extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    distance: 'dashboard.trainingFeed.post.distance',
    speed: 'dashboard.trainingFeed.post.speed',
    time: 'dashboard.trainingFeed.post.time',
    elevation: 'dashboard.trainingFeed.post.elevation',
    commentPlaceholder: 'dashboard.trainingFeed.post.commentPlaceholder',
    commentBtn: 'dashboard.trainingFeed.post.commentBtn',
  };

  private userInfo = new BaseComponent('div', this.element, 'post__user-info');

  public photo: BaseComponent<'img'> = new Picture(this.userInfo.element, 'post__photo');

  private userContainer = new BaseComponent('div', this.userInfo.element, 'post__user-info-container');

  public name = new BaseComponent('span', this.userContainer.element, 'post__name');

  private datePlaceContainer = new BaseComponent('div', this.userContainer.element, 'post__data-place');

  public date = new BaseComponent('span', this.datePlaceContainer.element);

  public place = new BaseComponent('span', this.datePlaceContainer.element);

  private activityContainer = new BaseComponent('div', this.element, 'post__activity-container');

  public activityIcon = new BaseComponent('span', this.activityContainer.element, 'post__activity-icon');

  public activityIconSvg: Svg | undefined;

  private info = new BaseComponent('div', this.activityContainer.element, 'post__info');

  public activityTitle = new BaseComponent('h4', this.info.element, 'post__activity-title');

  public dataContainer = new BaseComponent('div', this.info.element, 'post__data');

  public distance = new PostInfo(this.dataContainer.element, this.dictionary.distance);

  public speed = new PostInfo(this.dataContainer.element, this.dictionary.speed);

  public time = new PostInfo(this.dataContainer.element, this.dictionary.time);

  public elevation = new PostInfo(this.dataContainer.element, this.dictionary.elevation);

  public map: BaseComponent<'div'> | undefined;

  public googleMap: BaseComponent<'img'> | undefined;

  private reactions: PostReactions = new PostReactions(this.element);

  private textAreaWrapper: BaseComponent<'div'> = new BaseComponent('div', undefined, 'post__add-comment-wrapper');

  public userCommentAvatar: BaseComponent<'img'> = new Picture(this.textAreaWrapper.element, 'post__add-comment-user');

  private commentArea = new TextArea(this.textAreaWrapper.element, 'post__add-comment', '', {
    maxlength: '200',
    placeholder: this.dictionary.commentPlaceholder,
    autofocus: '',
  });

  private addCommentButton = new Button(
    this.textAreaWrapper.element,
    this.dictionary.commentBtn,
    'post__add-comment-button',
  );

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

  public commentsAll: PostComment[] = [];

  public commentsOnPage: PostComment[] = [];

  public commentsLimitPerPost: number = 2;

  private isShown: boolean = false;

  private isFirstAppend: boolean = true;

  public postAuthorId: string = '';

  constructor() {
    super('div', undefined, 'post');
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.reactions.like.svg.addEventListener('click', this.addLike);
    this.reactions.comment.svg.addEventListener('click', this.handleCommentArea);
    this.commentArea.element.addEventListener('input', this.handleCommentButton);
    this.addCommentButton.element.addEventListener('click', this.postComment);
    eventEmitter.on('commentDeleted', (data: EventData) => this.updateCommentsAfterDeletion(data));
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
          this.reactions.element.classList.add('comments-added');
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
      this.element.insertBefore(comment.element, existingComment.element);
    } else {
      if (this.commentsOnPage.length === this.commentsLimitPerPost) {
        this.handleShowAllElement();
      }
      const [commentToLeave, commentToRemove] = this.commentsOnPage;
      this.element.removeChild(commentToRemove.element);
      this.commentsOnPage.pop();
      this.element.insertBefore(comment.element, commentToLeave.element);
    }

    this.commentsOnPage.unshift(comment);
    this.commentsAll.unshift(comment);
    this.updateCommentsNumber(this.commentsAll.length);
  }

  private addLike = (e: Event): void => {
    if (!this.isLiked) {
      this.isLiked = true;
      this.reactions.likesCounter += 1;
    } else {
      this.isLiked = false;
      this.reactions.likesCounter -= 1;
    }
    this.updateLikesCounter([], this.userCommentAvatar.element.src);
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
        { lat: startLat, lng: startLng },
        { lat: endLat, lng: endLng },
        activity.route.travelMode || 'walking',
      );
      this.googleMap = new BaseComponent('img', this.map.element, '', '', {
        src: `${url}`,
      });
      this.element.insertBefore(this.map.element, this.reactions.element);
    }
  }

  private updateLikeColor(): void {
    if (this.isLiked === true) {
      this.reactions.like.updateFillColor(ProjectColors.Yellow);
    } else {
      this.reactions.like.updateFillColor(ProjectColors.LightTurquoise);
    }
  }

  public checkIfLikedPost(likes: Kudo[]): void {
    if (this.userId) {
      const filteredLikes = likes.filter((like) => like.userId === this.userId);
      if (filteredLikes.length > 0) {
        this.isLiked = true;
      } else {
        this.isLiked = false;
      }
      this.updateLikeColor();
    }
  }

  public updateLikesCounter(likes?: Kudo[], avatarSrc?: string): void {
    if (likes && likes.length > 0) {
      this.reactions.kudos = likes.slice();
      this.reactions.likesCounter = likes.length;
      this.reactions.renderUsersAvatars();
    } else if (avatarSrc) {
      this.reactions.updateAvatarsForKudos(avatarSrc, this.isLiked);
    }
    this.reactions.updateLikesNumber();
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
    comments.forEach((comment) => {
      const newComment: PostComment = new PostComment(comment);
      this.commentsAll.push(newComment);
    });

    const sortedComments: PostComment[] = Post.sortCommentsByDate(this.commentsAll);

    if (sortedComments.length < this.commentsLimitPerPost) {
      const [comment] = sortedComments;
      this.element.append(comment.element);
      this.commentsOnPage.push(comment);
    } else {
      for (let i: number = 0; i < this.commentsLimitPerPost; i += 1) {
        this.element.append(sortedComments[i].element);
        this.commentsOnPage.push(sortedComments[i]);
      }

      if (sortedComments.length > this.commentsLimitPerPost) {
        this.handleShowAllElement();
      }
    }

    this.reactions.element.classList.add('comments-added');
  }

  private showAllComments = (): void => {
    const remainingComments: PostComment[] = this.commentsAll.filter(
      (comment) => !this.commentsOnPage.includes(comment),
    );
    remainingComments.forEach((comment) => this.element.append(comment.element));
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
      this.showAllCommentsElement.textContent = 'Show recent comments';
      this.showAllCommentsElement.element.addEventListener('click', this.hideComments);
      this.showAllCommentsElement.element.removeEventListener('click', this.showAllComments);
      this.isShown = false;
    }
    this.element.append(this.showAllCommentsElement.element);
  }

  private updateCommentsNumber(number: number): void {
    this.showAllCommentsElement.textContent = `See all ${number} comments`;
  }

  private hideComments = (): void => {
    const commentsToHide: PostComment[] = this.commentsAll.filter((comment) => !this.commentsOnPage.includes(comment));
    commentsToHide.forEach((comment) => this.element.removeChild(comment.element));
    this.handleShowAllElement();
  };

  public defineButtonBasenOnAuthor(): void {
    if (this.userId) {
      if (this.postAuthorId === this.userId) {
        const deleteActivitySvg: Svg = new Svg(
          this.userInfo.element,
          SvgNames.DeletePost,
          ProjectColors.Grey,
          'post__edit-svg',
        );
        deleteActivitySvg.svg.addEventListener('click', this.deletePostAndActivity);
      } else {
        const unfollowFriendSvg: Svg = new Svg(
          this.userInfo.element,
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

  private static sortCommentsByDate(comments: PostComment[]): PostComment[] {
    const commentsToSort: PostComment[] = [...comments];
    return commentsToSort.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private updateCommentsAfterDeletion(data: EventData): void {
    const isOwnComment: PostComment[] = this.commentsAll.filter((comment) => comment.commentId === data.commentId);
    if (isOwnComment.length !== 0) {
      const [comment] = isOwnComment;
      this.updateCommentsArraysAfterDeletion(comment);

      if (this.commentsAll.length === 0) {
        this.reactions.element.classList.remove('comments-added');
      }

      if (this.commentsAll.length >= 2) {
        this.commentsOnPage.forEach((remainedComment) => this.element.removeChild(remainedComment.element));
        const filteredComment: PostComment[] = this.commentsAll.filter(
          (existingComment) => !this.commentsOnPage.includes(existingComment),
        );

        const [commentToAppend] = filteredComment;
        this.commentsOnPage.push(commentToAppend);

        const sortedComments = Post.sortCommentsByDate(this.commentsOnPage);
        sortedComments.forEach((sortedComment) => this.element.append(sortedComment.element));

        this.updateCommentsCounterAfterDeletion();
      }
    }
  }

  private updateCommentsArraysAfterDeletion(comment: PostComment): void {
    const indexOne: number = this.commentsOnPage.indexOf(comment);
    this.commentsOnPage.splice(indexOne, 1);

    const indexTwo: number = this.commentsAll.indexOf(comment);
    this.commentsAll.splice(indexTwo, 1);
  }

  private updateCommentsCounterAfterDeletion(): void {
    if (this.commentsAll.length >= 2) {
      this.element.removeChild(this.showAllCommentsElement.element);
    }

    if (this.commentsAll.length > 2) {
      this.updateCommentsNumber(this.commentsAll.length);
      this.element.appendChild(this.showAllCommentsElement.element);
    }
  }
}
