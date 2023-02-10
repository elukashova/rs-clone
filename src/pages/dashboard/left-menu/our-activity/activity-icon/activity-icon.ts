import './activity-icon.css';
import BaseComponent from '../../../../../components/base-component/base-component';

export default class ActivityIcon extends BaseComponent<'img'> {
  constructor(parent: HTMLElement, icon: string) {
    super('img', parent, 'activity-icon', '', { src: icon });
  }
}
