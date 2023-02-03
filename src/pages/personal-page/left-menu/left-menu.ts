import BaseComponent from '../../../components/base-component/base-component';
import ProfileCard from './profile-card/profile-card';

export default class LeftMenu extends BaseComponent<'aside'> {
  public profileCard = new ProfileCard(this.element, '', 'new user', 'here would be your description');

  constructor(parent: HTMLElement) {
    super('aside', parent);
  }
}
