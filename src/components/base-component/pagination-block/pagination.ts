import './pagination.css';
import BaseComponent from '../base-component';
import Svg from '../svg/svg';
import Button from '../button/button';
import SvgNames from '../svg/svg.types';
import { ProjectColors } from '../../../utils/consts';

export default class Pagination extends BaseComponent<'div'> {
  public leftArrowBtn: BaseComponent<'button'> | null = null;

  public rightArrowBtn: BaseComponent<'button'> | null = null;

  public currentPageElement: BaseComponent<'span'> | null = null;

  public currentPage: number = 1;

  public totalPages: number = 0;

  public itemsPerPage: number = 5;

  private classes: string;

  private leftSvgContainer!: Button;

  private leftSvg!: Svg;

  private rightSvgContainer!: Button;

  private rightSvg!: Svg;

  constructor(parent: BaseComponent<'div'>, classes: string, page: number, limit: number, totalPages: number) {
    super('div', parent.element, `${classes} pagination`);
    this.currentPage = page;
    this.itemsPerPage = limit;
    this.totalPages = totalPages;
    this.classes = classes;
    this.render();
    this.disableArrowsFirstLastPage(this.currentPage);
  }

  private render(): void {
    this.leftSvgContainer = new Button(this.element, '', 'left-svg__block');
    this.leftSvg = new Svg(this.leftSvgContainer.element, SvgNames.PaginationLeft, ProjectColors.White, 'left-svg');
    this.currentPageElement = new BaseComponent(
      'span',
      this.element,
      `${this.classes}__current-page`,
      `${this.currentPage}`,
    );
    this.rightSvgContainer = new Button(this.element, '', 'right-svg__block');
    this.rightSvg = new Svg(this.rightSvgContainer.element, SvgNames.PaginationRight, ProjectColors.White, 'right-svg');
  }

  public updateCurrentPage(num: number): void {
    this.currentPage = num;
    this.updatePages();
  }

  public updateTotalPages(num: number): void {
    this.totalPages = num;
    if (this.totalPages !== this.currentPage) {
      this.enableRightArrowBtn();
    }
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
    this.updatePages();
  }

  private updatePages(): void {
    if (this.currentPageElement) {
      this.currentPageElement.element.textContent = `${this.currentPage} / ${this.totalPages}`;
    }
  }

  public calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this.itemsPerPage);
  }

  public disableArrowsFirstLastPage(num: number): void {
    if (num === 1) {
      this.disableLeftArrowBtn();
    }
    if (num === this.totalPages) {
      this.disableRightArrowBtn();
    }
  }

  public enableRightArrowBtn(): void {
    if (this.rightArrowBtn?.element.hasAttribute('disabled')) {
      this.rightArrowBtn.element.removeAttribute('disabled');
    }
  }

  public enableLeftArrowBtn(): void {
    if (this.leftArrowBtn?.element.hasAttribute('disabled')) {
      this.leftArrowBtn.element.removeAttribute('disabled');
    }
  }

  public disableRightArrowBtn(): void {
    if (!this.rightArrowBtn?.element.hasAttribute('disabled')) {
      this.rightArrowBtn?.element.setAttribute('disabled', '');
    }
  }

  public disableLeftArrowBtn(): void {
    if (!this.leftArrowBtn?.element.hasAttribute('disabled')) {
      this.leftArrowBtn?.element.setAttribute('disabled', '');
    }
  }
}
