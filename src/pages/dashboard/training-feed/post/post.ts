import './post.css';
import BaseComponent from '../../../../components/base-component/base-component';

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

  private activityIcon = new BaseComponent('span', this.activityContainer.element, 'post__activity-icon');

  private activityName = new BaseComponent('h4', this.activityContainer.element, 'post__activity-name');

  constructor(name: string) {
    super('div', undefined, 'post');
    this.name.element.textContent = name;
  }
}
