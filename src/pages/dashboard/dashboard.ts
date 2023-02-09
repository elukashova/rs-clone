import './dashboard.css';
import BaseComponent from '../../components/base-component/base-component';
import LeftMenu from './left-menu/left-menu';
import TrainingFeed from './training-feed/training-feed';
import RightMenu from './right-menu/right-menu';
import { getUser } from '../../app/loader/services/user-services';
import { Token } from '../../app/loader/loader.types';
import { checkDataInLocalStorage } from '../../utils/local-storage/local-storage';
import User from './dashboard.types';

export default class Dashboard extends BaseComponent<'section'> {
  private leftMenu!: LeftMenu;

  private trainingFeed: TrainingFeed = new TrainingFeed(this.element);

  private rightMenu: RightMenu = new RightMenu(this.element);

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private currentUser!: User;

  constructor() {
    super('section', undefined, 'dashboard');
    if (this.token) {
      getUser(this.token).then((user) => {
        this.currentUser = {
          ...user,
        };
        this.leftMenu = new LeftMenu(this.currentUser, undefined);
        console.log(this.currentUser);
        this.element.insertBefore(this.leftMenu.element, this.trainingFeed.element);
      });
    }
  }
}
