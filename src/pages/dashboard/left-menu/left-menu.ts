import BaseComponent from '../../../components/base-component/base-component';
import ProfileCard from './profile-card/profile-card';
import TrainingJournal from './training-journal/training-journal';
import './left-menu.css';
import OurActivity from './our-activity/our-activity';
import { User } from '../../../app/loader/loader-responses.types';

export default class LeftMenu extends BaseComponent<'aside'> {
  public profileCard: ProfileCard;

  public trainingJournal: TrainingJournal;

  public ourActivity: OurActivity;

  constructor(user: User, replaceMainCallback: () => void, parent?: HTMLElement) {
    super('aside', parent, 'left-menu');

    this.profileCard = new ProfileCard(this.element, user, replaceMainCallback);
    this.trainingJournal = new TrainingJournal(this.element, user.activities);
    this.ourActivity = new OurActivity(this.element, user);
  }
}
