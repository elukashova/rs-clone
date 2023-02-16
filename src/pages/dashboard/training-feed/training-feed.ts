import './training-feed.css';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import Routes from '../../../app/router/router.types';
import NavigationLink from '../../../components/base-component/link/link';
import { User } from '../../../app/loader/loader.types';
import Post from './post/post';
import { ProjectColors } from '../../../utils/consts';
import Svg from '../../../components/base-component/svg/svg';

export default class TrainingFeed extends BaseComponent<'article'> {
  public message = new BaseComponent('span', undefined, 'training-feed__message', 'Лента пока пуста, Вы можете');

  public addTrainingButton: Button | undefined;

  public findFriendsButton: NavigationLink | undefined;

  private buttonContainer: BaseComponent<'div'> | undefined;

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('article', parent, 'training-feed');
  }

  public static addPosts(data: User): HTMLDivElement[] {
    const posts: HTMLDivElement[] = [];
    data.activities.forEach((activity) => {
      const post: Post = new Post();
      post.photo.element.src = data.avatarUrl;
      post.name.element.textContent = data.username;
      post.activityTitle.element.textContent = activity.title;
      post.date.element.textContent = `${new Date(activity.date).toDateString()} at ${activity.time}`;
      post.distance.value = `${activity.distance} km`;
      post.speed.value = '0';
      post.time.value = `${activity.duration}`;
      post.elevation.value = `${activity.elevation} m`;
      post.initStaticMap(activity);
      post.activityIconSvg = new Svg(
        post.activityIcon.element,
        activity.sport,
        ProjectColors.Grey,
        'activity__icon-svg',
      );
      posts.unshift(post.element);
    });
    return posts;
  }

  public showGreetingMessage(): void {
    this.element.append(this.message.element);
    this.buttonContainer = new BaseComponent('div', this.element, 'training-feed__buttons');
    this.addTrainingButton = new Button(this.buttonContainer.element, 'Add Activity', 'btn_main');
    this.findFriendsButton = new NavigationLink(this.replaceMainCallback, {
      text: 'Find friends',
      parent: this.buttonContainer.element,
      additionalClasses: 'btn btn_main training-feed__button',
      attributes: { href: Routes.FindFriends },
    });
  }

  public deleteGreetingMessage(): void {
    this.message.element.remove();
    this.addTrainingButton?.element.remove();
    this.findFriendsButton?.element.remove();
  }
}
