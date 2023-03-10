import { ActivityResponse } from '../../../../../app/loader/loader-responses.types';
import BaseComponent from '../../../../../components/base-component/base-component';
import Svg from '../../../../../components/base-component/svg/svg';
import { ProjectColors } from '../../../../../utils/consts';
import { getFirstAndLastDaysOfWeek } from '../../../../../utils/utils';
import { DailyData } from '../our-activity.types';
import './activity-graph.css';

export default class ActivityGraph extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    monday: 'dashboard.leftMenu.ourActivity.monday',
    tuesday: 'dashboard.leftMenu.ourActivity.tuesday',
    wednesday: 'dashboard.leftMenu.ourActivity.wednesday',
    thursday: 'dashboard.leftMenu.ourActivity.thursday',
    friday: 'dashboard.leftMenu.ourActivity.friday',
    saturday: 'dashboard.leftMenu.ourActivity.saturday',
    sunday: 'dashboard.leftMenu.ourActivity.sunday',
  };

  private allDaysWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'our-activity__graph_all-days-wrapper',
  );

  private roundDiv: BaseComponent<'div'> = new BaseComponent('div', this.element, 'our-activity__graph_div-round');

  private daysNumber: number = 7;

  private daysLetters: string[] = [
    'dashboard.leftMenu.ourActivity.monday',
    'dashboard.leftMenu.ourActivity.tuesday',
    'dashboard.leftMenu.ourActivity.wednesday',
    'dashboard.leftMenu.ourActivity.thursday',
    'dashboard.leftMenu.ourActivity.friday',
    'dashboard.leftMenu.ourActivity.saturday',
    'dashboard.leftMenu.ourActivity.sunday',
  ];

  private allDivWrappers: HTMLDivElement[] = [];

  private allGraphicSpans: HTMLSpanElement[] = [];

  private allDaysSpans: HTMLSpanElement[] = [];

  constructor(parent: HTMLElement) {
    super('div', parent, 'our-activity__graph');
    this.renderDivs();
    this.renderSpans();
    this.highlightCurrentDay();
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
    // eslint-disable-next-line max-len, prettier/prettier, operator-linebreak
    const index: number =
      // eslint-disable-next-line max-len
      ActivityGraph.getDayIndex() === 0 ? this.allGraphicSpans.length - 1 : ActivityGraph.getDayIndex() - 1;
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
    // eslint-disable-next-line operator-linebreak
    const dayIndex: number =
      // eslint-disable-next-line max-len
      ActivityGraph.getDayIndex(day) === 0 ? this.allGraphicSpans.length - 1 : ActivityGraph.getDayIndex(day) - 1;
    this.allGraphicSpans[dayIndex].style.height = `calc(${height}em + 0.15vw)`;
  }

  private setHeightToDefault(): void {
    const defaultHeight: number = 0.1;
    for (let i: number = 0; i < this.allGraphicSpans.length; i += 1) {
      this.allGraphicSpans[i].style.height = `calc(${defaultHeight}em + 0.15vw)`;
    }
  }

  private static calculateGraphData(km: number): number {
    const minEmHeight: number = 0.1;
    const maxEmHeight: number = 2.5;
    const dayHours: number = 24;

    let height: number;
    if (km === 0) {
      height = minEmHeight;
    } else {
      height = km / dayHours < maxEmHeight ? km / dayHours : maxEmHeight;
    }
    return Number(height.toFixed(1));
  }

  public calculateDailyActivity(activities: ActivityResponse[]): void {
    this.setHeightToDefault();
    const [currentMonday, currentSunday] = getFirstAndLastDaysOfWeek();

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
      // eslint-disable-next-line max-len
      if (date.getTime() <= currentSunday.getTime() && date.getTime() >= currentMonday.getTime()) {
        this.updateStats(date, Number(activity.distance));
      }
    });
  }
}
