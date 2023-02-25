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

  public participants!: BaseComponent<'span'>;

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
    /* this.init(photo, name, participants); */
    // this.init();
  }

  public renderTask(): void {
    this.nameWrapper = new BaseComponent('div', this.element, 'task__name-wrapper');

    this.photo = new Picture(this.nameWrapper.element, 'task__photo', {
      src: `../../../../../assets/images/challenges/${this.type}.jpg`,
    });

    this.taskData = new BaseComponent('div', this.nameWrapper.element, 'task__data');

    this.name = new BaseComponent('span', this.taskData.element, 'task__name', `${this.taskName}`);

    this.participants = new BaseComponent(
      'span',
      this.taskData.element,
      'task__participants',
      `${this.dictionary.participants}: ${20 || 0}`,
    );

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
      if (this.type === 'running') {
        this.checkRunning(this.user.activities);
      }
    } else {
      this.noProgress = new BaseComponent('p', this.taskData.element, 'task__no-progress', this.dictionary.noProgress);
    }
  }

  public getTaskName(): void {
    console.log(this.type);
    switch (this.type) {
      case 'yoga':
        this.taskName = this.dictionary.yogaChallenge;
        this.goal = ['567', '7']; // minutes, 9.27h
        this.progressInclude = true;
        break;
      case 'hiking':
        this.taskName = this.dictionary.hikingChallenge;
        this.goal = ['8849', '365']; // meters elevation
        this.progressInclude = true;
        break;
      case 'running':
        this.taskName = this.dictionary.runningChallenge;
        this.goal = ['3000', '365']; // km
        this.progressInclude = true;
        break;
      case 'sloth':
        this.taskName = this.dictionary.slothChallenge;
        this.goal = [];
        this.progressInclude = false;
        break;
      case 'cycling':
        this.taskName = this.dictionary.cyclingChallenge;
        this.goal = ['7', '7']; // activity every day
        this.progressInclude = true;
        break;
      case 'photo':
        this.taskName = this.dictionary.photoChallenge;
        this.goal = [];
        this.progressInclude = false;
        break;
      default:
        break;
    }
  }

  private checkRunning(activities: ActivityResponse[]): void {
    console.log(activities);
    const start: Date = new Date(2022, 2, 1);
    const end: Date = new Date(2023, 2, 1);
    const result = OurActivity.calculateYearDistance(activities, start, end);
    const percent = (result * 100) / 3000;
    this.colorProgress(percent);
  }

  private colorProgress(percent: number): void {
    if (percent < 100) {
      this.progressBar.element.style.width = `${percent}%`;
      this.progressBarData.element.textContent = `${percent.toFixed(1)}%`;
    } else if (percent >= 100) {
      this.progressBar.element.style.width = '100%';
      this.progressBar.element.style.backgroundColor = ProjectColors.Orange;
      this.progressBarData.element.textContent = '100%';
      this.progressBarData.element.style.color = ProjectColors.Orange;
    }
  }
}
