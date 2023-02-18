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
      if (activity.kudos) {
        post.checkIfLikedPost(activity.kudos);
        post.updateLikesCounter(activity.kudos.length);
      }
      post.postId = activity.id;
      post.photo.element.src = data.avatarUrl;
      post.name.element.textContent = data.username;
      post.activityTitle.element.textContent = activity.title;
      post.date.element.textContent = `${new Date(activity.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })} at ${activity.time}`;
      post.distance.value = `${activity.distance} km`;
      post.speed.value = `${TrainingFeed.countSpeed(activity.duration, Number(activity.distance))} km/h`;
      post.time.value = `${TrainingFeed.changeTimeFormat(activity.duration)}`;
      post.elevation.value = `${activity.elevation} m`;
      post.activityIconSvg = new Svg(
        post.activityIcon.element,
        activity.sport,
        ProjectColors.Grey,
        'activity__icon-svg',
      );
      if (activity.route !== null) {
        post.initStaticMap(activity);
      }

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

  private static countSpeed(time: string, distance: number): string {
    const splittedTime: string[] = time.split(':');
    const [hours, minutes, seconds] = splittedTime;
    const totalTime: number = (+hours * 3600 + +minutes * 60 + +seconds) / 3600;
    return (distance / totalTime).toFixed(1);
  }

  private static changeTimeFormat(time: string): string {
    const splittedTime: string[] = time.split(':');
    const [hours, minutes] = splittedTime;
    return `${hours}h ${minutes}m`;
  }
}
