import { ProjectColors } from '../../../utils/consts';
import SvgButton from '../button/svg-btn';
import SvgNames from '../svg/svg.types';

export default class EditBlock {
  public editBtn: SvgButton = new SvgButton(this.parent, '', `${this.prefix}_btn`);

  public okButton: SvgButton | undefined;

  constructor(private parent: HTMLElement, private prefix: string) {
    this.editBtn.appendSvg(SvgNames.Pencil, prefix, ProjectColors.Grey);
  }

  public appendOkButton(callback: () => void): void {
    this.okButton = new SvgButton(this.parent, '', `${this.prefix}_btn`);
    this.okButton.appendSvg(SvgNames.CheckThin, this.prefix, ProjectColors.Grey);
    this.parent.insertBefore(this.okButton.element, this.editBtn.element);
    this.okButton.element.addEventListener('click', callback);
  }

  public removeOkButton(): void {
    if (this.okButton) {
      this.parent.removeChild(this.okButton.element);
    }
  }
}
