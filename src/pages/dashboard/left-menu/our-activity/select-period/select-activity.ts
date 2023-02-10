import BaseComponent from '../../../../../components/base-component/base-component';
import './select-period.css';

export default class SelectPeriod extends BaseComponent<'select'> {
  public today = new BaseComponent('option', this.element, '', 'сегодня');

  public week = new BaseComponent('option', this.element, '', 'на этой неделе');

  public month = new BaseComponent('option', this.element, '', 'в этом месяце');

  public year = new BaseComponent('option', this.element, '', 'в этом году');

  constructor(parent: HTMLElement) {
    super('select', parent, 'our-activity__period');
  }
}
