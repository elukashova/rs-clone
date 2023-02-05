import './our-activity.css';
import BaseComponent from '../../../../components/base-component/base-component';
import ActivityIcon from './activity-icon/activity-icon';
import SelectPeriod from './select-period/select-activity';

export default class OurActivity extends BaseComponent<'div'> {
  private ActivityIcons = new BaseComponent('div', this.element, 'our-activity__icons');

  public addActivityIcon = new ActivityIcon(this.ActivityIcons.element, '');

  private selectPeriod = new SelectPeriod(this.element);

  private statistics = new BaseComponent('div', this.element, 'our-activity__statistics');

  private distance = new BaseComponent('span', this.statistics.element, 'our-activity__period', 'distance');

  private graph = new BaseComponent('div', this.statistics.element, 'our-activity__graph');

  private timeAndStepContainer = new BaseComponent('div', this.statistics.element, 'our-activity__time-container');

  private time = new BaseComponent('span', this.timeAndStepContainer.element, 'our-activity__time');

  private steps = new BaseComponent('span', this.timeAndStepContainer.element, 'our-activity__steps');

  constructor(parent: HTMLElement) {
    super('div', parent, 'our-activity');
    this.setTimeAndSteps('23 часа', '30000 шагов');
  }

  public setTimeAndSteps(time: string, steps: string): void {
    this.time.element.textContent = time;
    this.steps.element.textContent = steps;
  }
}
