import BaseComponent from '../../../../components/base-component/base-component';
import './add-route.css';

export default class AddRouteLink extends BaseComponent<'a'> {
  constructor(parent: HTMLElement) {
    super('a', parent, 'add-route-link', 'Добавить Новый Маршрут', { href: '#' });
  }
}
