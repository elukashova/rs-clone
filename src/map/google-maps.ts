/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable max-lines-per-function */
// eslint-disable-next-line import/no-extraneous-dependencies
import { decode } from '@googlemaps/polyline-codec';
import './google-maps.css';
import BaseComponent from '../components/base-component/base-component';
import Button from '../components/base-component/button/button';
import { ProjectColors } from '../utils/consts';
import {
  DirectionsRenderer,
  GeoErrors,
  Coordinates,
  MapRequest,
  OptionsForMap,
  ZoomSettings,
  APIKey,
} from './interface-map';

export default class GoogleMaps {
  public parentElement: HTMLElement;

  public map!: google.maps.Map;

  public mapId: string;

  public directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();

  public directionsRenderer: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: { strokeColor: ProjectColors.Orange },
    markerOptions: { icon: './assets/icons/png/geo.png' },
    draggable: false,
    suppressMarkers: true,
  });

  public elevation: google.maps.ElevationService = new google.maps.ElevationService();

  public infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  public directions: google.maps.DirectionsResult[] = [];

  public marker!: google.maps.Marker;

  public markers: google.maps.Marker[] = [];

  public startPoint!: Coordinates;

  public endPoint!: Coordinates;

  public currentTravelMode: google.maps.TravelMode;

  public waypoints!: google.maps.DirectionsWaypoint[];

  public elevationTotal: string = '0,0';

  public distanceTotal: string = '0';

  public timeTotal: string = '0';

  public maxMarkerCount: number = 2;

  public zoom: number = 10;

  public latLng: { lat: number; lng: number };

  public mapWrapper!: BaseComponent<'div'>;

  public chartElevation!: BaseComponent<'div'>;

  public locationButton!: Button;

  public clearButton!: Button;

  private elevationChart: boolean = true;

  constructor(
    parent: HTMLElement,
    mapId: string,
    center: Coordinates,
    travelMode: google.maps.TravelMode,
    elevationChart: boolean,
  ) {
    this.mapId = mapId;
    this.latLng = center;
    this.elevationChart = elevationChart;
    this.renderMap(parent);
    this.initMap(this.mapWrapper.element, center);
    this.currentTravelMode = travelMode;
    this.parentElement = parent;
  }

  public renderMap(parent: HTMLElement): void {
    this.mapWrapper = new BaseComponent('div', parent, 'map-wrapper', '', {
      id: 'map-wrapper',
      style: 'height: 50vh',
    });
    this.chartElevation = new BaseComponent('div', parent, 'chart-div', '', {
      id: 'chart-div',
    });
  }

  // обязательный метод google maps, он вызывается в параметрах ключа
  public initMap(parent: HTMLElement, latLng: { lat: number; lng: number }): void {
    const myOptions: OptionsForMap = {
      zoom: this.zoom,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(parent, myOptions);
    this.directionsRenderer.setMap(this.map);

    // переменные и слушатель для определения местоположения пользователя по геолокации
    this.locationButton = new Button(document.body, 'Go to current location');
    this.locationButton.element.style.marginTop = '10px';
    this.locationButton.element.style.marginLeft = '20%';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.locationButton.element);

    this.clearButton = new Button(document.body, 'Clear map');
    this.clearButton.element.style.marginTop = '10px';
    this.clearButton.element.style.marginLeft = '20px';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.clearButton.element);

    this.addListeners();
  }

  private addListeners(): void {
    // слушатель добавления маркеров (не более 2)
    this.map.addListener('click', (event: google.maps.MapMouseEvent): void => {
      if (this.markers.length < this.maxMarkerCount) {
        this.placeMarker(event.latLng, this.map);
      }
    });

    this.locationButton.element.addEventListener('click', (event): void => {
      event.preventDefault();
      this.changeGeolocation();
    });

    this.directionsRenderer.addListener('directions_changed', () => {
      const directions = this.directionsRenderer.getDirections();
      if (directions) {
        this.getTotalDistanceAndTime(directions.routes[0]);
      }
    });

    this.clearButton.element.addEventListener('click', (event) => {
      event.preventDefault();
      this.deleteRoute();
    });

    this.map.addListener('bounds_changed', () => {
      // console.log(this.startPoint, this.endPoint, this.currentTravelMode);
      /* this.updateTravelMode(this.currentTravelMode, this.startPoint, this.endPoint); */
      // this.directionsRenderer.setOptions();
      // this.doDirectionRequest();
    });
  }

  // размещаем маркер
  public placeMarker(location: google.maps.LatLng | null, map: google.maps.Map): void {
    if (location) {
      this.marker = this.placeMarkerAndPanTo(location, map);
      this.addMarkerToMarkers(this.marker);

      if (this.markers.length === this.maxMarkerCount) {
        const [startMarker, endMarker] = this.markers;
        const startPoint: Coordinates | undefined = GoogleMaps.getLatLng(startMarker);
        const endPoint: Coordinates | undefined = GoogleMaps.getLatLng(endMarker);
        if (startPoint && endPoint) {
          this.startPoint = {
            lat: startPoint.lat,
            lng: startPoint.lng,
          };
          this.endPoint = {
            lat: endPoint.lat,
            lng: endPoint.lng,
          };
          this.doDirectionRequest(startPoint, endPoint, this.currentTravelMode);
        }
      }
    }
  }

  // передаем актуальные данные маркера и перемещаем на него карту
  // eslint-disable-next-line max-len
  public placeMarkerAndPanTo(location: google.maps.LatLng, map: google.maps.Map): google.maps.Marker {
    this.marker = new google.maps.Marker({
      position: location,
      map,
      animation: google.maps.Animation.DROP,
      opacity: 1,
      icon: './assets/icons/png/geo.png',
      draggable: false,
    });
    map.panTo(location);
    map.setZoom(ZoomSettings.Closer);
    return this.marker;
  }

  // добавляем маркер в массив маркеров
  public addMarkerToMarkers(marker: google.maps.Marker): void {
    this.markers.push(marker);
  }

  // получение литерала широты и долготы по маркеру
  public static getLatLng(marker: google.maps.Marker): Coordinates | undefined {
    const position: google.maps.LatLng | null | undefined = marker?.getPosition();
    return position ? { lat: position.lat(), lng: position.lng() } : undefined;
  }

  // запрос в Direction API на отрисовку пути
  // eslint-disable-next-line max-len
  public async doDirectionRequest(startPoint: Coordinates, endPoint: Coordinates, selectedMode: string): Promise<void> {
    const travelType = selectedMode === 'BICYCLING' ? google.maps.TravelMode.BICYCLING : google.maps.TravelMode.WALKING;
    const request: MapRequest = {
      origin: startPoint, // start coordinates
      destination: endPoint, // end coordinates
      travelMode: travelType || google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    await this.directionsService
      .route(request, (result: DirectionsRenderer, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && result) {
          this.directionsRenderer.setMap(this.map);
          this.directionsRenderer.setDirections(result);

          this.getTotalDistanceAndTime(result.routes[0]);
          this.doElevationRequest(request);
        } else if (status === 'ZERO_RESULTS') {
          this.showMessage();
        } else {
          console.error("This route can't be laid.");
        }
      })
      .catch((error: Error): void => console.error(`Directions request failed: ${error}`));
  }

  // eslint-disable-next-line max-len
  public async doElevationRequest(request: MapRequest): Promise<void> {
    try {
      const response = await this.elevation.getElevationAlongPath({
        path: [request?.origin, request?.destination],
        samples: 200,
      });
      if (response) {
        if (this.elevationChart) {
          this.drawPlotElevation(response);
        }
      }
    } catch (error) {
      this.chartElevation.element.textContent = "Can't show elevation";
    }
  }

  public drawPlotElevation({ results }: google.maps.PathElevationResponse): void {
    const chart = new google.visualization.ColumnChart(this.chartElevation.element);
    chart.clearChart();
    const data: google.visualization.DataTable = new google.visualization.DataTable();

    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');

    for (let i = 0; i < results.length; i += 1) {
      data.addRow(['', results[i].elevation]);
    }

    chart.draw(data, {
      height: 150,
      legend: 'none',
      title: 'Elevation (meters)',
      colors: [ProjectColors.DarkTurquoise, ProjectColors.Turquoise],
    });
    this.getMapElevationInfo(results);
  }

  // получение всего подъема на пути и всего спуска в метрах
  public getMapElevationInfo(results: google.maps.ElevationResult[]): string {
    let elevationGain = 0;
    let elevationLoss = 0;
    for (let i = 0; i < results.length - 1; i += 1) {
      const currentElevation = results[i].elevation;
      const nextElevation = results[i + 1].elevation;
      if (currentElevation < nextElevation) {
        elevationGain += nextElevation - currentElevation;
      } else {
        elevationLoss += currentElevation - nextElevation;
      }
    }
    this.elevationTotal = `${elevationGain.toFixed(0)},${elevationLoss.toFixed(0)}`;
    return this.elevationTotal;
  }

  // получение всей протяженности маршрута в метрах
  public getTotalDistanceAndTime(route: google.maps.DirectionsRoute): void {
    const [legs]: google.maps.DirectionsLeg[] = route.legs;
    if (legs.distance) {
      this.distanceTotal = legs.distance.text ?? '0';
    }
    if (legs.duration) {
      this.timeTotal = legs.duration.text ?? '0';
    }
  }

  // eslint-disable-next-line max-len
  public setTravelMode(startPoint: Coordinates, endPoint: Coordinates, id: string): void {
    const selected = document.getElementById(`${id}`);
    if (selected) {
      const selectedValue = selected.textContent;
      if (selectedValue === 'test') {
        this.doDirectionRequest(startPoint, endPoint, 'WALKING');
      }
    }
  }

  public catchLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng): void {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(browserHasGeolocation ? GeoErrors.Service : GeoErrors.Browser);
    this.infoWindow.open(this.map);
  }

  // изменение карты по геолокации при клике на кнопку
  public changeGeolocation(): void {
    // если браузер поддерживает геолокацию
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition): void => {
          const pos: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.infoWindow.setPosition(pos);
          this.infoWindow.setContent('Location found!');
          this.infoWindow.open(this.map);
          this.map.setCenter(pos);
        },
        (): void => {
          const latLngInfo: google.maps.LatLng | undefined = this.map.getCenter();
          if (latLngInfo) {
            this.catchLocationError(true, latLngInfo);
          }
        },
      );
    } else {
      // если браузер не поддерживает геолокацию
      const latLngInfo: google.maps.LatLng | undefined = this.map.getCenter();
      if (latLngInfo) {
        this.catchLocationError(false, latLngInfo);
      }
    }
  }

  public showMessage(): void {
    const popup = new google.maps.InfoWindow();
    const block = document.createElement('div');
    block.classList.add('google-maps__popup');
    block.textContent = 'Unfortunately, we were unable to find such a route. Do you want to build a different route?';
    const button = new Button(block, 'OK', 'google-maps__popup-button');

    block.append(button.element);
    popup.setContent(block);
    popup.open(this.map);

    button.element.addEventListener('click', (event) => {
      event.preventDefault();
      this.deleteRoute();
      block.style.visibility = 'hidden';
    });
  }

  public deleteRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers.length = 0;
  }

  public deleteMap(): void {
    this.parentElement.remove();
  }

  public static async drawStaticMap(
    startPoint: Coordinates,
    endPoint: Coordinates,
    activityType: string,
  ): Promise<string> {
    const travelType = activityType === 'BICYCLING' ? google.maps.TravelMode.BICYCLING : google.maps.TravelMode.WALKING;
    const data = await GoogleMaps.doRequestForStaticMap(startPoint, endPoint, travelType);
    const url = GoogleMaps.createURL(startPoint, endPoint, data);
    return url;
  }

  public static async doRequestForStaticMap(
    startPoint: Coordinates,
    endPoint: Coordinates,
    activityType: google.maps.TravelMode,
  ): Promise<string> {
    const request = {
      origin: startPoint,
      destination: endPoint,
      travelMode: activityType,
    };
    let res: string = '';
    const service = new google.maps.DirectionsService();
    try {
      const result = await service.route(request);
      if (result) {
        const decodedLine = decode(result.routes[0].overview_polyline);
        res = decodedLine.map((coordinate) => coordinate.join(',')).join('|');
        return res;
      }
    } catch (error) {
      console.error(`Directions request failed: ${error}`);
    }
    return res;
  }

  public static createURL(start: Coordinates, end: Coordinates, line: string): string {
    const request = {
      key: `${APIKey.maps}`,
      size: '800x400',
      path: `color:0xFF8D24ff|weight:5|${line}`,
      markers: `color:0xFFAE0B|${start.lat},${start.lng}|${end.lat},${end.lng}`,
    };

    const url = `https://maps.googleapis.com/maps/api/staticmap?${Object.entries(request)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
    return url;
  }

  public static getTravelModeFromButton(value: string): google.maps.TravelMode {
    switch (value) {
      case 'WALKING':
        return google.maps.TravelMode.WALKING;
      case 'BICYCLING':
        return google.maps.TravelMode.BICYCLING;
      default:
        return google.maps.TravelMode.WALKING;
    }
  }

  public updateTravelMode(travelMode: google.maps.TravelMode, origin: Coordinates, destination: Coordinates): void {
    this.changeTravelMode(travelMode, origin, destination);
    this.currentTravelMode = travelMode;
  }

  public changeTravelMode(travelMode: google.maps.TravelMode, origin: Coordinates, destination: Coordinates): void {
    const request = {
      origin,
      destination,
      travelMode,
      unitSystem: google.maps.UnitSystem.METRIC,
    };

    this.directionsService
      .route(request)
      .then((response) => {
        this.directionsRenderer.setDirections(response);
        this.doElevationRequest(request);
      })
      .catch((error) => console.log(`Directions request failed: ${error}`));
  }
}
