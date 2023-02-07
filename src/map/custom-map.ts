/* eslint-disable max-len */
/* import BaseComponent from '../components/base-component/base-component';
import { ElevationRequest } from './interface-map';

export default class CustomMap {
  public static map: google.maps.Map;

  public static marker: google.maps.Marker;

  public static directionsService: google.maps.DirectionsService;

  public static directionsRenderer: google.maps.DirectionsRenderer;

  public static elevation: google.maps.ElevationService;

  public static chartElevation: BaseComponent<'div'> = new BaseComponent('div', document.body, 'chart-div', '', {
    id: 'chart-div',
  });

  public static markers: google.maps.Marker[] = [];

  public mapId: number;

  constructor(mapId: number) {
    this.mapId = mapId;
    CustomMap.initMap();
  }

  public static initMap(): void {
    const mapWrapper: HTMLElement | null = document.getElementById('map');
    if (mapWrapper) {
      const myOptions = {
        zoom: 8,
        center: { lat: 40, lng: 0 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      CustomMap.map = new google.maps.Map(mapWrapper, myOptions);
      CustomMap.elevation = new google.maps.ElevationService();
      CustomMap.directionsService = new google.maps.DirectionsService();
      CustomMap.directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: '#1CBAA7' },
        markerOptions: { icon: './assets/icons/geo.png' },
      });
      CustomMap.directionsRenderer.setMap(CustomMap.map);
      CustomMap.directionsRenderer.setOptions({
        draggable: true,
      });
      CustomMap.directionsRenderer.addListener('directions_changed', () => {
        const directions = CustomMap.directionsRenderer.getDirections();
        if (directions) {
          CustomMap.computeTotalDistance(directions);
        }
      });
      // слушатель добавления маркеров
      CustomMap.map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (CustomMap.markers.length < 2) {
          CustomMap.placeMarker(event.latLng, CustomMap.map);
        }
      });
      // переменные и слушатель для определения местоположения пользователя по геолокации
      const infoWindow = new google.maps.InfoWindow();
      const locationButton = document.createElement('button');
      locationButton.textContent = 'Determine current location';
      CustomMap.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener('click', () => CustomMap.geoLocationButton(infoWindow, CustomMap.map));
    }
  }

  public static placeMarker(location: google.maps.LatLng | null, map: google.maps.Map): void {
    if (location) {
      CustomMap.marker = CustomMap.placeMarkerAndPanTo(location, map);
      CustomMap.markers.push(CustomMap.marker);

      if (CustomMap.markers.length === 2) {
        const firstLan = CustomMap.getLat(CustomMap.markers[0]);
        const firstLng = CustomMap.getLng(CustomMap.markers[0]);
        const secondLan = CustomMap.getLat(CustomMap.markers[1]);
        const secondLng = CustomMap.getLng(CustomMap.markers[1]);

        if (firstLan && firstLng && secondLan && secondLng) {
          CustomMap.doDirectionRequest(firstLan, firstLng, secondLan, secondLng);
        }
      }
    }
  }

  public static doDirectionRequest(Lan1: number, Lng1: number, Lan2: number, Lng2: number): void {
    const request = {
      origin: { lat: Lan1, lng: Lng1 }, // start coordinates
      destination: { lat: Lan2, lng: Lng2 }, // end coordinates
      travelMode: google.maps.TravelMode.WALKING, // DRIVING, WALKING, BICYCLING
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    CustomMap.directionsService
      .route(request, (response, status) => {
        if (status === 'OK' && response) {
          CustomMap.renderDirection(response);
          CustomMap.markers.forEach((marker) => marker.setOpacity(0.0));
          CustomMap.doElevationRequest(request);
        }
      })
      .catch((error) => console.error(`Directions request failed: ${error}`));
  }

  public static renderDirection(response: google.maps.DirectionsResult): void {
    CustomMap.directionsRenderer.setDirections(response);
  }

  public static doElevationRequest(request: ElevationRequest): void {
    CustomMap.elevation
      .getElevationAlongPath({
        path: [request?.origin, request?.destination],
        samples: 200,
      })
      .then((res) => CustomMap.plotElevation(res))
      .catch(() => {
        CustomMap.chartElevation.element.textContent = 'Cannot show elevation';
      });
  }

  public static plotElevation({ results }: google.maps.PathElevationResponse): void {
    const chart = new google.visualization.ColumnChart(CustomMap.chartElevation.element);
    const data = new google.visualization.DataTable();

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
    CustomMap.getMapElevationInfo(results);
  }

  public static getLat(marker: google.maps.Marker): number | undefined {
    const lat = marker?.getPosition()?.lat();
    return lat;
  }

  public static getLng(marker: google.maps.Marker): number | undefined {
    const lng = marker?.getPosition()?.lng();
    return lng;
  }

  // eslint-disable-next-line max-len
  public static placeMarkerAndPanTo(location: google.maps.LatLng, map: google.maps.Map): google.maps.Marker {
    const marker = new google.maps.Marker({
      position: location,
      map,
      animation: google.maps.Animation.DROP,
      opacity: 1,
      icon: './assets/icons/geo.png',
    });
    map.panTo(location);
    map.setZoom(9);
    return marker;
  }

  // изменение карты по геолокации при клике на кнопку
  public static geoLocationButton(infoWindow: google.maps.InfoWindow, map: google.maps.Map): void {
    // если браузер поддерживает геолокацию
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found!');
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          const latLngInfo = map.getCenter();
          if (latLngInfo) {
            CustomMap.handleLocationError(true, infoWindow, latLngInfo, map);
          }
        },
      );
    } else {
      // если браузер не поддерживает геолокацию
      const latLngInfo = map.getCenter();
      if (latLngInfo) {
        CustomMap.handleLocationError(false, infoWindow, latLngInfo, map);
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

  public static computeTotalDistance(result: google.maps.DirectionsResult): number {
    let total = 0;
    const myRoute = result.routes[0];
    if (myRoute) {
      for (let i = 0; i < myRoute.legs.length; i += 1) {
        if (myRoute.legs[i].distance) {
          total += myRoute.legs[i].distance.value;
        }
      }
    }
    return total;
  }
}
 */
