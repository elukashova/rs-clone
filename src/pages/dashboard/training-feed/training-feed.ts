import './training-feed.css';
import i18next from 'i18next';
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
import { checkDataInLocalStorage } from '../../../utils/local-storage';

export default class TrainingFeed extends BaseComponent<'article'> {
  private dictionary: Record<string, string> = {
    message: 'dashboard.trainingFeed.message',
    addActivity: 'dashboard.trainingFeed.addActivity',
    findFriends: 'dashboard.trainingFeed.findFriends',
    km: 'other.km',
    hour: 'other.hour',
    meter: 'other.meter',
    speed: 'other.speed',
    minute: 'other.minute',
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

  private userId: string | null = checkDataInLocalStorage('MyStriversId');

  private activitiesBackup: ActivityResponse[] = [];

  // eslint-disable-next-line max-len
  constructor(parent: HTMLElement, private replaceMainCallback: () => void, user: User, postData: ActivityResponse[]) {
    super('article', parent, 'training-feed');
    this.currentUser.username = user.username;
    this.currentUser.avatarUrl = user.avatarUrl;
    this.currentUser.id = user.id;
    postData.forEach((data) => this.activitiesBackup.push(data));

    this.defineFeedContent(this.activitiesBackup);
    this.subscribeToEvents();
  }

  private defineFeedContent(postData: ActivityResponse[]): void {
    this.posts = this.addPosts(postData);
    if (this.posts.length) {
      this.deleteGreetingMessage();
      this.posts.forEach((post) => this.element.append(post.element));
    } else {
      this.showGreetingMessage();
    }
  }

  public addPosts(data: ActivityResponse[]): Post[] {
    const posts: Post[] = [];
    const sortedActivities = sortActivitiesByDate(data);
    sortedActivities.forEach((activity) => {
      const post: Post = new Post(activity.userId, activity);
      if (activity.kudos && activity.kudos.length > 0) {
        post.checkIfLikedPost(activity.kudos);
        post.updateLikesCounter(activity.kudos);
      }

      if (activity.comments && activity.comments.length > 0) {
        post.appendExistingComments(activity.comments);
      }
      post.postId = activity.id;
      // eslint-disable-next-line max-len, prettier/prettier
      post.photo.element.src = this.userId && this.userId === activity.userId ? this.currentUser.avatarUrl : activity.avatarUrl;
      post.userCommentAvatar.element.src = this.currentUser.avatarUrl;
      post.name.element.textContent = activity.username;

      post.defineButtonBasenOnAuthor();
      post.activityTitle.element.textContent = activity.title;
      post.activityDescription.element.textContent = activity.description || '';
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

  private changeTimeFormat(time: string): string {
    const splittedTime: string[] = time.split(':');
    const [hours, minutes] = splittedTime;
    const hoursTranslated = i18next.t(this.dictionary.hour, { count: +hours });
    const minutesTranslated = i18next.t(this.dictionary.minute, { count: +minutes });
    return `${hoursTranslated} ${minutesTranslated}`;
  }

  private subscribeToEvents(): void {
    eventEmitter.on('friendAdded', (data: EventData) => this.updateTrainingFeed(data));
    eventEmitter.on('friendDeleted', (data: EventData) => this.removeAllFriendPosts(data));
    eventEmitter.on('updateAvatar', (data: EventData) => this.updateAvatarAfterChanging(data));
  }

  private removeAllFriendPosts(data: EventData): void {
    // eslint-disable-next-line max-len
    this.activitiesBackup = this.activitiesBackup.filter((activity) => activity.userId !== data.friendId);
    this.posts.forEach((post) => {
      if (post.postAuthorId === data.friendId) {
        this.element.removeChild(post.element);
        this.posts = this.posts.filter((singlePost) => singlePost.postAuthorId !== data.friendId);
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

  private updateTrainingFeed(data: EventData): void {
    this.cleanFeed();
    if (Array.isArray(data.activities)) {
      data.activities.forEach((activity) => this.activitiesBackup.push(activity));
      this.defineFeedContent(this.activitiesBackup);
    }
  }

  private cleanFeed(): void {
    this.posts.forEach((post) => this.element.removeChild(post.element));
    this.posts = [];
  }
}
