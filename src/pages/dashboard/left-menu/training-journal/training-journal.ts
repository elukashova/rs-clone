import { ActivityResponse, User } from '../../../../app/loader/loader-responses.types';
import BaseComponent from '../../../../components/base-component/base-component';
import { sortActivitiesByDate } from '../../../../utils/utils';
import './training-journal.css';

export default class TrainingJournal extends BaseComponent<'div'> {
  private heading = new BaseComponent('h4', this.element, 'training-journal__heading', 'last activity');

  private infoWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'training-journal__info-wrapper');

  private activityWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.infoWrapper.element,
    'training-journal__activity-wrapper',
  );

  private defaultMessage: BaseComponent<'span'> = new BaseComponent(
    'span',
    undefined,
    'training-journal__default-message',
    'No activities to show yet',
  );

  private activityName: BaseComponent<'span'> = new BaseComponent('span', undefined, 'training-journal__activity_name');

  private activityDate: BaseComponent<'span'> = new BaseComponent('span', undefined, 'training-journal__activity_date');

  constructor(parent: HTMLElement, user: User) {
    super('div', parent, 'training-journal');
    if (user.activities.length > 0) {
      this.activityWrapper.element.append(this.activityName.element, this.activityDate.element);
      this.showLastActivity(user.activities);
    } else {
      this.element.append(this.defaultMessage.element);
    }
  }

  private showLastActivity(activities: ActivityResponse[]): void {
    const sortedActivities: ActivityResponse[] = sortActivitiesByDate(activities);
    const lastActivityIndex: number = sortedActivities.length - 1;
    const lastActivity: ActivityResponse = sortedActivities[lastActivityIndex];
    const formattedDate: string = TrainingJournal.formatDate(lastActivity.date);

    this.activityName.element.textContent = lastActivity.title;
    this.activityDate.element.textContent = formattedDate;
  }

  private static formatDate(date: string): string {
    const activityDate: Date = new Date(date);
    return activityDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
