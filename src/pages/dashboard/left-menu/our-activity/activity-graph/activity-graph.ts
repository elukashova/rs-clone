import { Activity } from '../../../../../app/loader/loader.types';
import BaseComponent from '../../../../../components/base-component/base-component';
import Svg from '../../../../../components/base-component/svg/svg';
import { ProjectColors } from '../../../../../utils/consts';
import { DailyData } from '../our-activity.types';
import './activity-graph.css';
// import moment from 'moment';

export default class ActivityGraph extends BaseComponent<'div'> {
  private allDaysWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'our-activity__graph_all-days-wrapper',
  );

  private roundDiv: BaseComponent<'div'> = new BaseComponent('div', this.element, 'our-activity__graph_div-round');

  private daysNumber: number = 7;

  private daysLetters: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  private allDivWrappers: HTMLDivElement[] = [];

  private allGraphicSpans: HTMLSpanElement[] = [];

  private allDaysSpans: HTMLSpanElement[] = [];

  private IdxCorrector: number = 1;

  constructor(parent: HTMLElement, activities: Activity[]) {
    super('div', parent, 'our-activity__graph');
    this.renderDivs();
    this.renderSpans();
    this.highlightCurrentDay();
    this.calculateDailyActivity(activities);
  }

  private renderDivs(): void {
    for (let i: number = 0; i < this.daysNumber; i += 1) {
      const divElement: BaseComponent<'div'> = new BaseComponent(
        'div',
        this.allDaysWrapper.element,
        'our-activity__graph_day-wrapper',
      );

      this.allDivWrappers.push(divElement.element);
    }
  }

  private renderSpans(): void {
    for (let i: number = 0; i < this.allDivWrappers.length; i += 1) {
      const graphicElement: BaseComponent<'span'> = new BaseComponent(
        'span',
        this.allDivWrappers[i],
        'our-activity__graph_day_column',
      );

      const dayElement: BaseComponent<'span'> = new BaseComponent(
        'span',
        this.allDivWrappers[i],
        'our-activity__graph_day_letter',
        this.daysLetters[i],
      );

      this.allGraphicSpans.push(graphicElement.element);
      this.allDaysSpans.push(dayElement.element);
    }
  }

  private highlightCurrentDay(): void {
    // eslint-disable-next-line max-len, prettier/prettier
    const index: number = ActivityGraph.getDayIndex() === 0 ? this.allGraphicSpans.length - 1 : ActivityGraph.getDayIndex() - 1;
    this.allGraphicSpans[index].style.background = ProjectColors.Orange;
  }

  private static getDayIndex(day?: Date): number {
    if (!day) {
      const today: Date = new Date();
      return today.getDay();
    }

    return day.getDay();
  }

  public updateCurrentSportIcon(name: string): void {
    if (this.roundDiv.element.children.length > 0) {
      this.roundDiv.element.childNodes.forEach((child) => {
        this.roundDiv.element.removeChild(child);
      });
    }

    const svg: Svg = new Svg(this.roundDiv.element, name, '', 'our-activity__graph_svg');
    svg.updateFillColor(ProjectColors.Turquoise);
  }

  private updateStats(day: Date, km: number): void {
    const height: number = ActivityGraph.calculateGraphData(km);
    // eslint-disable-next-line max-len, prettier/prettier
    const dayIndex: number = ActivityGraph.getDayIndex(day) === 0 ? this.allGraphicSpans.length - 1 : ActivityGraph.getDayIndex(day) - 1;
    this.allGraphicSpans[dayIndex].style.height = `calc(${height}em + 0.15vw)`;
  }

  private static calculateGraphData(km: number): number {
    const minEmHeight: number = 0.1;
    const maxEmHeight: number = 2.5;
    const dayHours: number = 24;

    let height: number;
    if (km === 0) {
      height = minEmHeight;
    } else {
      height = dayHours / km < maxEmHeight ? km / dayHours : maxEmHeight;
    }

    return Number(height.toFixed(1));
  }

  // eslint-disable-next-line max-lines-per-function
  private calculateDailyActivity(activities: Activity[]): void {
    const today = new Date();
    const sunday: number = 6;
    const currentMonday: Date = new Date(today.setDate(today.getDate() - today.getDay()));
    const currentSunday: Date = new Date(today.setDate(today.getDate() - today.getDay() + sunday));

    const accumulatedData: DailyData[] = [];
    activities.forEach((ac) => {
      const shorten = new Date(ac.date).toDateString();
      const data: DailyData = {
        date: shorten,
        distance: Number(ac.distance),
      };

      if (accumulatedData.filter((el) => el.date === data.date).length === 0) {
        accumulatedData.push(data);
      } else {
        accumulatedData.map((record) => {
          if (record.date === data.date) {
            // eslint-disable-next-line no-param-reassign
            record.distance += data.distance;
          }
          return record;
        });
      }
    });

    accumulatedData.forEach((activity) => {
      const date = new Date(activity.date);
      if (date.getTime() <= currentSunday.getTime() && date.getTime() >= currentMonday.getTime()) {
        this.updateStats(date, Number(activity.distance));
      }
    });
  }
}
