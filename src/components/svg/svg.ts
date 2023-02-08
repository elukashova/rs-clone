export default class Svg {
  public svg: Element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  constructor(iconName: string) {
    this.renderSVG(iconName);
  }

  private renderSVG(iconName: string): void {
    const svgUseElement: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseElement.setAttribute('href', `assets/icons/svg/sprite.svg#${iconName}`);
    this.svg.classList.add(`${iconName}-icon`);
    this.svg.append(svgUseElement);
  }

  public updateColor(color: string): void {
    this.svg.setAttribute('fill', `${color}`);
  }

  public replaceSVG(parent: Element, child: Element): void {
    parent.replaceChild(this.svg, child);
  }
}
