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
      ProjectColors.Turquoise,
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
    this.element.addEventListener('click', () => {
      const orange = ProjectColors.Orange;
      const turquoise = ProjectColors.Turquoise;
      // eslint-disable-next-line max-len
      this.activityIcon.updateFillColor(this.activityIcon.svgColor === turquoise ? orange : turquoise);
    });
  }
}
