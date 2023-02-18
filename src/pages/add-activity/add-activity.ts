/* eslint-disable max-len */
import './add-activity.css';
import BaseComponent from '../../components/base-component/base-component';
import Button from '../../components/base-component/button/button';
import Select from '../../components/base-component/select/select';
import Input from '../../components/base-component/text-input-and-label/text-input';
import TextArea from '../../components/base-component/textarea/textarea';
import SvgNames from '../../components/base-component/svg/svg.types';
import { ProjectColors, VALID_NUMBER, VALID_TIME } from '../../utils/consts';
import GoogleMaps from '../../map/google-maps';
import { Activity, Token } from '../../app/loader/loader.types';
import { createActivity } from '../../app/loader/services/activity-services';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import Picture from '../../components/base-component/picture/picture';
import { convertRegexToPattern } from '../../utils/utils';
import { ValidityMessages } from '../splash/forms/form.types';
import Routes from '../../app/router/router.types';
// import DropdownInput from '../splash/forms/dropdown-input/dropdown';

export default class AddActivity extends BaseComponent<'section'> {
  private formContainer = new BaseComponent('div', this.element, 'add-activity__container');

  private heading = new BaseComponent('h3', this.formContainer.element, 'add-activity__heading', 'Add activity');

  private formElement = new BaseComponent('form', this.formContainer.element, 'add-activity__form');

  private formFieldset = new BaseComponent('fieldset', this.formElement.element, 'add-activity__fieldset');

  private pathInfoBlock = new BaseComponent('div', this.formFieldset.element, 'add-activity__block block-path');

  private distanceContainer = new BaseComponent('div', this.pathInfoBlock.element, 'add-activity__block-container');

  private distance = new Input(this.distanceContainer.element, 'add-activity__input input-distance', 'Distance (km)', {
    type: 'text',
    pattern: convertRegexToPattern(VALID_NUMBER),
  });

  private durationContainer = new BaseComponent(
    'div',
    this.pathInfoBlock.element,
    'add-activity__block-container block-duration',
  );

  private durationHours = new Input(this.durationContainer.element, 'add-activity__input input-hours', 'Duration', {
    type: 'text',
    value: '01',
    placeholder: '01',
    pattern: convertRegexToPattern(VALID_NUMBER),
  });

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
    'Elevation (m)',
    {
      type: 'number',
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
    ['Walking', 'Running', 'Hiking', 'Cycling'],
    'add-activity',
    'add-activity__select-wrapper',
    { id: 'training' },
  );

  private dateContainer = new BaseComponent(
    'div',
    this.trainingBlock.element,
    'add-activity__block-container block-time',
  );

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
    'description',
    {
      type: 'textarea',
      maxlength: '1000',
      rows: '4',
      placeholder: "How'd it go? Share more about your activity!",
    },
  );

  private mapBlock = new BaseComponent('div', this.formFieldset.element, 'map_container', '');

  private mapTitle: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.mapBlock.element,
    'map__title',
    'Activity route',
  );

  private mapDiv: BaseComponent<'div'> = new BaseComponent('div', this.mapBlock.element, 'map', '', { id: 'map' });

  private map = new GoogleMaps(this.mapDiv.element, { lat: 38.771, lng: -9.058 }, google.maps.TravelMode.WALKING, true);

  public saveButton = new Button(this.formElement.element, 'Save', 'btn-activity');

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
    console.log(this.data);
    this.setMap();
  }

  private setTitle(): string {
    const hours: number = new Date().getHours();
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
  }

  private selectSportCallback = (): void => {
    this.updateMap();
    this.updateTitle();
  };

  private updateMap = (): void => {
    const updatedValue: string = AddActivity.checkSelect(this.training.select.element.value);
    if ((this.map.startPoint, this.map.endPoint)) {
      this.map.updateTravelMode(updatedValue, this.map.startPoint, this.map.endPoint).then((): void => {
        AddActivity.showLoadingCircle();
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

  private updateTitle(): void {
    this.title.input.element.value = this.setTitle();
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
