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

export default class Post extends BaseComponent<'div'> {
  private userInfo = new BaseComponent('div', this.element, 'post__user-info');

  private photo: BaseComponent<'img'> = new Picture(this.userInfo.element, 'post__photo');

  private userContainer = new BaseComponent('div', this.userInfo.element, 'post__user-info-container');

  private name = new BaseComponent('span', this.userContainer.element, 'post__name');

  private datePlaceContainer = new BaseComponent('div', this.userContainer.element, 'post__data-place');

  private date = new BaseComponent('span', this.datePlaceContainer.element);

  private place = new BaseComponent('span', this.datePlaceContainer.element);

  private edit = new BaseComponent('span', this.userInfo.element, 'post__edit');

  private activityContainer = new BaseComponent('div', this.element, 'post__activity-container');

  private activityIcon = new BaseComponent('span', this.activityContainer.element, 'post__activity-icon');

  private activityIconSvg: Svg | undefined;

  private activityTitle = new BaseComponent('h4', this.activityContainer.element, 'post__activity-title');

  private info = new BaseComponent('div', this.element, 'post__info');

  private distance = new PostInfo(this.info.element, 'Distance');

  private speed = new PostInfo(this.info.element, 'Speed');

  private time = new PostInfo(this.info.element, 'Time');

  private elevation = new PostInfo(this.info.element, 'Altitude');

  private map = new BaseComponent('div', this.element);

  private googleMap: GoogleMaps | undefined;

  private icons = new BaseComponent('div', this.element, 'post__icons');

  private likeIcon = new PostIcon(this.icons.element, SvgNames.CloseThin, 'black', 'post__like');

  private commentIcon = new PostIcon(this.icons.element, SvgNames.CloseThin, 'black', 'post__comment');

  private commentArea = new TextArea(this.element, 'post__add-comment', '', {
    maxlength: '200',
    placeholder: 'type something up to 200 characters',
  });

  private addCommentButton = new Button(this.commentArea.element, 'Comment', 'post__button');

  constructor(data: Activity) {
    super('div', undefined, 'post');
    this.deletePost();
    this.openComments();
    this.postComment();
    this.addLike();
    this.setContent(data);
    this.toggleAddCommentButtonState();
  }

  private setContent(data: Activity): void {
    this.photo.element.src = data.user.avatarUrl;
    this.name.element.textContent = data.user.username;
    this.activityTitle.element.textContent = data.title;
    this.date.element.textContent = `${data.date} at ${data.time}`;
    this.distance.value = `${data.distance} km`;
    this.speed.value = 'later';
    this.time.value = `${data.duration}`;
    this.elevation.value = `${data.elevation} m`;
    this.activityIconSvg = new Svg(this.activityIcon.element, data.sport, ProjectColors.Grey, 'activity__icon-svg');
    if (data.mapPoints) {
      this.googleMap = new GoogleMaps(
        this.map.element,
        '1',
        8,
        { lat: -33.397, lng: 150.644 },
        google.maps.TravelMode.BICYCLING,
      );
      // this.googleMap.doDirectionRequest(data.mapPoints.startPoint, data.mapPoints.endPoint);
    }
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
}
