/* eslint-disable operator-linebreak */
import BaseComponent from '../components/base-component/base-component';
import { DirectionsRendererType, LatLngType, OptionsForMap, RequestData } from './interface-map';

/* eslint-disable max-lines-per-function */
export default class GoogleMaps {
  public map!: google.maps.Map;

  public mapId: string;

  public directionsService!: google.maps.DirectionsService;

  public directionsRenderer!: google.maps.DirectionsRenderer;

  public elevation!: google.maps.ElevationService;

  public directions: google.maps.DirectionsResult[];

  public marker!: google.maps.Marker;

  public markers: google.maps.Marker[];

  public elevationNumber: number;

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
    this.markers = [];
    this.directions = [];
    this.elevationNumber = 0;
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
    this.elevation = new google.maps.ElevationService();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: { strokeColor: '#1CBAA7' },
      markerOptions: { icon: './assets/icons/geo.png' },
      draggable: true,
    });
    this.directionsRenderer.setMap(this.map);

    this.directionsRenderer.addListener('directions_changed', (): void => {
      const directions: DirectionsRendererType = this.directionsRenderer.getDirections();
      if (directions) {
        GoogleMaps.computeTotalDistance(directions);
      }
    });

    // слушатель добавления маркеров
    this.map.addListener('click', (event: google.maps.MapMouseEvent): void => {
      if (this.markers.length < 2) {
        this.placeMarker(event.latLng, this.map);
      }
    });

    // переменные и слушатель для определения местоположения пользователя по геолокации
    const infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();
    const locationButton: HTMLButtonElement = document.createElement('button');
    locationButton.textContent = 'Go to current location';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener('click', (): void => GoogleMaps.geoLocationButton(infoWindow, this.map));

    /* this.markers.forEach((marker) => {
        marker.setMap(this.map);
      });

      this.directions.forEach((direction) => {
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(this.map);
        directionsRenderer.setDirections(direction);
      }); */
  }

  public renderDirection(response: google.maps.DirectionsResult): void {
    this.directionsRenderer.setDirections(response);
  }

  public placeMarker(location: google.maps.LatLng | null, map: google.maps.Map): void {
    if (location) {
      this.marker = this.placeMarkerAndPanTo(location, map);
      this.addMarker(this.marker);

      if (this.markers.length === 2) {
        const startPoint: LatLngType | undefined = GoogleMaps.getLatLng(this.markers[0]);
        const endPoint: LatLngType | undefined = GoogleMaps.getLatLng(this.markers[1]);
        if (startPoint && endPoint) {
          const startPointLatLngLiteral: LatLngType = {
            lat: startPoint?.lat,
            lng: startPoint?.lng,
          };
          const endPointLatLngLiteral: LatLngType = {
            lat: endPoint?.lat,
            lng: endPoint?.lng,
          };
          this.doDirectionRequest(startPointLatLngLiteral, endPointLatLngLiteral);
        }
      }
    }
  }

  // eslint-disable-next-line max-len
  public placeMarkerAndPanTo(location: google.maps.LatLng, map: google.maps.Map): google.maps.Marker {
    this.marker = new google.maps.Marker({
      position: location,
      map,
      animation: google.maps.Animation.DROP,
      opacity: 1,
      icon: './assets/icons/geo.png',
    });
    map.panTo(location);
    map.setZoom(9);
    return this.marker;
  }

  public addMarker(marker: google.maps.Marker): void {
    this.markers.push(marker);
  }

  /*   public   getLat(marker: google.maps.Marker): number | undefined {
    const lat = marker?.getPosition()?.lat();
    return lat;
  }

  public   getLng(marker: google.maps.Marker): number | undefined {
    const lng = marker?.getPosition()?.lng();
    return lng;
  } */

  public static getLatLng(marker: google.maps.Marker): { lat: number; lng: number } | undefined {
    const position: google.maps.LatLng | null | undefined = marker?.getPosition();
    return position ? { lat: position.lat(), lng: position.lng() } : undefined;
  }

  // eslint-disable-next-line max-len
  public doDirectionRequest(startLiteral: google.maps.LatLngLiteral, endLiteral: google.maps.LatLngLiteral): void {
    const request: RequestData = {
      destination: endLiteral, // end coordinates
      origin: startLiteral, // start coordinates
      travelMode: google.maps.TravelMode.WALKING, // DRIVING, WALKING, BICYCLING
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    this.directionsService
      .route(request, (response: DirectionsRendererType, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && response) {
          this.renderDirection(response);
          this.markers.forEach((marker: google.maps.Marker): void => marker.setOpacity(0.0));
          this.doElevationRequest(request);
        }
      })
      .catch((error: Error): void => console.error(`Directions request failed: ${error}`));
  }

  public doElevationRequest(request: RequestData): void {
    this.elevation
      .getElevationAlongPath({
        path: [request?.origin, request?.destination],
        samples: 200,
      })
      .then((response: google.maps.PathElevationResponse): void => this.plotElevation(response))
      .catch((): void => {
        this.chartElevation.element.textContent = 'Cannot show elevation';
      });
  }

  public plotElevation({ results }: google.maps.PathElevationResponse): void {
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
      colors: ['#219486', '#1CBAA7'],
    });
    GoogleMaps.getMapElevationInfo(results);
  }

  public static computeTotalDistance(result: google.maps.DirectionsResult): number {
    let total: number = 0;
    const myRoute: google.maps.DirectionsRoute = result.routes[0];
    if (myRoute) {
      for (let i = 0; i < myRoute.legs.length; i += 1) {
        if (myRoute.legs[i].distance) {
          total += 1; /* myRoute.legs[i].distance.value */
        }
      }
    }
    return total;
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

  public static handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng,
    map: google.maps.Map,
  ): void {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service don't work now."
        : "Error:This browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }

  public static getMapElevationInfo(results: google.maps.ElevationResult[]): void {
    console.log(results);
  }

  /* public addDirection(direction: google.maps.DirectionsResult): void {
    this.directions.push(direction);
  }

  public setElevation(elevation: number): void {
    this.elevation = elevation;
  } */
}
