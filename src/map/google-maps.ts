import BaseComponent from '../components/base-component/base-component';
import Button from '../components/button/button';
import { ProjectColors } from '../utils/consts';
import { DirectionsRendererType, GeoErrors, LatLngType, MapRequest, OptionsForMap } from './interface-map';

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

  public elevationNumber: number = 0;

  public maxMarkerCount: number = 2;

  public zoom: number;

  public latLng: { lat: number; lng: number };

  public mapWrapper!: BaseComponent<'div'>;

  public chartElevation!: BaseComponent<'div'>;

  constructor(
    parent: HTMLElement,
    mapId: string,
    zoom: number,
    center: {
      lat: number;
      lng: number;
    },
  ) {
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
      GoogleMaps.geoLocationButton(this.infoWindow, this.map);
    });
  }

  // размещаем маркер
  public placeMarker(location: google.maps.LatLng | null, map: google.maps.Map): void {
    if (location) {
      this.marker = this.placeMarkerAndPanTo(location, map);
      this.addMarkerToMarkers(this.marker);

      if (this.markers.length === this.maxMarkerCount) {
        const startPoint: LatLngType | undefined = GoogleMaps.getLatLng(this.markers[0]);
        const endPoint: LatLngType | undefined = GoogleMaps.getLatLng(this.markers[1]);
        if (startPoint && endPoint) {
          const startPointLatLngLiteral: LatLngType = {
            lat: startPoint.lat,
            lng: startPoint.lng,
          };
          const endPointLatLngLiteral: LatLngType = {
            lat: endPoint.lat,
            lng: endPoint.lng,
          };
          this.doDirectionRequest(startPointLatLngLiteral, endPointLatLngLiteral);
        }
      }
    }
  }

  // изменение карты по геолокации при клике на кнопку
  public static geoLocationButton(infoWindow: google.maps.InfoWindow, map: google.maps.Map): void {
    // если браузер поддерживает геолокацию
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition): void => {
          const pos: LatLngType = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found!');
          infoWindow.open(map);
          map.setCenter(pos);
        },
        (): void => {
          const latLngInfo: google.maps.LatLng | undefined = map.getCenter();
          if (latLngInfo) {
            GoogleMaps.handleLocationError(true, infoWindow, latLngInfo, map);
          }
        },
      );
    } else {
      // если браузер не поддерживает геолокацию
      const latLngInfo: google.maps.LatLng | undefined = map.getCenter();
      if (latLngInfo) {
        GoogleMaps.handleLocationError(false, infoWindow, latLngInfo, map);
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
    map.setZoom(9);
    return this.marker;
  }

  // добавляем маркер в массив маркеров
  public addMarkerToMarkers(marker: google.maps.Marker): void {
    this.markers.push(marker);
  }

  // получение литерала широты и долготы по маркеру
  public static getLatLng(marker: google.maps.Marker): { lat: number; lng: number } | undefined {
    const position: google.maps.LatLng | null | undefined = marker?.getPosition();
    return position ? { lat: position.lat(), lng: position.lng() } : undefined;
  }

  // запрос в Direction API
  // eslint-disable-next-line max-len
  public doDirectionRequest(startLiteral: google.maps.LatLngLiteral, endLiteral: google.maps.LatLngLiteral): void {
    const request: MapRequest = {
      destination: endLiteral, // end coordinates
      origin: startLiteral, // start coordinates
      travelMode: google.maps.TravelMode.WALKING, // DRIVING, WALKING, BICYCLING
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    this.directionsService
      .route(request, (response: DirectionsRendererType, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && response) {
          console.log(request, response, status);
          this.renderDirection(response);
          this.markers.forEach((marker: google.maps.Marker): void => marker.setOpacity(0.0));
          this.doElevationRequest(request);
          console.log(response?.routes[0].legs[0].distance?.text);
        }
      })
      .catch((error: Error): void => console.error(`Directions request failed: ${error}`));
  }

  public renderDirection(response: google.maps.DirectionsResult): void {
    this.directionsRenderer.setDirections(response);
  }

  public static handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng,
    map: google.maps.Map,
  ): void {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? GeoErrors.Service : GeoErrors.Browser);
    infoWindow.open(map);
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
    const myRoute: google.maps.DirectionsRoute = result.routes[0];
    if (myRoute) {
      return myRoute.legs.reduce((total, leg) => {
        if (leg.distance) {
          return total + leg.distance.value;
        }
        return total;
      }, 0);
    }
    return 0;
  }

  public static getTotalTime(result: google.maps.DirectionsResult): void {
    console.log(result);
  }
}
