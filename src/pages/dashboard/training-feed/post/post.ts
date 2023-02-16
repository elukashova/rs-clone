/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './post.css';
import BaseComponent from '../../../../components/base-component/base-component';
import { Activity } from '../../../../app/loader/loader.types';
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

  public activityTitle = new BaseComponent('h4', this.activityContainer.element, 'post__activity-title');

  private info = new BaseComponent('div', this.element, 'post__info');

  public distance = new PostInfo(this.info.element, 'Distance');

  public speed = new PostInfo(this.info.element, 'Speed');

  public time = new PostInfo(this.info.element, 'Time');

  public elevation = new PostInfo(this.info.element, 'Altitude');

  public map = new BaseComponent('div', this.element, 'map');

  public googleMap: BaseComponent<'img'> | undefined;

  private icons = new BaseComponent('div', this.element, 'post__icons');

  private likeIcon = new PostIcon(this.icons.element, SvgNames.CloseThin, 'black', 'post__like');

  private commentIcon = new PostIcon(this.icons.element, SvgNames.CloseThin, 'black', 'post__comment');

  private commentArea = new TextArea(this.element, 'post__add-comment', '', {
    maxlength: '200',
    placeholder: 'type something up to 200 characters',
  });

  private addCommentButton = new Button(this.commentArea.element, 'Comment', 'post__button');

  constructor() {
    super('div', undefined, 'post');
    this.deletePost();
    this.openComments();
    this.postComment();
    this.addLike();
    this.toggleAddCommentButtonState();
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

  private addLike(): void {
    let flag: boolean = false;
    this.likeIcon.element.addEventListener('click', () => {
      if (!flag) {
        this.likeIcon.value = (+this.likeIcon.value + 1).toString();
        this.likeIcon.icon?.updateFillColor(ProjectColors.Orange);
        flag = true;
      } else {
        this.likeIcon.value = (+this.likeIcon.value - 1).toString();
        this.likeIcon.icon?.updateFillColor(ProjectColors.Grey);
        flag = false;
      }
    });
  }

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
    }
  }
}
