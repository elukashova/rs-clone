/* eslint-disable max-lines-per-function */
import BaseComponent from '../components/base-component/base-component';
import Button from '../components/button/button';
import { ProjectColors } from '../utils/consts';
import { DirectionsRenderer, GeoErrors, Coordinates, MapRequest, OptionsForMap, ZoomSettings } from './interface-map';

export default class GoogleMaps {
  public map!: google.maps.Map;

  public mapId: string;

  public directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();

  public directionsRenderer: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: { strokeColor: ProjectColors.Turquoise },
    markerOptions: { icon: './assets/icons/png/geo.png' },
    draggable: true,
  });

  public elevation: google.maps.ElevationService = new google.maps.ElevationService();

  public infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  public directions: google.maps.DirectionsResult[] = [];

  public marker!: google.maps.Marker;

  public markers: google.maps.Marker[] = [];

  public allWaypoints = [];

  public elevationNumber: number = 0;

  public maxMarkerCount: number = 2;

  public zoom: number;

  public latLng: { lat: number; lng: number };

  public mapWrapper!: BaseComponent<'div'>;

  public chartElevation!: BaseComponent<'div'>;

  constructor(parent: HTMLElement, mapId: string, zoom: number, center: Coordinates) {
    this.mapId = mapId;
    this.zoom = zoom;
    this.latLng = center;
    this.renderMap(parent);
    this.initMap(this.mapWrapper.element, zoom, center);
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

    // слушатель добавления маркеров (не более 2)
    this.map.addListener('click', (event: google.maps.MapMouseEvent): void => {
      if (this.markers.length < this.maxMarkerCount) {
        this.placeMarker(event.latLng, this.map);
      }
    });

    // переменные и слушатель для определения местоположения пользователя по геолокации
    const locationButton = new Button(document.body, 'Go to current location');
    locationButton.element.style.marginTop = '10px';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton.element);
    locationButton.element.addEventListener('click', (): void => {
      this.changeGeolocation();
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
          const startPointLatLngLiteral: Coordinates = {
            lat: startPoint.lat,
            lng: startPoint.lng,
          };
          const endPointLatLngLiteral: Coordinates = {
            lat: endPoint.lat,
            lng: endPoint.lng,
          };
          this.doDirectionRequest(startPointLatLngLiteral, endPointLatLngLiteral);
        }
      }
    }
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
            this.handleLocationError(true, latLngInfo);
          }
        },
      );
    } else {
      // если браузер не поддерживает геолокацию
      const latLngInfo: google.maps.LatLng | undefined = this.map.getCenter();
      if (latLngInfo) {
        this.handleLocationError(false, latLngInfo);
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

  // запрос в Direction API
  // eslint-disable-next-line max-len
  public doDirectionRequest(startLiteral: Coordinates, endLiteral: Coordinates): void {
    const request: MapRequest = {
      destination: endLiteral, // end coordinates
      origin: startLiteral, // start coordinates
      travelMode: google.maps.TravelMode.WALKING, // DRIVING, WALKING, BICYCLING
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    this.directionsService
      .route(request, (result: DirectionsRenderer, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && result) {
          this.renderDirection(result);
          this.markers.forEach((marker: google.maps.Marker): void => marker.setOpacity(0.0));
          this.doElevationRequest(request);
        }
      })
      .catch((error: Error): void => console.error(`Directions request failed: ${error}`));
  }

  /*   public getMarkersAndWaypoints() {
    DirectionsService.route;
  } */

  public renderDirection(response: google.maps.DirectionsResult): void {
    this.directionsRenderer.setDirections(response);
  }

  public handleLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng): void {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(browserHasGeolocation ? GeoErrors.Service : GeoErrors.Browser);
    this.infoWindow.open(this.map);
  }

  public requestElevation(request: MapRequest): void {
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
    GoogleMaps.getMapElevationInfo(results);
  }

  // получение всего подъема на пути и всего спуска в метрах
  public static getMapElevationInfo(results: google.maps.ElevationResult[]): number[] {
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
    return [elevationGain, elevationLoss];
  }

  // получение всей протяженности маршрута в метрах
  public static getTotalDistance(result: google.maps.DirectionsResult): number {
    const [myRoute]: google.maps.DirectionsRoute[] = result.routes;
    return myRoute.legs.reduce((total, leg) => total + (leg?.distance?.value ?? 0), 0);
  }

  public static getTotalTime(result: google.maps.DirectionsResult): void {
    console.log(result);
  }
}
