import './post.css';
import BaseComponent from '../../../../components/base-component/base-component';
import { Activity } from '../../../../app/loader/loader.types';

export default class Post extends BaseComponent<'div'> {
  private userInfo = new BaseComponent('div', this.element, 'post__user-info');

  private photo: BaseComponent<'img'> = new BaseComponent('img', this.userInfo.element, 'post__photo');

  private userContainer = new BaseComponent('div', this.userInfo.element, 'post__user-info');

  private name = new BaseComponent('span', this.userContainer.element, 'post__name');

  private datePlaceContainer = new BaseComponent('div', this.userContainer.element, 'post__data-place');

  private date = new BaseComponent('span', this.datePlaceContainer.element);

  private place = new BaseComponent('span', this.datePlaceContainer.element);

  private edit = new BaseComponent('span', this.userInfo.element, 'post__edit');

  private activityContainer = new BaseComponent('div', this.element);

  private activityIcon = new BaseComponent('img', this.activityContainer.element, 'post__activity-icon');

  private activityTitle = new BaseComponent('h4', this.activityContainer.element, 'post__activity-title');

  constructor(data: Activity) {
    super('div', undefined, 'post');
    this.photo.element.src = data.user.avatarUrl;
    this.name.element.textContent = data.user.username;
    this.activityTitle.element.textContent = data.title;
  }
}
