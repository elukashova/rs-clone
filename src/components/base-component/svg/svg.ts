export default class Svg {
  public svg: Element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  public svgColor: string;

  constructor(parent: Element, iconName: string, color: string, className: string) {
    this.svgColor = color;
    this.renderSVG(parent, iconName, className);
    this.updateFillColor(color);
  }

  private renderSVG(parent: Element, iconName: string, className: string): void {
    parent.append(this.svg);
    const svgUseElement: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseElement.setAttribute('href', `assets/icons/svg/sprite.svg#${iconName}`);
    this.svg.classList.add(...className.split(' '));
    this.svg.append(svgUseElement);
  }

  public updateFillColor(color: string): void {
    this.svg.setAttribute('fill', `${color}`);
    this.svgColor = color;
  }

  public updateStrokeColor(color: string): void {
    this.svg.setAttribute('stroke', `${color}`);
    this.svgColor = color;
  }

  public replaceSVG(parent: Element, child: Element): void {
    parent.replaceChild(child, this.svg);
  }
}
