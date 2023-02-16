import { Activity } from '../../../../app/loader/loader.types';
import BaseComponent from '../../../../components/base-component/base-component';
import './training-journal.css';

export default class TrainingJournal extends BaseComponent<'div'> {
  private heading = new BaseComponent('h4', this.element, 'training-journal__heading', 'last activity');

  private infoWrapper: BaseComponent<'div'> = new BaseComponent('div', this.element, 'training-journal__info-wrapper');

  private activityWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.infoWrapper.element,
    'training-journal__activity-wrapper',
  );

  private activityName: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.activityWrapper.element,
    'training-journal__activity_name',
  );

  private activityDate: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.activityWrapper.element,
    'training-journal__activity_date',
    'January 1, 2023',
  );

  constructor(parent: HTMLElement, activities: Activity[]) {
    super('div', parent, 'training-journal');
    this.showLastActivity(activities);
  }

  private showLastActivity(activities: Activity[]): void {
    const sortedActivities: Activity[] = TrainingJournal.pickLastActivity(activities);
    const lastActivityIndex: number = 0;
    const lastActivity: Activity = sortedActivities[lastActivityIndex];
    const formattedDate: string = TrainingJournal.formatDate(lastActivity.date);

    this.activityName.element.textContent = lastActivity.title;
    this.activityDate.element.textContent = formattedDate;
  }

  private static pickLastActivity(activities: Activity[]): Activity[] {
    const activitiesToSort: Activity[] = [...activities];
    return activitiesToSort.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private static formatDate(date: string): string {
    const activityDate: Date = new Date(date);
    return activityDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
