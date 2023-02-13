import BaseComponent from '../../../components/base-component/base-component';
import ProfileCard from './profile-card/profile-card';
import TrainingJournal from './training-journal/training-journal';
import './left-menu.css';
import OurActivity from './our-activity/our-activity';
import { User } from '../../../app/loader/loader.types';
import DefaultUserInfo from './left-menu.types';
import AvatarSources from '../../../components/avatar-modal/avatar-modal.types';
import eventEmitter from '../../../utils/event-emitter';

export default class LeftMenu extends BaseComponent<'aside'> {
  public profileCard: ProfileCard;

  public trainingJournal: TrainingJournal;

  public ourActivity: OurActivity;

  constructor(user: User, private replaceMainCallback: () => void, parent?: HTMLElement) {
    super('aside', parent, 'left-menu');
    const name: string = LeftMenu.transformNameFormat(user.username);
    const avatarSource: string = user.avatarUrl || AvatarSources.Default;
    const bio: string = user.bio || DefaultUserInfo.DefaultBio;
    this.profileCard = new ProfileCard(this.element, avatarSource, name, bio, replaceMainCallback);
    this.trainingJournal = new TrainingJournal(this.element);
    this.ourActivity = new OurActivity(this.element);
    eventEmitter.emit('updateAvatar', { url: avatarSource });
  }

  private static transformNameFormat(name: string): string {
    const username: string[] = name.split(' ');
    for (let i: number = 0; i < username.length; i += 1) {
      username[i] = username[i].charAt(0).toUpperCase() + username[i].slice(1).toLowerCase();
    }
    return username.join(' ');
  }
}
