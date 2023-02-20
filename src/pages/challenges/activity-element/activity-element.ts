/* eslint-disable max-len */
import BaseComponent from '../../../components/base-component/base-component';
import Svg from '../../../components/base-component/svg/svg';
import { ProjectColors } from '../../../utils/consts';

export default class ActivityBlock extends BaseComponent<'div'> {
  private svg: string;

  private activityText: string;

  private activityIcon!: Svg;

  private activityParagraph!: BaseComponent<'p'>;

  private activityIconWrapper!: BaseComponent<'div'>;

  private additionalClasses: string | undefined;

  public challengeName: string;

  constructor(
    parent: HTMLElement,
    svg: string,
    text: string,
    additionalClasses?: string,
    attributes?: {
      [key: string]: string;
    },
  ) {
    super('div', parent, additionalClasses, '', attributes);
    this.svg = svg;
    this.challengeName = text.toLowerCase();
    this.activityText = text;
    this.additionalClasses = additionalClasses;
    this.renderActivity();
    this.addListeners();
  }

  private renderActivity(): void {
    this.activityIconWrapper = new BaseComponent('div', this.element, 'challenges-activity__svg-wrapper', '');
    this.activityIcon = new Svg(
      this.activityIconWrapper.element,
      this.svg,
      ProjectColors.Grey,
      `${this.svg}-icon challenges-activity__svg`,
    );
    this.activityParagraph = new BaseComponent(
      'p',
      this.element,
      'challenges-activity__text-type',
      `${this.activityText}`,
    );
  }

  private addListeners(): void {
    this.element.addEventListener('click', (): void => {
      if (this.activityIcon.svgColor === ProjectColors.Grey) {
        this.activityIcon.updateFillColor(ProjectColors.Orange);
        this.activityParagraph.element.style.color = ProjectColors.Orange;
        this.element.style.border = `1px solid ${ProjectColors.Orange}`;
      } else {
        this.activityIcon.updateFillColor(ProjectColors.Grey);
        this.activityParagraph.element.style.color = ProjectColors.Grey;
        this.element.style.border = `1px solid ${ProjectColors.Grey}`;
      }
    });
  }
}
