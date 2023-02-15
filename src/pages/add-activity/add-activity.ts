/* eslint-disable max-len */
import './add-activity.css';
import BaseComponent from '../../components/base-component/base-component';
import Button from '../../components/base-component/button/button';
import Select from '../../components/base-component/select/select';
import Input from '../../components/base-component/text-input-and-label/text-input';
import TextArea from '../../components/base-component/textarea/textarea';
import SvgNames from '../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../utils/consts';
import GoogleMaps from '../../map/google-maps';
import { Activity, Token } from '../../app/loader/loader.types';
import { createActivity } from '../../app/loader/services/activity-services';
import { checkDataInLocalStorage } from '../../utils/local-storage';

export default class AddActivity extends BaseComponent<'section'> {
  private formContainer = new BaseComponent('div', this.element, 'add-activity__container');

  private heading = new BaseComponent('h3', this.formContainer.element, 'add-activity__heading', 'Add activity');

  private formElement = new BaseComponent('form', this.formContainer.element, 'add-activity__form');

  private formFieldset = new BaseComponent('fieldset', this.formElement.element, 'add-activity__fieldset');

  private pathInfoBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block block-path');

  private distanceContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private distance = new Input(this.distanceContainer.element, 'add-activity__input input-distance', 'Distance (km)', {
    type: 'number',
  });

  private durationContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private durationHours = new Input(this.durationContainer.element, 'add-activity__input input-hours', 'Duration', {
    type: 'number',
    placeholder: '01',
    value: '01',
  });

  private durationMinutes = new Input(this.durationContainer.element, 'add-activity__input input-minutes', '', {
    type: 'number',
    placeholder: '00',
    value: '00',
  });

  private durationSeconds = new Input(this.durationContainer.element, 'add-activity__input input-seconds', '', {
    type: 'number',
    placeholder: '00',
    value: '00',
  });

  private elevationContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private elevation = new Input(
    this.elevationContainer.element,
    'add-activity__input input-elevation',
    'Elevation (m)',
    {
      type: 'number',
      value: '0',
    },
  );

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
    'Type of activity',
    { for: 'training' },
  );

  private training = new Select(
    this.trainingContainer.element,
    ['Walking', 'Running', 'Hiking', 'Cycling'],
    'add-activity__input input-training',
    false,
    { id: 'training' },
  );

  private dateContainer = new BaseComponent('div', this.trainingBlock.element, 'add-activity__block-container');

  private date = new Input(this.dateContainer.element, 'add-activity__input input-date', 'Date and time', {
    type: 'date',
  });

  private time = new Input(this.dateContainer.element, 'add-activity__input input-time', '', {
    type: 'time',
  });

  private searchContainer = new BaseComponent('div', this.trainingBlock.element, 'add-activity__block');

  private search = new Input(this.searchContainer.element, 'add-activity__input input-search', 'Train together', {
    type: 'search',
  });

  private titleBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block', '');

  private titleContainer = new BaseComponent('div', this.titleBlock.element, 'add-activity__block-container');

  private title = new Input(this.titleContainer.element, 'add-activity__input input-title', 'Name of activity', {
    type: 'text',
    placeholder: ' Morning walk',
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
    'Description',
    {
      type: 'textarea',
      maxlength: '1000',
      rows: '4',
      placeholder: "How'd it go? Share more about your activity!",
    },
  );

  private mapBlock = new BaseComponent('div', this.formFieldset.element, 'map_container add-activity__block', '');

  private mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.mapBlock.element, 'map', '', { id: 'map' });

  private map = new GoogleMaps(
    this.mapDiv.element,
    'map add-activity-map',
    { lat: -33.397, lng: 150.644 },
    google.maps.TravelMode.WALKING,
    true,
  );

  public saveButton = new Button(this.formElement.element, 'Save', 'btn-activity');

  private data: Activity = {
    time: '',
    date: '',
    title: '',
    elevation: '',
    duration: '',
    sport: '',
    travelMode: 'travelMode',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  constructor(parent: HTMLElement) {
    super('section', parent, 'add-activity add-activity-section');
    this.search.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    this.addListeners();
    this.sendData();
    /* this.map.doDirectionRequest(
      { lat: -33.397, lng: 150.644 },
      { lat: -33.393, lng: 150.641 },
      google.maps.TravelMode.WALKING,
    );
    google.maps.event.clearInstanceListeners(this.map);
    this.map.doMapRequired(); */
  }

  private collectActivityData(): void {
    if (this.distance.inputValue) this.data.distance = this.distance.inputValue;
    this.data.duration = this.setDuration();
    this.data.elevation = this.elevation.inputValue;
    this.data.sport = this.training.getSelectedValue().toLowerCase();
    this.data.date = this.setDate();
    this.data.time = this.time.inputValue || AddActivity.getTime();
    this.data.title = this.title.inputValue ? this.title.inputValue : AddActivity.setTitle();
    this.data.description = this.description.textValue ? this.description.textValue : undefined;
    this.setMap();
  }

  private sendData(): void {
    this.saveButton.element.addEventListener('click', (e) => {
      e.preventDefault();
      this.collectActivityData();
      if (this.token) {
        createActivity(this.data, this.token);
      }
    });
  }

  private static setTitle(): string {
    const hours: number = new Date().getHours();
    if (hours >= 6 && hours <= 11) return 'Morning walk';
    if (hours >= 12 && hours <= 18) return 'Afternoon walk';
    if (hours >= 19 && hours <= 23) return 'Evening walk';
    if (hours >= 0 && hours <= 5) return 'Night walk';
    return '';
  }

  private setDuration(): string {
    const hours = this.durationHours.inputValue || '01';
    const minutes = this.durationMinutes.inputValue || '00';
    const seconds = this.durationSeconds.inputValue || '00';
    return `${hours}:${minutes}:${seconds}`;
  }

  private static getTime(): string {
    const date: Date = new Date();
    const hours: number = date.getHours() % 12;
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private setMap(): void {
    if (this.map.markers.length) {
      this.data.startLat = this.map.startPoint.lat.toString();
      this.data.startLng = this.map.startPoint.lng.toString();
      this.data.endLat = this.map.endPoint.lat.toString();
      this.data.endLng = this.map.endPoint.lng.toString();
    }
  }

  private setDate(): string {
    return this.date.inputValue ? new Date(this.date.inputValue).toISOString() : new Date().toISOString();
  }

  private addListeners(): void {
    // слушатель для селекта
    this.training.element.addEventListener('input', (e) => {
      e.preventDefault();
      const updatedValue = AddActivity.checkSelect(this.training.element.value);
      if ((this.map.startPoint, this.map.endPoint)) {
        console.log(updatedValue);
        this.map.updateTravelMode(updatedValue, this.map.startPoint, this.map.endPoint).then(() => {
          console.log(this.map.distanceTotal, this.map.timeTotal, this.map.elevationTotal, this.map);
          // Тут актуальные данные высоты и тд, если тип активности был изменен
          // предполагаю тут надо добавить this.setMap(), чтобы данные обновились
        });
      } else {
        const mode = GoogleMaps.getTravelMode(updatedValue);
        this.map.deleteMap();
        this.map = new GoogleMaps(
          this.mapDiv.element,
          'map add-activity-map',
          { lat: -33.397, lng: 150.644 },
          mode,
          true,
        );
      }
    });
  }

  private static checkSelect(value: string): string {
    switch (value) {
      case 'Cycling':
        return 'BICYCLING';
      default:
        return 'WALKING';
    }
  }
}
