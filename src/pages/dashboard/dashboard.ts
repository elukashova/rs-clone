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
import DefaultUserInfo from './left-menu/left-menu.types';
import { Token, UpdateUserData } from '../../app/loader/loader-requests.types';
import { User } from '../../app/loader/loader-responses.types';

export default class Dashboard extends BaseComponent<'section'> {
  private leftMenu!: LeftMenu;

  private dashboardWrapper = new BaseComponent('div', this.element, 'sections-wrapper');

  private trainingFeed: TrainingFeed = new TrainingFeed(this.dashboardWrapper.element, this.replaceMainCallback);

  private rightMenu: RightMenu = new RightMenu(this.dashboardWrapper.element, this.replaceMainCallback);

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private currentUser: User = {
    id: '',
    username: '',
    email: '',
    country: '',
    bio: '',
    following: [],
    followedBy: [],
    avatarUrl: '',
    activities: [],
  };

  private posts: HTMLDivElement[] = [];

  constructor(private replaceMainCallback: () => void) {
    super('section', undefined, 'dashboard section');
    if (this.token) {
      getUser(this.token).then((user: User) => {
        console.log(this.token);
        this.currentUser = {
          ...user,
        };
        this.setUserInfo(user);
        this.leftMenu = new LeftMenu(this.currentUser, replaceMainCallback);
        this.dashboardWrapper.element.insertBefore(this.leftMenu.element, this.trainingFeed.element);
        this.posts = TrainingFeed.addPosts(this.currentUser);
        if (this.posts.length) {
          this.trainingFeed.deleteGreetingMessage();
          this.trainingFeed.element.append(...this.posts);
        } else {
          this.trainingFeed.element.innerHTML = '';
          this.trainingFeed.showGreetingMessage();
        }
      });
    }
  }

  private setUserInfo(user: User): void {
    transformNameFormat(user.username);
    this.currentUser.username = transformNameFormat(user.username);
    this.currentUser.avatarUrl = user.avatarUrl || AvatarSources.Default;
    this.currentUser.bio = user.bio || DefaultUserInfo.DefaultBio;
    setDataToLocalStorage(user.id, 'MyStriversId');

    if (this.token) {
      Dashboard.updateUser(this.token, { avatarUrl: this.currentUser.avatarUrl });
    }
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
