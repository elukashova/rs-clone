import { ProjectColors } from '../../../utils/consts';
import Svg from '../svg/svg';
import Button from './button';

export default class SvgButton extends Button {
  // eslint-disable-next-line max-len
  private svg: Svg | undefined;

  public appendSvg(name: string, prefix: string, color: ProjectColors): void {
    this.svg = new Svg(this.element, name, color, `${prefix}_btn_svg`);
  }

  public replaceBtnSvg(name: string, prefix: string, color: ProjectColors): void {
    const newSvg: Svg = new Svg(this.element, name, color, `${prefix}_btn_svg`);
    if (this.svg) {
      this.svg.replaceSVG(this.element, newSvg.svg);
    }
    this.svg = newSvg;
  }
}
