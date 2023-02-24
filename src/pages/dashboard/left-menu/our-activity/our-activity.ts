/* eslint-disable max-len */
import './our-activity.css';
import i18next from 'i18next';
import BaseComponent from '../../../../components/base-component/base-component';
import ActivityGraph from './activity-graph/activity-graph';
import Svg from '../../../../components/base-component/svg/svg';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../../utils/consts';
import EditBlock from '../../../../components/base-component/edit-block/edit-block';
import { ActivityResponse, User } from '../../../../app/loader/loader-responses.types';
import { getFirstAndLastDaysOfWeek } from '../../../../utils/utils';
import { checkDataInLocalStorage } from '../../../../utils/local-storage';
import { Token } from '../../../../app/loader/loader-requests.types';
import { updateUser } from '../../../../app/loader/services/user-services';
import eventEmitter from '../../../../utils/event-emitter';
import { EventData } from '../../../../utils/event-emitter.types';

export default class OurActivity extends BaseComponent<'div'> {
  private dictionary: Record<string, string> = {
    weekHeader: 'dashboard.leftMenu.ourActivity.weekHeader',
    chooseSportHeadingMain: 'dashboard.leftMenu.ourActivity.chooseSportHeadingMain',
    yearHeader: 'dashboard.leftMenu.ourActivity.yearHeader',
    chooseSportHeadingError: 'dashboard.leftMenu.ourActivity.chooseSportHeadingError',
    noSports: 'dashboard.leftMenu.ourActivity.noSports',
    km: 'other.km',
    meterArrow: 'other.meter',
    hour: 'other.hour',
  };

  private activityIcons: BaseComponent<'div'> = new BaseComponent('div', this.element, 'our-activity__icons');

