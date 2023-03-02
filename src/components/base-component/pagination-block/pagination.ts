import './pagination.css';
import BaseComponent from '../base-component';
import Svg from '../svg/svg';
import Button from '../button/button';
import SvgNames from '../svg/svg.types';
import { ProjectColors } from '../../../utils/consts';

export default class Pagination extends BaseComponent<'div'> {
  public leftArrowBtn!: BaseComponent<'button'>;

  public rightArrowBtn!: BaseComponent<'button'>;

  public currentPageElement!: BaseComponent<'span'>;

  public currentPage: number = 1;

  public totalPages: number = 1;

  public itemsPerPage: number = 4;

  private classes: string;

  private leftSvgContainer!: Button;

  private leftSvg!: Svg;

  private rightSvgContainer!: Button;

  private rightSvg!: Svg;

  private elementsCount: number;

  constructor(parent: BaseComponent<'div'>, classes: string, page: number, limit: number, elementCounts: number) {
    super('div', parent.element, `${classes} pagination`);
    this.currentPage = page;
    this.itemsPerPage = limit;
    this.elementsCount = elementCounts;
    this.countTheTotal();
    this.classes = classes;
    this.render();
    this.disableArrowsFirstLastPage(this.currentPage);
  }

  private countTheTotal(): void {
    if (this.elementsCount === 0) {
      this.totalPages = 1;
    } else {
      this.totalPages = Math.ceil(this.elementsCount / this.itemsPerPage);
    }
  }

  private render(): void {
    this.leftArrowBtn = new Button(this.element, '', 'left-svg__block');
    this.leftSvg = new Svg(this.leftArrowBtn.element, SvgNames.PaginationLeft, ProjectColors.White, 'left-svg');
    this.currentPageElement = new BaseComponent(
      'span',
      this.element,
      `${this.classes}__current-page`,
      `${this.currentPage} / ${this.totalPages}`,
    );
    this.rightArrowBtn = new Button(this.element, '', 'right-svg__block');
    this.rightSvg = new Svg(this.rightArrowBtn.element, SvgNames.PaginationRight, ProjectColors.White, 'right-svg');
    this.updateCurrentPage(this.currentPage);
    this.updateTotalPages(this.totalPages);
  }

  public updateCurrentPage(page: number): void {
    this.currentPage = page;
    this.updatePages();
  }

  public updateTotalPages(page: number): void {
    this.totalPages = page;
    if (this.totalPages !== this.currentPage) {
      this.enableRightArrowBtn();
    }
    if (this.totalPages === 1) {
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

  public disableArrowsFirstLastPage(page: number): void {
    if (page === 1) {
      this.disableLeftArrowBtn();
    }
    if (page === this.totalPages) {
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
