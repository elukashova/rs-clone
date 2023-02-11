import './find-friends.css';
import BaseComponent from '../../components/base-component/base-component';
import { getUser } from '../../app/loader/services/user-services';
import { User, Token } from '../../app/loader/loader.types';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import Input from '../../components/base-component/text-input-and-label/text-input';
import { ProjectColors } from '../../utils/consts';
import SvgNames from '../../components/base-component/svg/svg.types';

export default class Friends extends BaseComponent<'section'> {
  private findingContainer = new BaseComponent('div', this.element, 'find-friends__container');

  private notFriendsBlock = new BaseComponent('div', this.findingContainer.element, 'not-friends__block');

  private notFriendsTitle = new BaseComponent('h3', this.notFriendsBlock.element, 'not-friends__title', 'Найти друзей');

  private notFriendsSearch = new Input(
    this.notFriendsBlock.element,
    'not-friends__input input-search',
    'Имя спортсмена',
    {
      type: 'search',
    },
  );

  private friendsBlock = new BaseComponent('div', this.findingContainer.element, 'friends__block');

  private friendsTitle = new BaseComponent('h3', this.friendsBlock.element, 'friends__title', 'Мои подписки');

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private currentUser!: User;

  constructor(parent: HTMLElement) {
    super('section', parent, 'find-friends find-friends-section');
    if (this.token) {
      getUser(this.token).then((user) => {
        console.log(user);
        /* this.currentUser = {
          ...user,
        }; */

        /* type User = {
  avatarUrl: string;
  bio: string;
  country: string;
  created_at: string;
  email: string;
  id: string;
  updated_at: string;
  username: string;
}; */
      });
    }
    this.notFriendsSearch.addSvgIcon(SvgNames.Search, ProjectColors.Turquoise, 'search');
  }
}
