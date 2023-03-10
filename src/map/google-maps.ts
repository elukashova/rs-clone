/* eslint-disable max-lines-per-function */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import { v4 } from 'uuid';
import { decode, LatLngTuple } from '@googlemaps/polyline-codec';
import './google-maps.css';
import i18next from 'i18next';
import BaseComponent from '../components/base-component/base-component';
import Button from '../components/base-component/button/button';
import { ProjectColors } from '../utils/consts';
import {
  DirectionsRenderer,
  GeoErrors,
  Coordinates,
  MapRequest,
  OptionsForMap,
  APIKey,
  StaticMapRequest,
} from './interface-map';
import eventEmitter from '../utils/event-emitter';

export default class GoogleMaps {
  private dictionary: Record<string, string> = {
    elevationError: 'map.elevationError',
    elevation: 'map.elevation',
    locationFound: 'map.locationFound',
    routeNotFound: 'map.routeNotFound',
    ok: 'map.ok',
  };

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

  public directions: google.maps.DirectionsResult | undefined;

  public marker!: google.maps.Marker;

  public markers: google.maps.Marker[] = [];

  public startPoint!: Coordinates;

  public endPoint!: Coordinates;

  public currentTravelMode: string;

  public waypoints!: google.maps.DirectionsWaypoint[];

  public elevationTotal: string = '0,0';

  public distanceTotal: number = 0;

  public timeTotal!: { hours: string; minutes: string; seconds: string };

  public maxMarkerCount: number = 2;

  public zoom: number = 13;

  public latLng: { lat: number; lng: number };

  public mapWrapper!: BaseComponent<'div'>;

  public chartElevation!: BaseComponent<'div'> | undefined;

  public locationButton!: Button;

  public clearButton!: Button;

  private elevationChart: boolean = true;

  private badRouteBlock!: HTMLDivElement;

  private okButton!: Button;

  private popup!: google.maps.InfoWindow;

  constructor(parent: HTMLElement, center: Coordinates, travelMode: string, elevationChart: boolean) {
    this.mapId = v4();
    this.latLng = center;
    this.elevationChart = elevationChart;
    this.renderMap(parent);
    this.initMap(this.mapWrapper.element, center);
    this.currentTravelMode = GoogleMaps.getTravelMode(travelMode.toUpperCase());
    this.parentElement = parent;
    this.changeLanguageOnThisPage();
  }

  public renderMap(parent: HTMLElement): void {
    this.mapWrapper = new BaseComponent('div', parent, 'map-wrapper', '', {
      id: 'map-wrapper',
      style: 'height: 50vh',
    });
  }

  // ???????????????????????? ?????????? google maps, ???? ???????????????????? ?? ???????????????????? ??????????
  public initMap(parent: HTMLElement, latLng: { lat: number; lng: number }): void {
    const myOptions: OptionsForMap = {
      zoom: this.zoom,
      minZoom: 0,
      maxZoom: 20,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
    };
    this.map = new google.maps.Map(parent, myOptions);
    this.directionsRenderer.setMap(this.map);

    // ???????????????????? ?? ?????????????????? ?????? ?????????????????????? ???????????????????????????? ???????????????????????? ???? ????????????????????
    this.locationButton = new Button(document.body, i18next.t('map.locationBtn'));
    this.locationButton.element.style.marginTop = '10px';
    this.locationButton.element.style.marginRight = '1rem';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.locationButton.element);

