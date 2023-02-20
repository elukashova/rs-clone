import './task.css';
import BaseComponent from '../../../../components/base-component/base-component';
import Picture from '../../../../components/base-component/picture/picture';

export default class Task extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    participants: 'Participants', // перевод
    noProgress: 'Challenge without progress checking', // перевод
    yogaChallenge: 'Yours hours',
    hikingChallenge: 'Conquer your Everest',
    runningChallenge: 'The Tour de Valiance',
    slothChallenge: 'International Sloth Day',
    cyclingChallenge: 'Unbending spirit',
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

  constructor(parent: HTMLElement, type: string) {
    super('div', parent, 'task');
    this.type = type;
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
    } else {
      this.noProgress = new BaseComponent('p', this.taskData.element, 'task__no-progress', this.dictionary.noProgress);
    }
  }

  public getTaskName(): void {
    switch (this.type) {
      case 'yoga':
        this.taskName = this.dictionary.yogaChallenge;
        this.taskName = 'Yours hours';
        this.goal = ['567', '7']; // minutes, 9.27h
        this.progressInclude = true;
        break;
      case 'hiking':
        this.taskName = this.dictionary.hikingChallenge;
        this.goal = ['8849', '365']; // meters
        this.progressInclude = true;
        break;
      case 'running':
        this.taskName = this.dictionary.runningChallenge;
        this.goal = ['3000', '365']; // km
        this.progressInclude = true;
        break;
      case 'sloth':
        this.taskName = this.dictionary.slothChallenge;
        this.goal = ['8849', '365'];
        this.progressInclude = false;
        break;
      case 'cycling':
        this.taskName = this.dictionary.cyclingChallenge;
        this.goal = ['7', '7']; // activity every day
        this.progressInclude = true;
        break;
      case 'photo':
        this.taskName = 'Like Van Gogh';
        this.goal = ['8849', '365'];
        this.progressInclude = false;
        break;
      default:
        break;
    }
  }
}
