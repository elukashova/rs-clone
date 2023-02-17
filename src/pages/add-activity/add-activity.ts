/* eslint-disable max-len */
import './add-activity.css';
import i18next from 'i18next';
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
import Picture from '../../components/base-component/picture/picture';
import eventEmitter from '../../utils/event-emitter';

export default class AddActivity extends BaseComponent<'section'> {
  private trainingTypes: string[] = i18next.t('addActivityPage.trainingTypes').split(',');

  private formContainer = new BaseComponent('div', this.element, 'add-activity__container');

  private heading = new BaseComponent('h3', this.formContainer.element, 'add-activity__heading', 'Add activity');

  private formElement = new BaseComponent('form', this.formContainer.element, 'add-activity__form');

  private formFieldset = new BaseComponent('fieldset', this.formElement.element, 'add-activity__fieldset');

  private pathInfoBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block block-path');

  private distanceContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private distance = new Input(
    this.distanceContainer.element,
    'add-activity__input input-distance',
    i18next.t('addActivityPage.distance'),
    {
      type: 'number',
    },
  );

  private durationContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private durationHours = new Input(
    this.durationContainer.element,
    'add-activity__input input-hours',
    i18next.t('addActivityPage.duration'),
    {
      type: 'number',
      placeholder: '01',
      value: '01',
    },
  );

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
    i18next.t('addActivityPage.elevation'),
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
    i18next.t('addActivityPage.training'),
    { for: 'training' },
  );

  private training = new Select(
    this.trainingContainer.element,
    this.trainingTypes,
    'add-activity__input input-training',
    false,
    { id: 'training' },
  );

  private dateContainer = new BaseComponent('div', this.trainingBlock.element, 'add-activity__block-container');

  private date = new Input(
    this.dateContainer.element,
    'add-activity__input input-date',
    i18next.t('addActivityPage.dateAndTime'),
    {
      type: 'date',
    },
  );

  private time = new Input(this.dateContainer.element, 'add-activity__input input-time', '', {
    type: 'time',
  });

  private searchContainer = new BaseComponent('div', this.trainingBlock.element, 'add-activity__block');

  private search = new Input(
    this.searchContainer.element,
    'add-activity__input input-search',
    i18next.t('addActivityPage.trainTogether'),
    {
      type: 'search',
    },
  );

  private titleBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block', '');

  private titleContainer = new BaseComponent('div', this.titleBlock.element, 'add-activity__block-container');

  private title = new Input(
    this.titleContainer.element,
    'add-activity__input input-title',
    i18next.t('addActivityPage.title'),
    {
      type: 'text',
      placeholder: i18next.t('addActivityPage.morningActivity'),
    },
  );

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
    i18next.t('addActivityPage.description'),
    {
      type: 'textarea',
      maxlength: '1000',
      rows: '4',
      placeholder: i18next.t('addActivityPage.descriptionPlaceholder'),
    },
  );

  private mapBlock = new BaseComponent('div', this.formFieldset.element, 'map_container add-activity__block', '');

  private mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.mapBlock.element, 'map', '', { id: 'map' });

  private map = new GoogleMaps(this.mapDiv.element, { lat: 38.771, lng: -9.058 }, google.maps.TravelMode.WALKING, true);

  public saveButton = new Button(this.formElement.element, i18next.t('addActivityPage.save'), 'btn-activity');

  private data: Activity = {
    time: '',
    date: '',
    title: '',
    elevation: '',
    duration: '',
    sport: '',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private static circle: Picture;

  constructor(parent: HTMLElement) {
    super('section', parent, 'add-activity add-activity-section');
    this.search.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    this.addListeners();
    this.sendData();
    this.changeLanguageOnThisPage();
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
    this.data.distance = this.distance.inputValue || '0';
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
    if (hours >= 6 && hours <= 11) return i18next.t('addActivityPage.morningActivity');
    if (hours >= 12 && hours <= 18) return i18next.t('addActivityPage.afternoonActivity');
    if (hours >= 19 && hours <= 23) return i18next.t('addActivityPage.eveningActivity');
    if (hours >= 0 && hours <= 5) return i18next.t('addActivityPage.nightActivity');
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
      this.data.startPoint = AddActivity.joinMapDataIntoString(
        this.map.startPoint.lat.toString(),
        this.map.startPoint.lng.toString(),
      );

      this.data.endPoint = AddActivity.joinMapDataIntoString(
        this.map.endPoint.lat.toString(),
        this.map.endPoint.lng.toString(),
      );
      this.data.travelMode = this.map.currentTravelMode;
      this.data.mapId = this.map.mapId;
    }
  }

  private setDate(): string {
    return this.date.inputValue ? new Date(this.date.inputValue).toISOString() : new Date().toISOString();
  }

  private addListeners(): void {
    // слушатель для селекта
    this.training.element.addEventListener('input', (e: Event): void => {
      e.preventDefault();
      this.updateMap();
    });
    this.mapBlock.element.addEventListener('click', () => {
      if (this.map.marker && this.map.markers.length === 2) {
        this.updateMap();
      }
    });
    this.map.clearButton.element.addEventListener('click', () => {
      this.resetResults();
    });
  }

  private updateMap(): void {
    const updatedValue: string = AddActivity.checkSelect(this.training.element.value);
    if ((this.map.startPoint, this.map.endPoint)) {
      this.map.updateTravelMode(updatedValue, this.map.startPoint, this.map.endPoint).then((): void => {
        AddActivity.showLoadingCircle();
        this.updateInputsFromMap();
      });
    } else {
      this.map.deleteMap();
      this.map = new GoogleMaps(this.mapDiv.element, { lat: -33.397, lng: 150.644 }, updatedValue, true);
    }
  }

  private static checkSelect(value: string): string {
    switch (value) {
      case 'Cycling':
        return 'BICYCLING';
      default:
        return 'WALKING';
    }
  }

  private updateInputsFromMap(): void {
    setTimeout(() => {
      this.distance.newInputValue = `${this.map.distanceTotal}`;
      const { hours, minutes, seconds } = this.map.timeTotal;
      this.durationHours.newInputValue = `${hours}`;
      this.durationMinutes.newInputValue = `${minutes}`;
      this.durationSeconds.newInputValue = `${seconds}`;
      const elevationCount = this.map.elevationTotal.split(',')[0];
      this.elevation.newInputValue = `${elevationCount}`;
      AddActivity.deleteLoadingCircle();
    }, 3000);
  }

  private static showLoadingCircle(): void {
    this.circle = new Picture(document.body, 'circle', { src: './assets/icons/timer.gif' });
    this.circle.element.style.position = 'fixed';
    this.circle.element.style.top = '50%';
    this.circle.element.style.left = '50%';
    this.circle.element.style.transform = 'translate(-50%, -50%)';
    this.circle.element.style.zIndex = '150';
  }

  private static deleteLoadingCircle(): void {
    document.body.removeChild(this.circle.element);
  }

  private resetResults(): void {
    this.distance.newInputValue = '0';
    this.durationHours.newInputValue = '01';
    this.durationMinutes.newInputValue = '00';
    this.durationSeconds.newInputValue = '00';
    this.elevation.newInputValue = '0';
  }

  private static joinMapDataIntoString(lat: string, lng: string): string {
    return `${lat},${lng}`;
  }

  private changeLanguageOnThisPage(): void {
    eventEmitter.on('changeLanguage', () => {
      this.heading.element.textContent = i18next.t('addActivityPage.heading');
      this.distance.title.element.textContent = i18next.t('addActivityPage.distance');
      this.durationHours.title.element.textContent = i18next.t('addActivityPage.duration');
      this.elevation.title.element.textContent = i18next.t('addActivityPage.elevation');
      this.trainingLabel.element.textContent = i18next.t('addActivityPage.training');
      this.date.title.element.textContent = i18next.t('addActivityPage.dateAndTime');
      this.search.title.element.textContent = i18next.t('addActivityPage.trainTogether');
      this.title.title.element.textContent = i18next.t('addActivityPage.title');
      this.title.input.element.placeholder = i18next.t('addActivityPage.morningActivity');
      this.description.title.element.textContent = i18next.t('addActivityPage.description');
      this.description.placeholder = i18next.t('addActivityPage.descriptionPlaceholder');
      this.saveButton.element.textContent = i18next.t('addActivityPage.save');
      this.trainingTypes = i18next.t('addActivityPage.trainingTypes').split(',');
      this.training.setOptionNames(this.trainingTypes);
    });
  }
}
