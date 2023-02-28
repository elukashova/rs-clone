/* eslint-disable max-len */
import './dashboard.css';
import BaseComponent from '../../components/base-component/base-component';
import LeftMenu from './left-menu/left-menu';
import TrainingFeed from './training-feed/training-feed';
import RightMenu from './right-menu/right-menu';
import { getUser, updateUser } from '../../app/loader/services/user-services';
import { checkDataInLocalStorage, setDataToLocalStorage } from '../../utils/local-storage';
import eventEmitter from '../../utils/event-emitter';
import { transformNameFormat } from '../../utils/utils';
import AvatarSources from '../../components/avatar-modal/avatar-modal.types';
import { Token, UpdateUserData } from '../../app/loader/loader-requests.types';
import { ActivityResponse, User } from '../../app/loader/loader-responses.types';
import LoadingTimer from '../../components/base-component/loading/loading';

export default class Dashboard extends BaseComponent<'section'> {
  public loadingTimer = new LoadingTimer(document.body);

  private leftMenu!: LeftMenu;

  private trainingFeed!: TrainingFeed;

  private rightMenu!: RightMenu;

  private dashboardWrapper = new BaseComponent('div', this.element, 'sections-wrapper');

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  public currentUser: User = {
    id: '',
    username: '',
    email: '',
    country: '',
    bio: '',
    birth: '',
    gender: '',
    following: [],
    followedBy: [],
    avatarUrl: '',
    activities: [],
    challenges: [],
    sportTypes: [],
  };

  private posts: HTMLDivElement[] = [];

  constructor(private replaceMainCallback: () => void) {
    super('section', undefined, 'dashboard section');
    this.init();
  }

  private init(): void {
    this.loadingTimer.showLoadingCircle();
    setTimeout(() => {
      this.doRequest();
      this.loadingTimer.deleteLoadingCircle();
    }, 3000);
  }

  private doRequest(): void {
    if (this.token) {
      getUser(this.token).then((user: User) => {
        console.log(`Ваш токен для тестов: ${this.token?.token}`);
        this.currentUser = {
          ...user,
        };
        this.setUserInfo(user);
        this.leftMenu = new LeftMenu(this.currentUser, this.replaceMainCallback);
        const relevantActivities: ActivityResponse[] = Dashboard.collectAllActivities(user);
        this.trainingFeed = new TrainingFeed(
          this.dashboardWrapper.element,
          this.replaceMainCallback,
          user,
          relevantActivities,
        );
        this.rightMenu = new RightMenu(this.dashboardWrapper.element, this.replaceMainCallback, user);
        this.dashboardWrapper.element.insertBefore(this.leftMenu.element, this.trainingFeed.element);
      });
    }
  }

  private setUserInfo(user: User): void {
    transformNameFormat(user.username);
    this.currentUser.username = transformNameFormat(user.username);
    this.currentUser.avatarUrl = user.avatarUrl || AvatarSources.Default;
    eventEmitter.emit('updateAvatar', { avatarUrl: this.currentUser.avatarUrl });
    setDataToLocalStorage(this.currentUser.avatarUrl, 'UserAvatarUrl');
    this.currentUser.bio = user.bio || '';
    setDataToLocalStorage(user.id, 'MyStriversId');

    if (this.token) {
      Dashboard.updateUser(this.token, { avatarUrl: this.currentUser.avatarUrl });
    }
  }

  private static collectAllActivities(user: User): ActivityResponse[] {
    const allActivitiesData: ActivityResponse[] = [];

    if (user.activities.length > 0) {
      user.activities.forEach((activity) => {
        const userInfo = {
          ...activity,
        };
        allActivitiesData.push(userInfo);
      });
    }

    if (user.following.length > 0) {
      user.following.forEach((followee) => {
        if (followee.activities.length > 0) {
          followee.activities.forEach((activity) => {
            const followeeInfo: ActivityResponse = {
              ...activity,
            };
            allActivitiesData.push(followeeInfo);
          });
        }
      });
    }
    return allActivitiesData;
  }

  private static updateUser(token: Token, data: UpdateUserData): Promise<void | null> {
    return updateUser(token, data)
      .then((user: User) => {
        if (user) {
          eventEmitter.emit('updateAvatar', { url: user.avatarUrl });
        }
      })
      .catch(() => null);
  }
}
