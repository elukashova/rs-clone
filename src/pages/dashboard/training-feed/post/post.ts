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

export default class Post extends BaseComponent<'div'> {
  private userInfo = new BaseComponent('div', this.element, 'post__user-info');

  private photo: BaseComponent<'img'> = new BaseComponent('img', this.userInfo.element, 'post__photo');

  private userContainer = new BaseComponent('div', this.userInfo.element, 'post__user-info');

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

  private distance = new PostInfo(this.info.element, 'Дистанция');

  private speed = new PostInfo(this.info.element, 'Темп');

  private time = new PostInfo(this.info.element, 'Темп');

  private map = new BaseComponent('div', this.element);

  private icons = new BaseComponent('div', this.element, 'post__icons');

  private likeIcon = new PostIcon(this.icons.element, SvgNames.CloseThin, 'grey', 'post__like');

  private commentIcon = new PostIcon(this.icons.element, SvgNames.CloseThin, 'grey', 'post__comment');

  private addComment = new TextArea(this.element, 'post__add-comment', '', {});

  private addCommentButton = new Button(this.addComment.element, 'Добавить комментарий', 'post__button');

  constructor(data: Activity) {
    super('div', undefined, 'post');
    this.photo.element.src = data.user.avatarUrl;
    this.name.element.textContent = data.user.username;
    this.activityTitle.element.textContent = data.title;
    this.openComments();
    this.postComment();
    this.addLike();
  }

  private openComments(): void {
    this.commentIcon.element.addEventListener('click', () => {
      this.addComment.element.classList.toggle('active');
    });
  }

  private postComment(): void {
    this.addCommentButton.element.addEventListener('click', () => {
      this.addComment.element.classList.remove('active');
    });
  }

  private addLike(): void {
    let flag = false;
    this.likeIcon.element.addEventListener('click', () => {
      if (!flag) {
        this.likeIcon.value = (+this.likeIcon.value + 1).toString();
        flag = true;
      } else {
        this.likeIcon.value = (+this.likeIcon.value - 1).toString();
        flag = false;
      }
    });
  }
}
