import './add-activity.css';
import BaseComponent from '../../components/base-component/base-component';
import Button from '../../components/base-component/button/button';
import Select from '../../components/base-component/select/select';
import Input from '../../components/base-component/text-input-and-label/text-input';
import GoogleMaps from '../../map/google-maps';
import TextArea from '../../components/base-component/textarea/textarea';
import SvgNames from '../../components/base-component/svg/svg.types';

export default class AddActivity extends BaseComponent<'section'> {
  private formContainer = new BaseComponent('div', this.element, 'add-activity__container');

  private heading = new BaseComponent('h3', this.formContainer.element, 'add-activity__heading', 'Добавить тренировку');

  private formElement = new BaseComponent('form', this.formContainer.element, 'add-activity__form');

  private formFieldset = new BaseComponent('fieldset', this.formElement.element, 'add-activity__fieldset');

  private pathInfoBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block block-path');

  private distanceContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private distance = new Input(this.distanceContainer.element, 'add-activity__input input-distance', 'Дистанция (км)', {
    type: 'number',
  });

  private durationContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private durationHours = new Input(
    this.durationContainer.element,
    'add-activity__input input-hours',
    'Продолжительность',
    {
      type: 'number',
      placeholder: '01',
    },
  );

  private durationMinutes = new Input(this.durationContainer.element, 'add-activity__input input-minutes', '', {
    type: 'number',
    placeholder: '00',
  });

  private durationSeconds = new Input(this.durationContainer.element, 'add-activity__input input-seconds', '', {
    type: 'number',
    placeholder: '00',
  });

  private elevationContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private elevation = new Input(this.elevationContainer.element, 'add-activity__input input-elevation', 'Высота (м)', {
    type: 'number',
  });

  private trainingBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block', '');

  private trainingContainer = new BaseComponent(
    'div',
    this.trainingBlock.element,
    'add-activity__block-container block-training',
  );

  private trainingLabel = new BaseComponent(
    'label',
    this.trainingContainer.element,
    'add-activity__label',
    'Тип тренировки',
    { for: 'training' },
  );

  private training = new Select(
    this.trainingContainer.element,
    ['Бег', 'Хайкинг', 'Прогулка', 'Велосипед'],
    'add-activity__input input-training',
    false,
    { id: 'training' },
  );

  private dateContainer = new BaseComponent('div', this.trainingBlock.element, 'add-activity__block-container');

  private date = new Input(this.dateContainer.element, 'add-activity__input input-date', 'Дата и время', {
    type: 'date',
  });

  private time = new Input(this.dateContainer.element, 'add-activity__input input-time', '', {
    type: 'time',
  });

  private searchContainer = new BaseComponent('div', this.trainingBlock.element, 'add-activity__block');

  private search = new Input(
    this.searchContainer.element,
    'add-activity__input input-search',
    'Совместная тренировка',
    {
      type: 'search',
    },
  );

  private titleBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block', '');

  private titleContainer = new BaseComponent('div', this.titleBlock.element, 'add-activity__block-container');

  private title = new Input(this.titleContainer.element, 'add-activity__input input-title', 'Название тренировки', {
    type: 'text',
    placeholder: 'Утренний забег',
  });

  private descriptionBlock = new BaseComponent(
    'div',
    this.formFieldset.element,
    'add-activity__block description-block',
    '',
  );

  private descriptionContainer = new BaseComponent(
    'div',
    this.descriptionBlock.element,
    'add-activity__block-container',
  );

  private description = new TextArea(
    this.descriptionContainer.element,
    'add-activity__input input-description',
    'Описание тренировки',
    {
      type: 'textarea',
      maxlength: '1000',
      rows: '4',
      placeholder: 'Расскажите, как прошла тренировка.',
    },
  );

  private mapBlock = new BaseComponent('div', this.formFieldset.element, 'map_container add-activity__block', '');

  private mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.mapBlock.element, 'map', '', { id: 'map' });

  private map = new GoogleMaps(
    this.mapDiv.element,
    'map add-activity-map',
    8,
    { lat: -33.397, lng: 150.644 },
    google.maps.TravelMode.BICYCLING,
  );

  public saveButton = new Button(this.formElement.element, 'Сохранить', 'btn-activity');

  constructor(parent: HTMLElement) {
    super('section', parent, 'add-activity add-activity-section');
    this.search.addSvgIcon(SvgNames.Search, '#000000', 'search');
  }
}
