import './new-route-page.css';
import BaseComponent from '../../components/base-component/base-component';
import Input from '../../components/base-component/text-input-and-label/text-input';
import Select from '../../components/select/select';
import Button from '../../components/base-component/button/button';
import MapParameter from './map-parameter/map-parameter';

export default class NewRoutePage extends BaseComponent<'section'> {
  private heading = new BaseComponent('h3', this.element, 'new-route-page__heading', 'Добавить Маршрут');

  private optionsContainer = new BaseComponent('div', this.element, 'new-route-page__options');

  public search = new Input(this.optionsContainer.element, 'new-route-page__search', '', {
    type: 'text',
    placeholder: 'Введите названия места или нажмите на карту',
  });

  public routeType = new Select(
    this.optionsContainer.element,
    ['тип маршрута', 'пеший', 'лисапед'],
    'new-route-page__select',
  );

  private buttonContainer = new BaseComponent('div', this.optionsContainer.element, 'new-route-page__buttons');

  public reverseButton = new Button(this.buttonContainer.element, '', 'btn_reverse');

  public deleteButton = new Button(this.buttonContainer.element, '', 'btn_delete');

  public saveButton = new Button(this.buttonContainer.element, 'Сохранить', 'btn');

  public map = new BaseComponent('div', this.element, 'new-route-page__map', '', { id: 'map' });

  private mapParameters = new BaseComponent('div', this.element, 'new-route-page__map-parameters');

  public vehicleType = new MapParameter(this.mapParameters.element);

  public distance = new MapParameter(this.mapParameters.element, 'Расстояние');

  public ascent = new MapParameter(this.mapParameters.element, 'Набор высоты');

  public descent = new MapParameter(this.mapParameters.element, 'Высота спуска');

  public time = new MapParameter(this.mapParameters.element, 'Прим. чистое время');

  public roadType = new MapParameter(this.mapParameters.element, 'Тип дороги');

  public routeName = new Input(this.element, 'new-route-page__input', 'Название маршрута (обязательно)', {
    type: 'text',
  });

  public routeDescription = new Input(this.element, 'new-route-page__input', 'Описание', { type: 'text' });

  constructor(parent: HTMLElement) {
    super('section', parent, 'new-route-page');
    this.setVehicleName('Велосипед');
    this.setParameters();
  }

  private setVehicleName(name: string): void {
    this.vehicleType.name = name;
  }

  private setParameters(): void {
    this.distance.value = '0,00 км';
    this.ascent.value = '0 м';
    this.descent.value = '0 м';
    this.time.value = '0 с';
    this.roadType.value = 'дорога с покрытием';
  }
}