  private iconsChoiceWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.activityIcons.element,
    'our-activity__icons-header-wrapper',
  );

  private sportsIcons: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.iconsChoiceWrapper.element,
    'our-activity__icons-wrapper',
  );

  private editBlock: EditBlock = new EditBlock(this.iconsChoiceWrapper.element, 'our-activity');

  private weekHeaderWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'our-activity__week-wrapper',
  );

  private weekHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.weekHeaderWrapper.element,
    'our-activity__week-header',
    this.dictionary.weekHeader,
  );

  private totalWeeklyKm: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.weekHeaderWrapper.element,
    'our-activity__week-km',
  );

  private chooseSportsHeading: BaseComponent<'h6'> = new BaseComponent(
    'h6',
    undefined,
    'our-activity__icons_header',
    this.dictionary.chooseSportHeadingMain,
  );

  private statistics = new BaseComponent('div', this.element, 'our-activity__statistics');

  private graph = new ActivityGraph(this.statistics.element);

  private timeAndElevationContainer = new BaseComponent('div', this.statistics.element, 'our-activity__time-container');

  private time = new BaseComponent('span', this.timeAndElevationContainer.element, 'our-activity__time');

  private elevation = new BaseComponent('span', this.timeAndElevationContainer.element, 'our-activity__elevation');

  private yearHeaderWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'our-activity__year-wrapper',
  );

  private yearHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.yearHeaderWrapper.element,
    'our-activity__year-header',
    this.dictionary.yearHeader,
  );

  private totalYearlyKm: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.yearHeaderWrapper.element,
    'our-activity__year-km',
  );

  private svgNumberOnPage: number = 3;

  // eslint-disable-next-line max-len
  private svgAllNames: SvgNames[] = [SvgNames.Walking, SvgNames.Running, SvgNames.Cycling, SvgNames.Hiking];

  private currentSvgElements: Svg[] = [];

  private chosenSvgElements: Svg[] = [];

  private allSvgElements: Svg[] = [];

  private currentIcon: Svg | undefined;

  private currentIconIndex: number = 0;

  private isUpdate: boolean = false;

  private choosenSportsCounter: number = 3;

  private noSportsMessage: BaseComponent<'h6'> | undefined;

  private isNoChoice: boolean = false;

  private kmCounter: number = 0;

  private hoursCounter: number = 0;

  private elevationCounter: number = 0;

  private yearKmCounter: number = 0;

  private sportTypesForServer: string[] = [];

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private activities: ActivityResponse[];

  constructor(parent: HTMLElement, private user: User) {
    super('div', parent, 'our-activity');
    this.storeAllSportSVGs();
    this.activities = user.activities;
    if (user.sportTypes.length > 0) {
      this.checkServerData(user.sportTypes);
    } else {
      this.checkPageLimit();
    }
    this.highlightCurrentIcon();
    this.setSvgEventListeners();
    this.updateSportActivityData();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.editBlock.editBtn.element.addEventListener('click', this.activateSportChanging);
    i18next.on('languageChanged', () => {
      this.updateStats();
    });
    eventEmitter.on('activityRemoved', (data: EventData) => this.updateStatsAfterDeletion(data));
  }

  private storeAllSportSVGs(): void {
    for (let i: number = 0; i < this.svgAllNames.length; i += 1) {
      const svg: Svg = new Svg(
        this.sportsIcons.element,
        this.svgAllNames[i],
        ProjectColors.Grey,
        `our-activity__svg activity__svg-${i}`,
      );
      svg.svg.setAttribute('id', this.svgAllNames[i].toLowerCase());
      this.allSvgElements.push(svg);
      if (i < this.svgNumberOnPage) {
        this.currentSvgElements.push(svg);
        this.chosenSvgElements.push(svg);
      }
    }
  }

  private checkPageLimit(): void {
    if (this.allSvgElements.length > this.svgNumberOnPage) {
      const difference: number = this.allSvgElements.length - this.svgNumberOnPage;
      const svgToRemove: Svg[] = this.allSvgElements.slice(-difference);
      svgToRemove.forEach((svg) => this.sportsIcons.element.removeChild(svg.svg));
    }
  }

  private checkServerData(sportTypes: string[]): void {
    const svgToRender: string[] = this.retrieveChosenSports(sportTypes);
    this.allSvgElements.forEach((svg) => {
      if (!svgToRender.includes(svg.svg.id)) {
        this.sportsIcons.element.removeChild(svg.svg);
        this.currentSvgElements = this.currentSvgElements.filter((currentSvg) => currentSvg !== svg);
      }
    });
  }

  private highlightCurrentIcon(): void {
    this.currentSvgElements.forEach((icon) => {
      icon.updateFillColor(ProjectColors.Grey);

      if (icon.svg.classList.contains('disabled')) {
        icon.svg.classList.remove('disabled');
      }
    });

    this.currentIcon = this.currentSvgElements[this.currentIconIndex];
    this.currentIcon.updateFillColor(ProjectColors.Turquoise);
    this.currentIcon.svg.classList.add('disabled');
    this.graph.updateCurrentSportIcon(this.currentIcon.svg.id);
  }

  private sportIconCallback = (e: Event): void => {
    this.currentSvgElements.forEach((icon) => {
      if (e.currentTarget === icon.svg) {
        this.currentIcon = icon;
        this.currentIconIndex = this.currentSvgElements.indexOf(icon);
        this.highlightCurrentIcon();
        this.updateSportActivityData();
      }
    });
  };

  private activateSportChanging = (): void => {
    this.isUpdate = true;
    if (this.noSportsMessage && this.isNoChoice) {
      this.sportsIcons.element.removeChild(this.noSportsMessage.element);
      this.isNoChoice = false;
    }
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.CloseThin, 'our-activity', ProjectColors.Grey);
    this.editBlock.appendOkButton(this.confirmChoiceCallback);
    this.makeAreaEditable();
    this.setSvgEventListeners();
    this.highlightAlreadyChosenSports();
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelSportChange, this.activateSportChanging);
  };

  private makeAreaEditable(): void {
    this.showAllSports();
    this.setCurrentSvgColorToDefault();
    // eslint-disable-next-line max-len
    this.activityIcons.element.insertBefore(this.chooseSportsHeading.element, this.iconsChoiceWrapper.element);
    this.allSvgElements.forEach((svg) => svg.svg.classList.remove('disabled'));
  }

  private showAllSports(): void {
    this.activityIcons.element.classList.add('highlighted');
    const missingSports: Svg[] = this.checkMissingSports();
    missingSports.forEach((sportSvg: Svg) => {
      this.sportsIcons.element.append(sportSvg.svg);
    });
  }

  private checkMissingSports(): Svg[] {
    this.putSvgInRightOrder();
    return this.allSvgElements.filter((svg: Svg) => this.currentSvgElements.indexOf(svg) === -1);
  }

  private setCurrentSvgColorToDefault(): void {
    this.allSvgElements.forEach((icon) => icon.updateFillColor(ProjectColors.Grey));
  }

  private setSvgEventListeners(): void {
    if (!this.isUpdate) {
      this.allSvgElements.forEach((icon) => icon.svg.addEventListener('click', this.sportIconCallback));
      this.allSvgElements.forEach((icon) => icon.svg.removeEventListener('click', this.chooseSportCallback));
    } else {
      this.allSvgElements.forEach((icon) => icon.svg.addEventListener('click', this.chooseSportCallback));
      this.allSvgElements.forEach((icon) => icon.svg.removeEventListener('click', this.sportIconCallback));
    }
  }

  private chooseSportCallback = (e: Event): void => {
    this.allSvgElements.forEach((icon) => {
      if (icon.svg === e.currentTarget) {
        if (!icon.svg.classList.contains('chosen-sport')) {
          this.checkCurrentChosenSportsNumber();
        }

        if (!icon.svg.classList.contains('disabled')) {
          this.updateCurrentSportsArray(icon);
          OurActivity.updateSportColor(icon);
        } else {
          icon.svg.classList.remove('disabled');
        }
      }
    });
  };

  private static updateSportColor(icon: Svg): void {
    if (icon.svg.classList.contains('chosen-sport')) {
      icon.updateFillColor(ProjectColors.Grey);
      icon.svg.classList.remove('chosen-sport');
    } else {
      icon.updateFillColor(ProjectColors.Orange);
      icon.svg.classList.add('chosen-sport');
    }
  }

  private highlightAlreadyChosenSports(): void {
    this.currentSvgElements.forEach((sport) => {
      sport.updateFillColor(ProjectColors.Orange);
      sport.svg.classList.add('chosen-sport');
    });
  }

  private updateCurrentSportsArray(svg: Svg): void {
    if (this.chosenSvgElements.includes(svg)) {
      const index: number = this.chosenSvgElements.indexOf(svg);
      this.chosenSvgElements.splice(index, 1);
      this.choosenSportsCounter -= 1;
    } else {
      this.chosenSvgElements.push(svg);
      this.choosenSportsCounter += 1;
    }
  }

  private checkCurrentChosenSportsNumber(): void {
    if (this.choosenSportsCounter === this.svgNumberOnPage) {
      this.chooseSportsHeading.textContent = this.dictionary.chooseSportHeadingError;
      setTimeout((): void => {
        this.chooseSportsHeading.textContent = this.dictionary.chooseSportHeadingMain;
      }, 1000);

      this.allSvgElements.forEach((icon) => {
        if (!icon.svg.classList.contains('chosen-sport')) {
          icon.svg.classList.add('disabled');
        }
      });
    } else {
      this.allSvgElements.forEach((icon) => {
        if (icon.svg.classList.contains('disabled')) {
          icon.svg.classList.remove('disabled');
        }
      });
    }
  }

  private cancelSportChange = (): void => {
    this.chosenSvgElements = this.currentSvgElements;
    this.resetSportChoiceArea(this.currentSvgElements);
    this.setCurrentSport();
    this.highlightCurrentIcon();
    this.choosenSportsCounter = this.chosenSvgElements.length;
  };

  private confirmChoiceCallback = (): void => {
    this.currentSvgElements = this.chosenSvgElements;
    this.choosenSportsCounter = this.currentSvgElements.length;

    if (this.chosenSvgElements.length !== 0) {
      this.resetSportChoiceArea(this.chosenSvgElements);
      this.appendNewSportSvg();
      this.setCurrentSport();
      this.highlightCurrentIcon();
    } else {
      this.showNoSportsMessage();
      this.resetSportChoiceArea(this.chosenSvgElements);
    }
    this.updateSportTyperChoiceOnServer(this.chosenSvgElements);
  };

  private resetSportChoiceArea(array: Svg[]): void {
    this.isUpdate = false;
    this.activityIcons.element.classList.remove('highlighted');
    this.editBlock.editBtn.replaceBtnSvg(SvgNames.Pencil, 'our-activity', ProjectColors.Grey);
    this.editBlock.removeOkButton();
    this.setCurrentSvgColorToDefault();
    this.removeUnnecessarySvg(array);
    // eslint-disable-next-line max-len
    this.editBlock.replaceUpdateBtnEventListener(this.isUpdate, this.cancelSportChange, this.activateSportChanging);
    this.activityIcons.element.removeChild(this.chooseSportsHeading.element);
    this.setSvgEventListeners();
  }

  private removeUnnecessarySvg(array: Svg[]): void {
    this.putSvgInRightOrder();
    // eslint-disable-next-line max-len
    const svgToRemove: Svg[] = this.allSvgElements.filter((svg) => !array.includes(svg));
    svgToRemove.forEach((svg: Svg) => {
      this.sportsIcons.element.removeChild(svg.svg);
    });
  }

  private appendNewSportSvg(): void {
    this.putSvgInRightOrder();
    // eslint-disable-next-line max-len
    const svgToAppend: Svg[] = this.allSvgElements.filter((svg) => this.chosenSvgElements.includes(svg));
    svgToAppend.forEach((svg: Svg) => {
      this.sportsIcons.element.append(svg.svg);
    });
  }

  private setCurrentSport(): void {
    if (this.currentIcon && !this.currentSvgElements.includes(this.currentIcon)) {
      this.currentIconIndex = 0;
    }
  }

  private putSvgInRightOrder(): void {
    // eslint-disable-next-line max-len
    this.chosenSvgElements.sort((a, b) => this.allSvgElements.indexOf(a) - this.allSvgElements.indexOf(b));
    // eslint-disable-next-line max-len
    this.currentSvgElements.sort((a, b) => this.allSvgElements.indexOf(a) - this.allSvgElements.indexOf(b));
  }

  private showNoSportsMessage(): void {
    this.isNoChoice = true;
    this.noSportsMessage = new BaseComponent(
      'h6',
      this.sportsIcons.element,
      'our-activity__icons_header',
      this.dictionary.noSports,
    );
  }

  private updateStats(): void {
    this.totalWeeklyKm.element.textContent = i18next.t(this.dictionary.km, { count: this.kmCounter });
    this.time.element.textContent = i18next.t(this.dictionary.hour, { count: this.hoursCounter });
    this.elevation.element.innerHTML = i18next.t(this.dictionary.meterArrow, { count: this.elevationCounter });
    this.totalYearlyKm.element.textContent = i18next.t(this.dictionary.km, { count: this.yearKmCounter });
  }

  private updateSportActivityData(): void {
    this.setValuesToNull();
    const activities: ActivityResponse[] = this.activities.filter(
      (record) => record.sport === `${this.currentIcon?.svg.id}`,
    );
    this.calculateStats(activities);
    this.graph.calculateDailyActivity(activities);
    this.updateStats();
  }

  private calculateStats(activities: ActivityResponse[]): void {
    const [currentMonday, currentSunday] = getFirstAndLastDaysOfWeek();

    const timeData: string[] = [];

    activities.forEach((activity) => {
      const date: Date = new Date(activity.date);
      const dateMs = date.getTime();

      if (dateMs <= currentSunday.getTime() && dateMs >= currentMonday.getTime()) {
        this.kmCounter += Number(activity.distance);
        timeData.push(activity.duration);
        this.elevationCounter += Number(activity.elevation);
      }
    });

    this.hoursCounter = OurActivity.calculateTotalTime(timeData);
    this.yearKmCounter = OurActivity.calculateYearDistance(activities);
  }

  private static calculateYearDistance(activities: ActivityResponse[]): number {
    const year: number = new Date().getFullYear();
    const yearStart: Date = new Date(year, 0, 1);
    const yearEnd: Date = new Date(year, 11, 31);

    let distance: number = 0;

    activities.forEach((activity) => {
      const date = new Date(activity.date);
      const dateMs = date.getTime();

      if (dateMs <= yearEnd.getTime() && dateMs >= yearStart.getTime()) {
        distance += Number(activity.distance);
      }
    });

    return distance;
  }

  private static calculateTotalTime(timings: string[]): number {
    const dividers: number[] = [3600, 60, 1];

    let totalSeconds: number = timings.reduce(
      (seconds, time) => time.split(':').reduce((sec, t, idx) => sec + Number(t) * dividers[idx], seconds),
      0,
    );

    const totalTime: string[] = dividers.map((divider) => {
      const hours: number = Math.floor(totalSeconds / divider);
      totalSeconds -= hours * divider;
      return hours.toString().padStart(2, '0');
    });

    return parseInt(totalTime[0], 10);
  }

  private setValuesToNull(): void {
    this.hoursCounter = 0;
    this.elevationCounter = 0;
    this.kmCounter = 0;
    this.yearKmCounter = 0;
  }

  private updateSportTyperChoiceOnServer(sports: Svg[]): void {
    this.sportTypesForServer = [];
    sports.forEach((sport) => this.sportTypesForServer.push(sport.svg.id));
    if (this.token) {
      updateUser(this.token, { sportTypes: this.sportTypesForServer }).catch(() => null);
    }
  }

  private retrieveChosenSports(sportTypes: string[]): string[] {
    const svgToRender: string[] = this.svgAllNames.filter((sport) => sportTypes.includes(sport));
    return svgToRender;
  }

  private updateStatsAfterDeletion(data: EventData): void {
    this.activities = this.activities.filter((activity) => activity.id !== data.activityId);
    this.updateSportActivityData();
  }
}
