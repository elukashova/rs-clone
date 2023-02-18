import './new-route-page.css';
import BaseComponent from '../../components/base-component/base-component';
import Input from '../../components/base-component/text-input-and-label/text-input';
import Select from '../../components/base-component/select/select';
import Button from '../../components/base-component/button/button';
import MapParameter from './map-parameter/map-parameter';

export default class NewRoutePage extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    heading: 'newRoute.heading',
    addRoute: 'newRoute.addRoute',
    searchPlaceholder: 'newRoute.searchPlaceholder',
    saveBtn: 'newRoute.saveBtn',
    distance: 'newRoute.distance',
    ascent: 'newRoute.ascent',
    descent: 'newRoute.descent',
    duration: 'newRoute.duration',
    roadType: 'newRoute.roadType',
    routeName: 'newRoute.routeName',
    description: 'newRoute.description',
  };

  private heading = new BaseComponent('h3', this.element, 'new-route-page__heading', this.dictionary.heading);

  private optionsContainer = new BaseComponent('div', this.element, 'new-route-page__options');

  public search = new Input(this.optionsContainer.element, 'new-route-page__search', '', {
    type: 'text',
    placeholder: 'Enter the name of the place or click on the map', // не будет работать
  });

  public routeType = new Select(
    this.optionsContainer.element,
    ['Route type', 'walking', 'cycling'],
    'new-route-page__select',
  );

  private buttonContainer = new BaseComponent('div', this.optionsContainer.element, 'new-route-page__buttons');

  public reverseButton = new Button(this.buttonContainer.element, '', 'btn_reverse');

  public deleteButton = new Button(this.buttonContainer.element, '', 'btn_delete');

  public saveButton = new Button(this.buttonContainer.element, this.dictionary.saveBtn, 'btn');

  public map = new BaseComponent('div', this.element, 'new-route-page__map', '', { id: 'map' });

  private mapParameters = new BaseComponent('div', this.element, 'new-route-page__map-parameters');

  public vehicleType = new MapParameter(this.mapParameters.element);

  public distance = new MapParameter(this.mapParameters.element, this.dictionary.distance);

  public ascent = new MapParameter(this.mapParameters.element, this.dictionary.ascent);

  public descent = new MapParameter(this.mapParameters.element, this.dictionary.descent);

  public time = new MapParameter(this.mapParameters.element, this.dictionary.duration);

  public roadType = new MapParameter(this.mapParameters.element, this.dictionary.roadType);

  public routeName = new Input(this.element, 'new-route-page__input', this.dictionary.routeName, {
    type: 'text',
    required: 'required',
  });

  public routeDescription = new Input(this.element, 'new-route-page__input', this.dictionary.description, {
    type: 'text',
  });

  constructor(parent: HTMLElement) {
    super('section', parent, 'new-route-page');
    this.setVehicleName('Bicycle');
    this.setParameters();
  }

  private setVehicleName(name: string): void {
    this.vehicleType.name = name;
  }

  private setParameters(): void {
    this.distance.value = '0,00 km';
    this.ascent.value = '0 m';
    this.descent.value = '0 m';
    this.time.value = '0 s';
    this.roadType.value = 'paved road';
  } // не будет работать
}
