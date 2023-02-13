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
    'Afternoon Run',
  );

  private activityDate: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.activityWrapper.element,
    'training-journal__activity_date',
    'January 1, 2023',
  );

  constructor(parent: HTMLElement) {
    super('div', parent, 'training-journal');
  }
}
