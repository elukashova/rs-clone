import './dashboard.css';
import BaseComponent from '../../components/base-component/base-component';
import LeftMenu from './left-menu/left-menu';
import TrainingFeed from './training-feed/training-feed';
import RightMenu from './right-menu/right-menu';
import { getUser } from '../../app/loader/services/user-services';
import { Token, User } from '../../app/loader/loader.types';
import { checkDataInLocalStorage, setDataToLocalStorage } from '../../utils/local-storage';

export default class Dashboard extends BaseComponent<'section'> {
  private leftMenu!: LeftMenu;

  private trainingFeed: TrainingFeed = new TrainingFeed(this.element, this.replaceMainCallback);

  private rightMenu: RightMenu = new RightMenu(this.element);

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private currentUser!: User;

  constructor(private replaceMainCallback: () => void) {
    super('section', undefined, 'dashboard section');
    if (this.token) {
      getUser(this.token).then((user: User) => {
        this.currentUser = {
          ...user,
        };
        Dashboard.addIdToLocalStorage(this.currentUser.id);
        this.leftMenu = new LeftMenu(this.currentUser, replaceMainCallback);
        this.element.insertBefore(this.leftMenu.element, this.trainingFeed.element);
      });
    }
  }

  private static addIdToLocalStorage(id: string): void {
    setDataToLocalStorage(id, 'myUserId');
  }
}
