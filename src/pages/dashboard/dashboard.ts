import './dashboard.css';
import BaseComponent from '../../components/base-component/base-component';
import LeftMenu from './left-menu/left-menu';
import TrainingFeed from './training-feed/training-feed';
import RightMenu from './right-menu/right-menu';
import { getUser } from '../../app/loader/services/user-services';
import { SportType, Token, User } from '../../app/loader/loader.types';
import { checkDataInLocalStorage, setDataToLocalStorage } from '../../utils/local-storage';
import Post from './training-feed/post/post';

const mockDataUser = {
  avatarUrl: './assets/images/avatars/avatar9.png',
  bio: 'I am Batman',
  country: 'unknown',
  email: 'noneofyourbuisiness@nope.com',
  id: '2',
  username: 'Michael Knowles',
};

const mockDataActivity = {
  id: 1,
  user_id: '1',
  user: mockDataUser,
  sport: SportType.HIKING,
  title: 'Пешком по пляжу',
  time: '20min',
  distance: '100m',
  elevation: 1000,
  description: 'my training was quite good',
  created_at: new Date(),
  updated_at: new Date(),
  location: 'string',
};

export default class Dashboard extends BaseComponent<'section'> {
  private leftMenu!: LeftMenu;

  private trainingFeed: TrainingFeed = new TrainingFeed(this.element);

  private rightMenu: RightMenu = new RightMenu(this.element);

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private currentUser!: User;

  constructor() {
    super('section', undefined, 'dashboard section');
    if (this.token) {
      getUser(this.token).then((user: User) => {
        this.trainingFeed.element.append(new Post(mockDataActivity).element); // добавляем один пост
        this.currentUser = {
          ...user,
        };
        Dashboard.addIdToLocalStorage(this.currentUser.id);
        this.leftMenu = new LeftMenu(this.currentUser);
        this.element.insertBefore(this.leftMenu.element, this.trainingFeed.element);
      });
    }
  }

  private static addIdToLocalStorage(id: string): void {
    setDataToLocalStorage(id, 'myUserId');
  }
}
