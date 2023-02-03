import BaseComponent from '../../../components/base-component/base-component';
import ProfileCard from './profile-card/profile-card';
import TrainingJournal from './training-journal/training-journal';

export default class LeftMenu extends BaseComponent<'aside'> {
  public profileCard = new ProfileCard(this.element, '', 'new user', 'here would be your description');

  public trainingJournal = new TrainingJournal(this.element);

  constructor(parent: HTMLElement) {
    super('aside', parent);
  }
}
