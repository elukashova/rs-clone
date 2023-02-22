import './training-feed.css';
import BaseComponent from '../../../components/base-component/base-component';
import Button from '../../../components/base-component/button/button';
import Routes from '../../../app/router/router.types';
import Post from './post/post';
import { ProjectColors } from '../../../utils/consts';
import Svg from '../../../components/base-component/svg/svg';
import { sortActivitiesByDate } from '../../../utils/utils';
import eventEmitter from '../../../utils/event-emitter';
import { EventData } from '../../../utils/event-emitter.types';
import { ActivityResponse, User } from '../../../app/loader/loader-responses.types';

export default class TrainingFeed extends BaseComponent<'article'> {
  private dictionary: Record<string, string> = {
    message: 'dashboard.trainingFeed.message',
    addActivity: 'dashboard.trainingFeed.addActivity',
    findFriends: 'dashboard.trainingFeed.findFriends',
  };

  public message = new BaseComponent('span', undefined, 'training-feed__message', this.dictionary.message);

  public addTrainingButton: Button | undefined;

  public findFriendsButton: Button | undefined;

  private buttonContainer: BaseComponent<'div'> | undefined;

  private posts: Post[] = [];

  private currentUser: Pick<User, 'username' | 'avatarUrl' | 'id'> = {
    username: '',
    avatarUrl: '',
    id: '',
  };

  // eslint-disable-next-line max-len
  constructor(parent: HTMLElement, private replaceMainCallback: () => void, user: User, postData: ActivityResponse[]) {
    super('article', parent, 'training-feed');
    this.currentUser.username = user.username;
    this.currentUser.avatarUrl = user.avatarUrl;
    this.currentUser.id = user.id;

    this.posts = this.addPosts(postData);
    if (this.posts.length) {
      this.deleteGreetingMessage();
      this.posts.forEach((post) => this.element.append(post.element));
    } else {
      this.showGreetingMessage();
    }

    this.subscribeToEvents();
  }

  public addPosts(data: ActivityResponse[]): Post[] {
    const posts: Post[] = [];
    const sortedActivities = sortActivitiesByDate(data);
    sortedActivities.forEach((activity) => {
      const post: Post = new Post(activity.userId);
      if (activity.kudos && activity.kudos.length > 0) {
        post.checkIfLikedPost(activity.kudos);
        post.updateLikesCounter(activity.kudos);
      }

      if (activity.comments && activity.comments.length > 0) {
        post.appendExistingComments(activity.comments);
      }
      post.postId = activity.id;
      post.photo.element.src = activity.avatarUrl;
      post.userCommentAvatar.element.src = this.currentUser.avatarUrl;
      post.name.element.textContent = activity.username;
      post.defineButtonBasenOnAuthor();
      post.activityTitle.element.textContent = activity.title;
      post.activityDescription.element.textContent = activity.description || '';
      post.date.element.textContent = TrainingFeed.changeDateFormat(activity.date, activity.time);
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
      posts.unshift(post);
    });
    return posts;
  }

  public showGreetingMessage(): void {
    this.element.append(this.message.element);
    this.buttonContainer = new BaseComponent('div', this.element, 'training-feed__buttons');
    this.addTrainingButton = new Button(this.buttonContainer.element, this.dictionary.addActivity, 'btn_main');
    this.findFriendsButton = new Button(this.buttonContainer.element, this.dictionary.findFriends, 'btn_main');

    this.addTrainingButton.element.addEventListener('click', () => {
      window.history.pushState({}, '', Routes.AddActivity);
      this.replaceMainCallback();
    });

    this.findFriendsButton?.element.addEventListener('click', () => {
      window.history.pushState({}, '', Routes.FindFriends);
      this.replaceMainCallback();
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

  private static changeDateFormat(dateString: string, time: string): string {
    return `${new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} at ${time}`;
  }

  private subscribeToEvents(): void {
    eventEmitter.on('friendDeleted', (data: EventData) => this.removeAllFriendPosts(data));
    eventEmitter.on('updateAvatar', (data: EventData) => this.updateAvatarAfterChanging(data));
  }

  private removeAllFriendPosts(data: EventData): void {
    this.posts.forEach((post) => {
      if (post.postAuthorId === data.friendId) {
        this.element.removeChild(post.element);
        this.posts = this.posts.filter((singlePost) => !singlePost.postAuthorId === data.friendId);
      }
    });
  }

  private updateAvatarAfterChanging(data: EventData): void {
    this.posts.forEach((post) => {
      if (post.postAuthorId === this.currentUser.id) {
        // eslint-disable-next-line no-param-reassign
        post.photo.element.src = `${data.url}`;
      }
    });
  }
}
