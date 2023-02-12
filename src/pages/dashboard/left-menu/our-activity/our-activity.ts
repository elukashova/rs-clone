import './our-activity.css';
import BaseComponent from '../../../../components/base-component/base-component';
import ActivityGraph from './activity-graph/activity-graph';
import Svg from '../../../../components/base-component/svg/svg';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../../utils/consts';
import EditBlock from '../../../../components/base-component/edit-block/edit-block';

export default class OurActivity extends BaseComponent<'div'> {
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
    'This week',
  );

  private totalWeeklyKm: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.weekHeaderWrapper.element,
    'our-activity__week-km',
    '0 km',
  );

  private chooseSportsHeading: BaseComponent<'h6'> = new BaseComponent(
    'h6',
    undefined,
    'our-activity__icons_header',
    'Choose your sports',
  );

  private statistics = new BaseComponent('div', this.element, 'our-activity__statistics');

  private graph = new ActivityGraph(this.statistics.element);

  private timeAndStepContainer = new BaseComponent('div', this.statistics.element, 'our-activity__time-container');

  private time = new BaseComponent('span', this.timeAndStepContainer.element, 'our-activity__time');

  private steps = new BaseComponent('span', this.timeAndStepContainer.element, 'our-activity__steps');

  private yearHeaderWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'our-activity__year-wrapper',
  );

  private yearHeader: BaseComponent<'h4'> = new BaseComponent(
    'h4',
    this.yearHeaderWrapper.element,
    'our-activity__year-header',
    'This year',
  );

  private totalYearlyKm: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.yearHeaderWrapper.element,
    'our-activity__year-km',
    '0 km',
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

  constructor(parent: HTMLElement) {
    super('div', parent, 'our-activity');
    this.setTimeAndSteps('0 hr', '0 steps');
    this.renderSportSVGs();
    this.checkPageLimit();
    this.highlightCurrentIcon();
    this.setSvgEventListeners();
    this.editBlock.editBtn.element.addEventListener('click', this.activateSportChanging);
  }

  public setTimeAndSteps(time: string, steps: string): void {
    this.time.element.textContent = time;
    this.steps.element.textContent = steps;
  }

  private renderSportSVGs(): void {
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
      // eslint-disable-next-line max-len
      const svgToRemove: Svg[] = this.allSvgElements.slice(-difference);
      svgToRemove.forEach((svg) => this.sportsIcons.element.removeChild(svg.svg));
    }
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
      }
    });
  };

  private activateSportChanging = (): void => {
    this.isUpdate = true;
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
    // eslint-disable-next-line max-len
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
    // eslint-disable-next-line max-len
    const chosenSports: Svg[] = this.currentSvgElements.filter((svg) => this.allSvgElements.includes(svg));
    chosenSports.forEach((sport) => {
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
      this.chooseSportsHeading.element.textContent = 'Please, choose max 3 sports';
      setTimeout((): void => {
        this.chooseSportsHeading.element.textContent = 'Choose your sports';
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
    this.resetSportChoiceArea(this.currentSvgElements);
    this.chosenSvgElements = this.currentSvgElements;
    this.setCurrentSport();
    this.highlightCurrentIcon();
  };

  private confirmChoiceCallback = (): void => {
    this.resetSportChoiceArea(this.chosenSvgElements);
    this.appendNewSportSvg();
    this.currentSvgElements = this.chosenSvgElements;
    this.setCurrentSport();
    this.highlightCurrentIcon();
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
    // eslint-disable-next-line max-len
    const svgToRemove: Svg[] = this.allSvgElements.filter((svg) => !array.includes(svg));
    svgToRemove.forEach((svg: Svg) => {
      this.sportsIcons.element.removeChild(svg.svg);
    });
  }

  private appendNewSportSvg(): void {
    // eslint-disable-next-line max-len
    const svgToAppend: Svg[] = this.allSvgElements.filter((svg) => this.chosenSvgElements.includes(svg));
    svgToAppend.forEach((svg: Svg) => {
      this.sportsIcons.element.append(svg.svg);
      this.currentSvgElements.push(svg);
    });
  }

  private setCurrentSport(): void {
    if (this.currentIcon && !this.currentSvgElements.includes(this.currentIcon)) {
      this.currentIconIndex = 0;
    }
  }
}
