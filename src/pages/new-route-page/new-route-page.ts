import './new-route-page.css';
import BaseComponent from '../../components/base-component/base-component';
import Input from '../../components/base-component/text-input-and-label/text-input';
import Select from '../../components/base-component/select/select';
import Button from '../../components/base-component/button/button';
import MapParameter from './map-parameter/map-parameter';

export default class NewRoutePage extends BaseComponent<'section'> {
  private heading = new BaseComponent('h2', this.element, 'new-route-page__heading titles', 'Add route');

  private optionsContainer = new BaseComponent('div', this.element, 'new-route-page__options');

  public search = new Input(this.optionsContainer.element, 'new-route-page__search', '', {
    type: 'text',
    placeholder: 'Enter the name of the place or click on the map',
  });

  public routeType = new Select(
    this.optionsContainer.element,
    ['Route type', 'walking', 'cycling'],
    'new-route-page__select',
  );

  private buttonContainer = new BaseComponent('div', this.optionsContainer.element, 'new-route-page__buttons');

  public reverseButton = new Button(this.buttonContainer.element, '', 'btn_reverse');

  public deleteButton = new Button(this.buttonContainer.element, '', 'btn_delete');

  public saveButton = new Button(this.buttonContainer.element, 'Save', 'btn');

  public map = new BaseComponent('div', this.element, 'new-route-page__map', '', { id: 'map' });

  private mapParameters = new BaseComponent('div', this.element, 'new-route-page__map-parameters');

  public vehicleType = new MapParameter(this.mapParameters.element);

  public distance = new MapParameter(this.mapParameters.element, 'Distance');

  public ascent = new MapParameter(this.mapParameters.element, 'Ascent');

  public descent = new MapParameter(this.mapParameters.element, 'Descent');

  public time = new MapParameter(this.mapParameters.element, 'Duration');

  public roadType = new MapParameter(this.mapParameters.element, 'Road type');

  public routeName = new Input(this.element, 'new-route-page__input', 'Route name', {
    type: 'text',
    required: 'required',
  });

  public routeDescription = new Input(this.element, 'new-route-page__input', 'Description', { type: 'text' });

  constructor(parent: HTMLElement) {
    super('section', parent, 'new-route-page');
    this.setVehicleName('Bicycle');
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
    this.roadType.value = 'paved road';
  }
}
