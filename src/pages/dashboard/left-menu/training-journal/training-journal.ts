import BaseComponent from '../../../../components/base-component/base-component';
import './training-journal.css';

export default class TrainingJournal extends BaseComponent<'div'> {
  private heading = new BaseComponent('h4', this.element, 'training-journal__heading', 'последняя тренировка');

  public info = new BaseComponent('span', this.element, 'training-journal__info', 'тип и дата');

  public journalLink = new BaseComponent('a', this.element, 'training-journal__link', 'Ваш журнал тренировок', {
    href: '#',
  });

  constructor(parent: HTMLElement) {
    super('div', parent, 'training-journal');
  }
}
