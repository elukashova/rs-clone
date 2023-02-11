export default class Svg {
  public svg: Element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  constructor(parent: Element, iconName: string, color: string, className: string) {
    this.renderSVG(parent, iconName, className);
    this.updateFillColor(color);
  }

  private renderSVG(parent: Element, iconName: string, className: string): void {
    parent.append(this.svg);
    const svgUseElement: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseElement.setAttribute('href', `assets/icons/svg/sprite.svg#${iconName}`);
    this.svg.classList.add(`${className}`);
    this.svg.append(svgUseElement);
  }

  public updateFillColor(color: string): void {
    this.svg.setAttribute('fill', `${color}`);
  }

  public updateStrokeColor(color: string): void {
    this.svg.setAttribute('stroke', `${color}`);
  }

  public replaceSVG(parent: Element, child: Element): void {
    parent.replaceChild(child, this.svg);
  }
}
