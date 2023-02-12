/* eslint-disable object-curly-newline */
/* eslint-disable max-lines-per-function */
import './google-maps.css';
import BaseComponent from '../components/base-component/base-component';
import Button from '../components/base-component/button/button';
import { ProjectColors } from '../utils/consts';
import { DirectionsRenderer, GeoErrors, Coordinates, MapRequest, OptionsForMap, ZoomSettings } from './interface-map';

export default class GoogleMaps {
  public parentElement: HTMLElement;

  public map!: google.maps.Map;

  public mapId: string;

  public directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();

  public directionsRenderer: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: { strokeColor: ProjectColors.Turquoise },
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

  public elevationTotal: number[] = [0, 0];

  public distanceTotal: google.maps.Distance = { text: '', value: 0 };

  public timeTotal: google.maps.Duration = { text: '', value: 0 };

  public maxMarkerCount: number = 2;

  public zoom: number;

  public latLng: { lat: number; lng: number };

  public mapWrapper!: BaseComponent<'div'>;

  public chartElevation!: BaseComponent<'div'>;

  public locationButton!: Button;

  constructor(
    parent: HTMLElement,
    mapId: string,
    zoom: number,
    center: Coordinates,
    travelMode: google.maps.TravelMode,
  ) {
    this.mapId = mapId;
    this.zoom = zoom;
    this.latLng = center;
    this.renderMap(parent);
    this.initMap(this.mapWrapper.element, zoom, center);
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
  public initMap(parent: HTMLElement, zoom: number, latLng: { lat: number; lng: number }): void {
    const myOptions: OptionsForMap = {
      zoom,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(parent, myOptions);
    this.directionsRenderer.setMap(this.map);

    // переменные и слушатель для определения местоположения пользователя по геолокации
    this.locationButton = new Button(document.body, 'Go to current location');
    this.locationButton.element.style.marginTop = '10px';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.locationButton.element);
    this.addListeners();
  }

  private addListeners(): void {
    // слушатель добавления маркеров (не более 2)
    this.map.addListener('click', (event: google.maps.MapMouseEvent): void => {
      if (this.markers.length < this.maxMarkerCount) {
        this.placeMarker(event.latLng, this.map);
      }
    });

    this.locationButton.element.addEventListener('click', (): void => {
      this.changeGeolocation();
    });

    this.directionsRenderer.addListener('directions_changed', () => {
      const directions = this.directionsRenderer.getDirections();
      if (directions) {
        this.getTotalDistanceAndTime(directions);
      }
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
  public doDirectionRequest(startPoint: Coordinates, endPoint: Coordinates, selectedMode: string): void {
    let travelType;
    if (selectedMode === 'WALKING') {
      travelType = google.maps.TravelMode.WALKING;
    } else if (selectedMode === 'BICYCLING') {
      travelType = google.maps.TravelMode.BICYCLING;
    } else {
      travelType = google.maps.TravelMode.WALKING;
    }
    const request: MapRequest = {
      origin: startPoint, // start coordinates
      destination: endPoint, // end coordinates
      travelMode: travelType || google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    this.directionsService
      .route(request, (result: DirectionsRenderer, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && result) {
          this.directionsRenderer.setDirections(result);
          this.doElevationRequest(request);
          // GoogleMaps.getMarkersAndWaypoints(result);
          this.getTotalDistanceAndTime(result);
        } else if (status === 'ZERO_RESULTS') {
          this.showMessage();
          // добавлю код с появлением кнопки  с текстом,
          // что маршрут не найден и предложением стереть маршрут и попробовать с другими данными
        } else {
          console.error("This route can't be laid.");
        }
      })
      .catch((error: Error): void => console.error(`Directions request failed: ${error}`));
  }

  public catchLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng): void {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(browserHasGeolocation ? GeoErrors.Service : GeoErrors.Browser);
    this.infoWindow.open(this.map);
  }

  public doElevationRequest(request: MapRequest): void {
    this.elevation
      .getElevationAlongPath({
        path: [request?.origin, request?.destination],
        samples: 200,
      })
      .then((response: google.maps.PathElevationResponse): void => this.drawPlotElevation(response))
      .catch((): void => {
        this.chartElevation.element.textContent = 'Cannot show elevation';
      });
  }

  public drawPlotElevation({ results }: google.maps.PathElevationResponse): void {
    const chart = new google.visualization.ColumnChart(this.chartElevation.element);
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
  public getMapElevationInfo(results: google.maps.ElevationResult[]): number[] {
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
    this.elevationTotal = [elevationGain, elevationLoss];
    return this.elevationTotal;
  }

  // получение всей протяженности маршрута в метрах
  public getTotalDistanceAndTime(result: google.maps.DirectionsResult): void {
    const [myRoute]: google.maps.DirectionsRoute[] = result.routes;
    const [legs]: google.maps.DirectionsLeg[] = myRoute.legs;
    this.distanceTotal = legs.distance ?? { text: '', value: 0 };
    this.timeTotal = legs.duration ?? { text: '', value: 0 };
  }

  // TODO:
  public setTravelMode(travelMode: google.maps.TravelMode): void {
    this.map.setMapTypeId(travelMode);
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

  // TODO:
  public deleteRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
    this.deleteMarkers();
  }

  public deleteMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers.length = 0;
  }

  public deleteMap(): void {
    this.parentElement.remove();
  }

  // TODO:
  /*  public doMapRequired(): void {
    this.map.addListener('click', (e: google.maps.event) => {
      e.preventDefault();
    });
  } */
}
