/* eslint-disable max-lines-per-function */
import './task.css';
import BaseComponent from '../../../../components/base-component/base-component';
import Picture from '../../../../components/base-component/picture/picture';
import { ActivityResponse, User } from '../../../../app/loader/loader-responses.types';
import OurActivity from '../../left-menu/our-activity/our-activity';
import { ProjectColors } from '../../../../utils/consts';

export default class Task extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    participants: 'challenges.participants',
    noProgress: 'challenges.noProgress',
    yogaChallenge: 'challenges.yogaTitle',
    hikingChallenge: 'challenges.hikingTitle',
    runningChallenge: 'challenges.runningTitle',
    slothChallenge: 'challenges.slothTitle',
    cyclingChallenge: 'challenges.cyclingTitle',
    photoChallenge: 'challenges.photoTitle',
  };

  public type: string;

  public taskName!: string;

  public nameWrapper!: BaseComponent<'div'>;

  public photo!: BaseComponent<'img'>;

  public name!: BaseComponent<'span'>;

  public progressWrapper!: BaseComponent<'div'>;

  public progressBox!: BaseComponent<'div'>;

  public progressBar!: BaseComponent<'div'>;

  public taskData!: BaseComponent<'div'>;

  public progressBarData!: BaseComponent<'span'>;

  public goal!: string[];

  public progressInclude!: boolean;

  public noProgress!: BaseComponent<'p'>;

  private user: User;

  constructor(parent: HTMLElement, type: string, user: User) {
    super('div', parent, 'task');
    this.type = type;
    this.user = user;
    this.getTaskName();
    this.renderTask();
  }

  public renderTask(): void {
    this.nameWrapper = new BaseComponent('div', this.element, 'task__name-wrapper');

    this.photo = new Picture(this.nameWrapper.element, 'task__photo', {
      src: `../../../../../assets/images/challenges/${this.type}.jpg`,
    });

    this.taskData = new BaseComponent('div', this.nameWrapper.element, 'task__data');

    this.name = new BaseComponent('span', this.taskData.element, 'task__name', `${this.taskName}`);

    if (this.progressInclude === true) {
      this.progressWrapper = new BaseComponent('div', this.taskData.element, 'task__progress-wrapper');
      this.progressBarData = new BaseComponent(
        'span',
        this.progressWrapper.element,
        'task__progress-bar-data progress-bar-data',
        '50%',
      );
      this.progressBox = new BaseComponent('div', this.progressWrapper.element, 'task__progress-box progress-box');
      this.progressBar = new BaseComponent('div', this.progressBox.element, 'task__progress-bar progress-bar');
      switch (this.type) {
        case 'yoga':
          this.checkYoga(this.user.activities);
          break;
        case 'running':
          this.checkRunning(this.user.activities);
          break;
        case 'hiking':
          this.checkHiking(this.user.activities);
          break;
        case 'cycling':
          this.checkCycling(this.user.activities);
          break;
        default:
          break;
      }
    } else {
      this.noProgress = new BaseComponent('p', this.taskData.element, 'task__no-progress', this.dictionary.noProgress);
    }
  }

  public getTaskName(): void {
    switch (this.type) {
      case 'yoga':
        this.taskName = this.dictionary.yogaChallenge;
        this.progressInclude = true;
        break;
      case 'hiking':
        this.taskName = this.dictionary.hikingChallenge;
        this.progressInclude = true;
        break;
      case 'running':
        this.taskName = this.dictionary.runningChallenge;
        this.progressInclude = true;
        break;
      case 'sloth':
        this.taskName = this.dictionary.slothChallenge;
        this.progressInclude = false;
        break;
      case 'cycling':
        this.taskName = this.dictionary.cyclingChallenge;
        this.progressInclude = true;
        break;
      case 'photo':
        this.taskName = this.dictionary.photoChallenge;
        this.progressInclude = false;
        break;
      default:
        break;
    }
  }

  private checkRunning(activities: ActivityResponse[]): void {
    const start: Date = new Date(2023, 1, 1);
    const end: Date = new Date(2024, 1, 1);
    const result = OurActivity.calculateYearDistance(activities, start, end);
    const percent = Task.getPercents(result, 3000);
    this.colorProgress(percent);
  }

  private static getPercents(result: number, total: number): number {
    return (result * 100) / total;
  }

  private colorProgress(percent: number): void {
    if (percent === 0) {
      this.progressBar.element.style.width = '0%';
      this.progressBarData.element.textContent = '0%';
    } else if (percent < 100) {
      this.progressBar.element.style.width = `${percent}%`;
      this.progressBarData.element.textContent = `${percent.toFixed(1)}%`;
    } else if (percent >= 100) {
      this.progressBar.element.style.width = '100%';
      this.progressBar.element.style.backgroundColor = ProjectColors.Orange;
      this.progressBarData.element.textContent = '100%';
      this.progressBarData.element.style.color = ProjectColors.Orange;
    }
  }

  private checkYoga(activities: ActivityResponse[]): void {
    const start = new Date(2023, 1, 19);
    const end = new Date(2023, 2, 19);
    const sports = activities.filter((activity) => activity.sport === 'hiking' || activity.sport === 'walking');
    let time = 0;
    sports.forEach((activity) => {
      const date = new Date(activity.date);
      const dateMs = date.getTime();
      if (dateMs >= start.getTime() && dateMs <= end.getTime()) {
        const [hours, minutes] = activity.duration.split(':');
        const totalMinutes = Number(hours) * 60 + Number(minutes);
        time += Number(totalMinutes);
      }
    });
    const percent = Task.getPercents(time, 567);
    this.colorProgress(percent);
  }

  private checkHiking(activities: ActivityResponse[]): void {
    const start = new Date(2023, 1, 1);
    const end = new Date(2024, 1, 1);
    let elevation = 0;
    activities.forEach((activity) => {
      const date = new Date(activity.date);
      const dateMs = date.getTime();
      if (dateMs >= start.getTime() && dateMs <= end.getTime()) {
        elevation += Number(activity.elevation);
      }
    });
    const percent = Task.getPercents(elevation, 8849);
    this.colorProgress(percent);
  }

  private checkCycling(activities: ActivityResponse[]): void {
    const start = new Date(2023, 1, 27);
    const end = new Date(2023, 2, 6);
    const sports = activities.filter((activity) => activity.sport === 'cycling');

    const eventWeek = sports.reduce((acc: string[], activity: ActivityResponse) => {
      const activityDate = new Date(activity.date);
      const date = `${activityDate.getDate()},${activityDate.getMonth()},${activityDate.getFullYear()}`;
      if (activityDate >= start && activityDate <= end && !acc.includes(date)) {
        acc.push(date);
      }
      return acc;
    }, []);
    const percent = Task.getPercents(eventWeek.length, 7);
    this.colorProgress(percent);
  }
}