    this.clearButton = new Button(document.body, i18next.t('map.clearBtn'));
    this.clearButton.element.style.marginTop = '10px';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.clearButton.element);
    this.renderMessage();
    this.addListeners();
  }

  private static subscribeToEvents(): void {
    eventEmitter.emit('changeMap', {});
  }

  private addListeners(): void {
    this.okButton.element.addEventListener('click', (event: MouseEvent): void => {
      event.preventDefault();
      this.deleteRoute();
      this.badRouteBlock.classList.add('hidden');
    });

    // ?????????????????? ???????????????????? ???????????????? (???? ?????????? 2)
    this.map.addListener('click', (event: google.maps.MapMouseEvent): void => {
      if (this.markers.length < this.maxMarkerCount) {
        this.placeMarker(event.latLng, this.map);
      }
      if (this.markers.length === this.maxMarkerCount && !this.directions) {
        GoogleMaps.subscribeToEvents();
      }
    });

    this.locationButton.element.addEventListener('click', (event: MouseEvent): void => {
      event.preventDefault();
      this.changeGeolocation();
    });

    this.directionsRenderer.addListener('directions_changed', (): void => {
      const directions: google.maps.DirectionsResult | null = this.directionsRenderer.getDirections();
      if (directions) {
        this.getTotalDistanceAndTime(directions.routes[0]);
      }
    });

    this.clearButton.element.addEventListener('click', (event: MouseEvent): void => {
      event.preventDefault();
      this.deleteRoute();
      if (this.chartElevation) {
        this.chartElevation.element.remove();
      }
    });

    /*     google.maps.event.addListener(this.map, 'zoom_changed', () => {
      const zoomLevel = this.map.getZoom();
      if (zoomLevel) {
        this.map.setZoom(zoomLevel);
      }
    }); */
  }

  // ?????????????????? ????????????
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

  // ???????????????? ???????????????????? ???????????? ?????????????? ?? ???????????????????? ???? ???????? ??????????
  public placeMarkerAndPanTo(location: google.maps.LatLng, map: google.maps.Map): google.maps.Marker {
    this.marker = new google.maps.Marker({
      position: location,
      map,
      animation: google.maps.Animation.DROP,
      opacity: 1,
      icon: './assets/icons/png/geo.png',
      draggable: false,
      anchorPoint: new google.maps.Point(15, 30),
    });
    map.panTo(location);
    return this.marker;
  }

  // ?????????????????? ???????????? ?? ???????????? ????????????????
  public addMarkerToMarkers(marker: google.maps.Marker): void {
    this.markers.push(marker);
  }

  // ?????????????????? ???????????????? ???????????? ?? ?????????????? ???? ??????????????
  public static getLatLng(marker: google.maps.Marker): Coordinates | undefined {
    const position: google.maps.LatLng | null | undefined = marker?.getPosition();
    return position ? { lat: position.lat(), lng: position.lng() } : undefined;
  }

  // ???????????? ?? Direction API ???? ?????????????????? ????????
  public async doDirectionRequest(startPoint: Coordinates, endPoint: Coordinates, selectedMode: string): Promise<void> {
    const travelMode: google.maps.TravelMode = GoogleMaps.getTravelMode(selectedMode);
    const request: MapRequest = {
      origin: startPoint,
      destination: endPoint,
      travelMode: travelMode || google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    await this.directionsService
      .route(request, (result: DirectionsRenderer, status: google.maps.DirectionsStatus): void => {
        if (status === 'OK' && result) {
          this.directionsRenderer.setMap(this.map);
          this.directionsRenderer.setDirections(result);
          this.directions = result;
          this.getTotalDistanceAndTime(result.routes[0]);
          if (this.elevationChart) {
            this.doElevationRequest(result);
          }
        } else if (status === 'ZERO_RESULTS') {
          this.showMessage();
        } else {
          console.error("This route can't be laid.");
        }
      })
      .catch((error: Error): void => console.error(`Directions request failed: ${error}`));
  }

  // eslint-disable-next-line max-len
  public async doElevationRequest(result: DirectionsRenderer): Promise<void> {
    try {
      if (result) {
        const response = await this.elevation.getElevationAlongPath({
          path: result.routes[0].overview_path,
          samples: 200,
        });
        if (response) {
          const { results } = response;
          const elevationInfo = this.getMapElevationInfo(results);
          this.drawPlotElevation(response, elevationInfo);
        }
      }
    } catch (error: unknown) {
      const message = i18next.t(this.dictionary.elevationError);
      console.log(`${message}: ${error}`);
    }
  }

  public drawPlotElevation({ results }: google.maps.PathElevationResponse, elevationInfo: string): void {
    if (this.chartElevation) {
      this.chartElevation.element.remove();
    }
    this.chartElevation = new BaseComponent('div', this.parentElement, 'chart-div', '', {
      id: 'chart-div',
      'data-el': `${elevationInfo}`,
    });
    const chart: google.visualization.ColumnChart = new google.visualization.ColumnChart(this.chartElevation.element);
    const data: google.visualization.DataTable = new google.visualization.DataTable();

    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');

    for (let i: number = 0; i < results.length; i += 1) {
      data.addRow(['', results[i].elevation]);
    }

    chart.draw(data, {
      height: 150,
      legend: 'none',
      title: i18next.t(`${this.dictionary.elevation}`).toString(),
      colors: [ProjectColors.Turquoise],
      backgroundColor: localStorage.getItem('theme') === 'theme-dark' ? '#455268' : '#dcdcdc',
      titleTextStyle: {
        color: localStorage.getItem('theme') === 'theme-dark' ? '#d6d6d6' : '#4a4a4a',
        fontName: 'sans-serif',
      },
    });
  }

  // ?????????????????? ?????????? ?????????????? ???? ???????? ?? ?????????? ???????????? ?? ????????????
  public getMapElevationInfo(results: google.maps.ElevationResult[]): string {
    let elevationGain = 0;
    let elevationLoss = 0;
    for (let i = 0; i < results.length - 1; i += 1) {
      const currentElevation: number = results[i].elevation;
      const nextElevation: number = results[i + 1].elevation;
      if (currentElevation < nextElevation) {
        elevationGain += nextElevation - currentElevation;
      } else {
        elevationLoss += currentElevation - nextElevation;
      }
    }
    this.elevationTotal = `${elevationGain.toFixed(0)},${elevationLoss.toFixed(0)}`;
    return this.elevationTotal;
  }

  // ?????????????????? ???????? ?????????????????????????? ???????????????? ?? ????????????
  public getTotalDistanceAndTime(route: google.maps.DirectionsRoute): void {
    const [legs]: google.maps.DirectionsLeg[] = route.legs;
    if (legs.distance) {
      this.distanceTotal = +(legs.distance.value / 1000).toFixed(1) ?? 0;
    }
    if (legs.duration) {
      const hoursFull = Math.floor(legs.duration.value / 60 / 60);
      const minutesFull = Math.floor(legs.duration.value / 60) - hoursFull * 60;
      const secondsFull = legs.duration.value % 60;
      const hours = GoogleMaps.addPadStart(hoursFull);
      const minutes = GoogleMaps.addPadStart(minutesFull);
      const seconds = GoogleMaps.addPadStart(secondsFull);
      this.timeTotal = { hours, minutes, seconds } ?? { hours: 0, minutes: 0, seconds: 0 };
    }
  }

  private static addPadStart(time: number): string {
    const result = time.toString().padStart(2, '0');
    return result;
  }

  public catchLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng): void {
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(browserHasGeolocation ? GeoErrors.Service : GeoErrors.Browser);

    this.infoWindow.open(this.map);
  }

  // ?????????????????? ?????????? ???? ???????????????????? ?????? ?????????? ???? ????????????
  public changeGeolocation(): void {
    // ???????? ?????????????? ???????????????????????? ????????????????????
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition): void => {
          const pos: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.infoWindow.setPosition(pos);
          this.infoWindow.setContent(i18next.t(this.dictionary.locationFound));
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
      // ???????? ?????????????? ???? ???????????????????????? ????????????????????
      const latLngInfo: google.maps.LatLng | undefined = this.map.getCenter();
      if (latLngInfo) {
        this.catchLocationError(false, latLngInfo);
      }
    }
  }

  public renderMessage(): void {
    this.popup = new google.maps.InfoWindow();
    this.badRouteBlock = document.createElement('div');
    this.badRouteBlock.classList.add('google-maps__popup', 'hidden');
    const text = new BaseComponent('p', this.badRouteBlock, 'google-maps__popup-text');
    text.textContent = i18next.t(this.dictionary.routeNotFound);
    this.okButton = new Button(this.badRouteBlock, this.dictionary.ok, 'google-maps__popup-button');
    this.badRouteBlock.append(this.okButton.element);
    this.popup.setContent(this.badRouteBlock);
    this.popup.open(this.map);
  }

  public showMessage(): void {
    this.badRouteBlock.classList.remove('hidden');
  }

  public deleteRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
    this.timeTotal = { hours: '00', minutes: '00', seconds: '00' };
    this.distanceTotal = 0;
    this.elevationTotal = '0,0';
    this.markers.forEach((marker: google.maps.Marker): void => marker.setMap(null));
    this.markers.length = 0;
    this.directions = undefined;
  }

  public deleteMap(): void {
    this.deleteRoute();
    this.parentElement.removeChild(this.mapWrapper.element);
  }

  public static async drawStaticMap(
    startPoint: Coordinates,
    endPoint: Coordinates,
    activityType: string,
  ): Promise<string> {
    const travelMode = activityType === 'BICYCLING' ? google.maps.TravelMode.BICYCLING : google.maps.TravelMode.WALKING;
    const data: string = await GoogleMaps.doRequestForStaticMap(startPoint, endPoint, travelMode);
    const url: string = GoogleMaps.createURL(startPoint, endPoint, data);
    return url;
  }

  public static async doRequestForStaticMap(
    startPoint: Coordinates,
    endPoint: Coordinates,
    activityType: google.maps.TravelMode,
  ): Promise<string> {
    const request: MapRequest = {
      origin: startPoint,
      destination: endPoint,
      travelMode: activityType,
    };
    let response: string = '';
    const service: google.maps.DirectionsService = new google.maps.DirectionsService();
    try {
      const result: google.maps.DirectionsResult = await service.route(request);
      if (result) {
        const decodedLine: LatLngTuple[] = decode(result.routes[0].overview_polyline);
        response = decodedLine.map((coordinate: LatLngTuple): string => coordinate.join(',')).join('|');
        return response;
      }
    } catch (error: unknown) {
      console.error(`Directions request failed: ${error}`);
    }
    return response;
  }

  public static createURL(start: Coordinates, end: Coordinates, line: string): string {
    const request: StaticMapRequest = {
      key: `${APIKey.maps}`,
      size: '800x400',
      path: `color:0xFF8D24ff|weight:5|${line}`,
      markers: `color:0xFFAE0B|${start.lat},${start.lng}|${end.lat},${end.lng}`,
    };

    const url: string = `https://maps.googleapis.com/maps/api/staticmap?${Object.entries(request)
      .map(([key, value]: [string, string]): string => `${key}=${value}`)
      .join('&')}`;
    return url;
  }

  public static getTravelMode(value: string): google.maps.TravelMode {
    switch (value) {
      case 'WALKING':
        return google.maps.TravelMode.WALKING;
      case 'BICYCLING':
        return google.maps.TravelMode.BICYCLING;
      default:
        return google.maps.TravelMode.WALKING;
    }
  }

  public async updateTravelMode(travelMode: string, origin: Coordinates, destination: Coordinates): Promise<void> {
    this.currentTravelMode = travelMode;
    const temp: void = await this.doDirectionRequest(origin, destination, travelMode);
    return temp;
  }

  private changeLanguageOnThisPage(): void {
    i18next.on('languageChanged', () => {
      this.locationButton.element.textContent = i18next.t('map.locationBtn');
      this.clearButton.element.textContent = i18next.t('map.clearBtn');
    });
  }
}
