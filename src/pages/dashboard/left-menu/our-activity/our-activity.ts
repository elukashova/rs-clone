import './our-activity.css';
import BaseComponent from '../../../../components/base-component/base-component';
import ActivityGraph from './activity-graph/activity-graph';
import Svg from '../../../../components/base-component/svg/svg';
import SvgNames from '../../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../../utils/consts';
import EditBlock from '../../../../components/base-component/edit-block/edit-block';

export default class OurActivity extends BaseComponent<'div'> {
  private activityIcons: BaseComponent<'div'> = new BaseComponent('div', this.element, 'our-activity__icons');

  private sportsIcons: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.activityIcons.element,
    'our-activity__icons-wrapper',
  );

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

  private editBlock: EditBlock = new EditBlock(this.activityIcons.element, 'our-activity');

  private svgNumberOnPageOnPage: number = 3;

  // eslint-disable-next-line max-len
  private svgAllNames: SvgNames[] = [SvgNames.Hiking, SvgNames.Running, SvgNames.Walking, SvgNames.Cycling];

  private svgNamesDefault: SvgNames[] = [SvgNames.Running, SvgNames.Cycling, SvgNames.Walking];

  private allSvgElements: Svg[] = [];

  private currentIconIdx: number = 0;

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

  constructor(parent: HTMLElement) {
    super('div', parent, 'our-activity');
    this.setTimeAndSteps('0 hr', '0 steps');
    this.renderSportSVGs();
    this.highlightCurrentIcon();
    this.allSvgElements.forEach((icon) => icon.svg.addEventListener('click', this.sportIconCallback));
    this.editBlock.editBtn.element.addEventListener('click', this.activateSportChanging);
  }

  public setTimeAndSteps(time: string, steps: string): void {
    this.time.element.textContent = time;
    this.steps.element.textContent = steps;
  }

  private renderSportSVGs(): void {
    for (let i: number = 0; i < this.svgNumberOnPageOnPage; i += 1) {
      const svg: Svg = new Svg(this.sportsIcons.element, this.svgNamesDefault[i], '#949494', 'our-activity__svg');
      svg.svg.setAttribute('id', this.svgNamesDefault[i]);
      this.allSvgElements.push(svg);
    }
  }

  private highlightCurrentIcon(): void {
    this.allSvgElements.forEach((icon) => {
      if (icon.svg.classList.contains('disabled')) {
        icon.svg.classList.remove('disabled');
        icon.updateFillColor(ProjectColors.Grey);
      }
    });

    this.allSvgElements[this.currentIconIdx].updateFillColor(ProjectColors.Turquoise);
    this.allSvgElements[this.currentIconIdx].svg.classList.add('disabled');
    this.graph.updateCurrentSportIcon(this.allSvgElements[this.currentIconIdx].svg.id);
  }

  private sportIconCallback = (e: Event): void => {
    this.allSvgElements.forEach((icon) => {
      if (e.currentTarget === icon.svg) {
        this.currentIconIdx = this.allSvgElements.indexOf(icon);
        this.highlightCurrentIcon();
      }
    });
  };

  private activateSportChanging = (): void => {
    // this.appendOkButton(SvgNames.CloseThin);
    console.log(this.graph);
  };

  // private appendOkButton(name: string): void {
  //   this.updateOkBtn = new Button(this.element, '', `${this.classes}_btn-update`);
  //   this.updateOkBtnSVG =
  // new Svg(this.updateOkBtn.element, name, '#949494', `${this.classes}_btn-update_svg`);
  //   this.element.insertBefore(this.updateOkBtn.element, this.updateBtn.element);
  //   this.updateOkBtn.element.addEventListener('click', this.updateOkButtonCallback);
  // }
}
