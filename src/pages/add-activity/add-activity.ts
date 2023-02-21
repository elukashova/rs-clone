/* eslint-disable max-len */
import './add-activity.css';
// import i18next from 'i18next';
import BaseComponent from '../../components/base-component/base-component';
import Button from '../../components/base-component/button/button';
import Select from '../../components/base-component/select/select';
import Input from '../../components/base-component/text-input-and-label/text-input';
import TextArea from '../../components/base-component/textarea/textarea';
import SvgNames from '../../components/base-component/svg/svg.types';
import { ProjectColors, VALID_NUMBER, VALID_TIME } from '../../utils/consts';
import GoogleMaps from '../../map/google-maps';
import { ActivityRequest, Token } from '../../app/loader/loader-requests.types';
import { createActivity } from '../../app/loader/services/activity-services';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import Picture from '../../components/base-component/picture/picture';
import { convertRegexToPattern } from '../../utils/utils';
import { ValidityMessages } from '../splash/forms/form.types';
import Routes from '../../app/router/router.types';
import LoadingTimer from '../../components/base-component/loading/loading';
// import DropdownInput from '../splash/forms/dropdown-input/dropdown';

export default class AddActivity extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    heading: 'addActivityPage.heading',
    morningActivity: 'addActivityPage.morningActivity',
    distance: 'addActivityPage.distance',
    duration: 'addActivityPage.duration',
    elevation: 'addActivityPage.elevation',
    training: 'addActivityPage.training',
    date: 'addActivityPage.dateAndTime',
    trainTogether: 'addActivityPage.trainTogether',
    title: 'addActivityPage.title',
    description: 'addActivityPage.description',
    descriptionPlaceholder: 'addActivityPage.descriptionPlaceholder',
    walking: 'addActivityPage.walking',
    hiking: 'addActivityPage.hiking',
    cycling: 'addActivityPage.cycling',
    running: 'addActivityPage.running',
    save: 'addActivityPage.save',
    morning: 'addActivityPage.morning',
    afternoon: 'addActivityPage.afternoon',
    evening: 'addActivityPage.evening',
    night: 'addActivityPage.night',
    run: 'addActivityPage.run',
    hike: 'addActivityPage.hike',
    ride: 'addActivityPage.ride',
    walk: 'addActivityPage.walk',
    mapTitle: 'addActivityPage.mapTitle',
  };

  private trainingTypes: string[] = [
    this.dictionary.walking,
    this.dictionary.hiking,
    this.dictionary.cycling,
    this.dictionary.running,
  ];

  private loadingMap = new LoadingTimer('div');

  private formContainer = new BaseComponent('div', this.element, 'add-activity__container');

  private heading = new BaseComponent(
    'h2',
    this.formContainer.element,
    'add-activity__heading titles',
    this.dictionary.heading,
  );

  private formElement = new BaseComponent('form', this.formContainer.element, 'add-activity__form');

  private formFieldset = new BaseComponent('fieldset', this.formElement.element, 'add-activity__fieldset');

  private pathInfoBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block block-path');

  private distanceContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private distance = new Input(
    this.distanceContainer.element,
    'add-activity__input input-distance',
    this.dictionary.distance,
    {
      type: 'text',
      pattern: convertRegexToPattern(VALID_NUMBER),
    },
  );

  private durationContainer = new BaseComponent(
    'div',
    this.pathInfoBlock.element,
    'add-activity__block-container block-duration',
  );

  private durationHours = new Input(
    this.durationContainer.element,
    'add-activity__input input-hours',
    this.dictionary.duration,
    {
      type: 'text',
      value: '01',
      placeholder: '01',
      pattern: convertRegexToPattern(VALID_NUMBER),
    },
  );

  private durationMinutes = new Input(this.durationContainer.element, 'add-activity__input input-minutes', '', {
    type: 'text',
    value: '00',
    placeholder: '00',
    pattern: convertRegexToPattern(VALID_TIME),
  });

  private durationSeconds = new Input(this.durationContainer.element, 'add-activity__input input-seconds', '', {
    type: 'text',
    value: '00',
    placeholder: '00',
    pattern: convertRegexToPattern(VALID_TIME),
  });

  private elevationContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private elevation = new Input(
    this.elevationContainer.element,
    'add-activity__input input-elevation',
    this.dictionary.elevation,
    {
      type: 'text',
      value: '0',
      placeholder: '0',
      pattern: convertRegexToPattern(VALID_NUMBER),
    },
  );

  private trainingBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block block-type', '');

  private trainingContainer = new BaseComponent(
    'div',
    this.trainingBlock.element,
    'add-activity__block-container block-training',
  );

  private training = new Select(
    this.trainingContainer.element,
    this.trainingTypes,
    'add-activity',
    'add-activity__select-wrapper',
    { id: 'training' },
  );

  private dateContainer = new BaseComponent(
    'div',
    this.trainingBlock.element,
    'add-activity__block-container block-time',
  );

  private date = new Input(this.dateContainer.element, 'add-activity__input input-date', this.dictionary.date, {
    type: 'date',
  });

  private time = new Input(this.dateContainer.element, 'add-activity__input input-time', '', {
    type: 'time',
  });

  private searchContainer = new BaseComponent('div', this.trainingBlock.element, 'add-activity__block');

  private search = new Input(
    this.searchContainer.element,
    'add-activity__input input-search',
    this.dictionary.trainTogether,
    {
      type: 'search',
    },
  );

  private titleBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block', '');

  private titleContainer = new BaseComponent('div', this.titleBlock.element, 'add-activity__block-container');

  private title = new Input(this.titleContainer.element, 'add-activity__input input-title', this.dictionary.title, {
    type: 'text',
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
    this.dictionary.description,
    {
      type: 'textarea',
      maxlength: '1000',
      rows: '4',
      placeholder: this.dictionary.descriptionPlaceholder,
    },
  );

  private mapBlock = new BaseComponent('div', this.formFieldset.element, 'map_container', '');

  private mapTitle: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.mapBlock.element,
    'map__title',
    this.dictionary.mapTitle,
  );

  private mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.mapBlock.element, 'map', '', { id: 'map' });

  private map = new GoogleMaps(this.mapDiv.element, { lat: 38.771, lng: -9.058 }, google.maps.TravelMode.WALKING, true);

  public saveButton = new Button(this.formElement.element, this.dictionary.save, 'btn-activity');

  private data: ActivityRequest = {
    time: '',
    date: '',
    title: '',
    elevation: '',
    duration: '',
    sport: '',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  private static circle: Picture;

  private static background: BaseComponent<'div'>;

  constructor(parent: HTMLElement, private replaceMainCallback: () => void) {
    super('section', parent, 'add-activity add-activity-section');
    this.search.addSvgIcon(SvgNames.Search, ProjectColors.Grey, 'search');
    this.addListeners();
    this.setDefaultTime();
    this.updateTitle();
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
    this.data.sport = this.training.selectValue.toLowerCase();
    this.data.date = this.setDate();
    this.data.time = this.time.inputValue || AddActivity.getTime();
    this.data.title = this.title.inputValue ? this.title.inputValue : this.setTitle();
    this.data.description = this.description.textValue ? this.description.textValue : undefined;
    this.setMap();
  }

  private setTitle(inputHours?: number): string {
    const hours: number = inputHours || new Date().getHours();
    if (hours >= 6 && hours <= 11) return `Morning ${this.defineSportForTitle()}`;
    if (hours >= 12 && hours <= 18) return `Afternoon ${this.defineSportForTitle()}`;
    if (hours >= 19 && hours <= 23) return `Evening ${this.defineSportForTitle()}`;
    if (hours >= 0 && hours <= 5) return `Night ${this.defineSportForTitle()}`;
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
    this.saveButton.element.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.checkNumberInputs(e)) {
        this.collectActivityData();
        if (this.token) {
          createActivity(this.data, this.token);
          window.history.pushState({}, '', Routes.Dashboard);
          this.replaceMainCallback();
        }
      }
    });

    // слушатель для селекта
    this.training.optionsAll.forEach((el) => el.addEventListener('click', this.selectSportCallback));

    this.mapBlock.element.addEventListener('click', () => {
      if (this.map.marker && this.map.markers.length === 2) {
        this.updateMap();
      }
    });

    this.map.clearButton.element.addEventListener('click', () => {
      this.resetResults();
    });

    this.time.input.element.addEventListener('input', () => {
      const { value } = this.time.input.element;
      const hours: string = value.startsWith('0') ? value.slice(0, 1) : value.slice(0, 2);
      this.updateTitle(Number(hours));
    });
  }

  private selectSportCallback = (): void => {
    this.updateMap();
    this.updateTitle();
  };

  private updateMap = (): void => {
    const updatedValue: string = AddActivity.checkSelect(this.training.select.element.value);
    if ((this.map.startPoint, this.map.endPoint)) {
      this.map.updateTravelMode(updatedValue, this.map.startPoint, this.map.endPoint).then((): void => {
        this.loadingMap.showLoadingCircle();
        this.updateInputsFromMap();
      });
    } else {
      this.map.deleteMap();
      this.map = new GoogleMaps(this.mapDiv.element, { lat: -33.397, lng: 150.644 }, updatedValue, true);
    }
  };

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
      this.loadingMap.deleteLoadingCircle();
    }, 3000);
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

  private checkNumberInputs = (e: Event): boolean => {
    const conditionsArray: boolean[] = [
      this.durationHours.checkInput(ValidityMessages.Number),
      this.durationMinutes.checkInput(ValidityMessages.Time),
      this.durationMinutes.checkInput(ValidityMessages.Time),
      this.elevation.checkInput(ValidityMessages.Number),
      this.distance.checkInput(ValidityMessages.Number),
    ];

    if (conditionsArray.includes(false)) {
      e.preventDefault();
      return false;
    }

    return true;
  };

  private setDefaultTime(): void {
    const currentDay: Date = new Date();
    this.date.input.element.valueAsDate = currentDay;

    const prefixMinutes: string = AddActivity.getCorrectTimePrefix(currentDay.getMinutes());
    const currentMinutes = `${prefixMinutes}${currentDay.getMinutes()}`;

    const prefixHours: string = AddActivity.getCorrectTimePrefix(currentDay.getHours());
    const currentHours = `${prefixHours}${currentDay.getHours()}`;
    const currentTime: string = `${currentHours}:${currentMinutes}`;
    this.time.input.element.defaultValue = currentTime;
  }

  private static getCorrectTimePrefix(currentTime: number): string {
    // eslint-disable-next-line no-nested-ternary
    return currentTime < 10 ? '0' : currentTime === 0 ? '00' : '';
  }

  private updateTitle(hours?: number): void {
    this.title.input.element.value = hours ? this.setTitle(hours) : this.setTitle();
    this.title.input.element.placeholder = this.setTitle();
  }

  private defineSportForTitle(): string {
    const sport: string = this.training.selectValue;
    let sportType: string;

    switch (sport) {
      case 'Running':
        sportType = 'run';
        break;
      case 'Cycling':
        sportType = 'ride';
        break;
      case 'Hiking':
        sportType = 'hike';
        break;
      default:
        sportType = 'walk';
        break;
    }
    return sportType;
  }
}
