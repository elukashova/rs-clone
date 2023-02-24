/* eslint-disable @typescript-eslint/no-non-null-assertion */
import i18next from 'i18next';
import { ActivityResponse, User } from '../../../../app/loader/loader-responses.types';
import BaseComponent from '../../../../components/base-component/base-component';
import eventEmitter from '../../../../utils/event-emitter';
import { EventData } from '../../../../utils/event-emitter.types';
import { sortActivitiesByDate } from '../../../../utils/utils';
import './training-journal.css';

export default class TrainingJournal extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    heading: 'dashboard.leftMenu.trainingJournal.heading',
    defaulMessage: 'dashboard.leftMenu.trainingJournal.defaultMessage',
    activities: 'dashboard.leftMenu.trainingJournal.activities',
  };

  private heading = new BaseComponent('h4', this.element, 'training-journal__heading', this.dictionary.heading);

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
    this.dictionary.defaulMessage,
  );

  private activityName: BaseComponent<'span'> = new BaseComponent('span', undefined, 'training-journal__activity_name');

  private activityDate: BaseComponent<'span'> = new BaseComponent('span', undefined, 'training-journal__activity_date');

  private activities: ActivityResponse[] = [];

  constructor(parent: HTMLElement, user: User) {
    super('div', parent, 'training-journal');
    if (user.activities.length > 0) {
      this.activityWrapper.element.append(this.activityName.element, this.activityDate.element);
      this.activities = user.activities;
      this.showLastActivity(this.activities);
    } else {
      this.element.append(this.defaultMessage.element);
    }
    eventEmitter.on('activityRemoved', (data: EventData) => this.updateLastActivity(data));
  }

  private showLastActivity(activities: ActivityResponse[]): void {
    const sortedActivities: ActivityResponse[] = sortActivitiesByDate(activities);
    const lastActivityIndex: number = sortedActivities.length - 1;
    const lastActivity: ActivityResponse = sortedActivities[lastActivityIndex];
    const formattedDate: string = TrainingJournal.formatDate(lastActivity.date);

    this.activityName.element.textContent = lastActivity.title;
    i18next.on('languageChanged', () => {
      this.activityDate.element.textContent = TrainingJournal.formatDate(lastActivity.date);
    });
    this.activityDate.element.textContent = formattedDate;
  }

  private static formatDate(date: string): string {
    const language: string = localStorage.getItem('i18nextLng')!;
    const activityDate: Date = new Date(date);
    return activityDate.toLocaleString(language, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  private updateLastActivity(data: EventData): void {
    this.cleanContent();
    this.activities = this.activities.filter((activity) => activity.id !== data.activityId);
    if (this.activities.length > 0) {
      this.showLastActivity(this.activities);
    } else {
      this.element.append(this.defaultMessage.element);
    }
  }

  private cleanContent(): void {
    this.activityName.element.textContent = '';
    this.activityDate.element.textContent = '';
  }
}
