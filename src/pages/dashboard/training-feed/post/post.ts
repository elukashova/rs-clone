/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './post.css';
import BaseComponent from '../../../../components/base-component/base-component';
import { Activity, Token, UpdateActivity } from '../../../../app/loader/loader.types';
import PostInfo from './post-info/post-info';
import PostIcon from './post-icon/post-icon';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import Svg from '../../../../components/base-component/svg/svg';
import TextArea from '../../../../components/base-component/textarea/textarea';
import Button from '../../../../components/base-component/button/button';
import Picture from '../../../../components/base-component/picture/picture';
import GoogleMaps from '../../../../map/google-maps';
import Comment from './comment/comment';
import COMMENT_DATA from '../../../../mock/comment.data';
import { ProjectColors } from '../../../../utils/consts';
import USER_DATA from '../../../../mock/user.data';
import { updateActivity } from '../../../../app/loader/services/activity-services';
import { checkDataInLocalStorage } from '../../../../utils/local-storage';

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

  public elevation = new PostInfo(this.dataContainer.element, 'Altitude');

  public map: BaseComponent<'div'> | undefined;

  public googleMap: BaseComponent<'img'> | undefined;

  private icons = new BaseComponent('div', this.element, 'post__icons');

  private likeIcon = new PostIcon(this.icons.element, SvgNames.Heart, ProjectColors.Turquoise, 'post__like');

  private commentIcon = new PostIcon(this.icons.element, SvgNames.Comment, ProjectColors.Turquoise, 'post__comment');

  private commentArea = new TextArea(this.element, 'post__add-comment', '', {
    maxlength: '200',
    placeholder: 'type something up to 200 characters',
  });

  private addCommentButton = new Button(this.commentArea.element, 'Comment', 'post__button');

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private userId: string | null = checkDataInLocalStorage('MyStriversId');

  public isLiked: boolean = false;

  public postId: number = 0;

  public likesCounter: number = 0;

  constructor() {
    super('div', undefined, 'post');
    this.deletePost();
    this.openComments();
    this.postComment();
    this.toggleAddCommentButtonState();
    this.likeIcon.icon.svg.addEventListener('click', this.addLike);
  }

  private openComments(): void {
    this.commentIcon.element.addEventListener('click', () => {
      this.addCommentButton.element.disabled = true;
      this.commentArea.element.classList.toggle('active');
    });
  }

  private postComment(): void {
    this.addCommentButton.element.addEventListener('click', () => {
      this.commentArea.element.classList.remove('active');
      COMMENT_DATA.body = this.commentArea.textValue;
      this.element.append(new Comment().element);
      this.commentArea.textValue = '';
    });
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
      Post.updatePost(this.postId, this.token, { kudos: this.isLiked }).catch(() => null);
    }
  };

  private deletePost(): void {
    this.edit.element.addEventListener('click', () => {
      this.element.remove();
    });
  }

  private toggleAddCommentButtonState(): void {
    this.commentArea.element.addEventListener('input', () => {
      if (this.commentArea.textValue) {
        this.addCommentButton.element.disabled = false;
      } else {
        this.addCommentButton.element.disabled = true;
      }
    });
  }

  // Метод вывода статичной карты
  public async initStaticMap(activity: Activity): Promise<void> {
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
      console.log(likes);
      this.updateLikeColor();
    }
  }

  public updateLikesCounter(number?: number): void {
    if (number) {
      this.likesCounter = number;
    }
    this.likeIcon.value = `${this.likesCounter}`;
  }

  private static updatePost(id: number, token: Token, data: UpdateActivity): Promise<void> {
    return updateActivity(id, data, token);
  }
}
