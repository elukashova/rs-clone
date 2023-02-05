import BaseComponent from '../components/base-component/base-component';

/* eslint-disable max-lines-per-function */
export default class GoogleMapsApi {
  public static map: google.maps.Map;

  public static marker: google.maps.Marker;

  public static geocoder: google.maps.Geocoder;

  public static responseDiv: HTMLDivElement;

  public static response: HTMLPreElement;

  public static currentPath: google.maps.Polyline;

  public static directionsService: google.maps.DirectionsService;

  public static directionsRenderer: google.maps.DirectionsRenderer;

  public static elevation: google.maps.ElevationService;

  public static chartDiv: BaseComponent<'div'> = new BaseComponent('div', document.body, 'chart-div', '', {
    id: 'chart-div',
  });

  public static markers: google.maps.Marker[] = [];

  constructor(
    element: HTMLElement,
    zoomNumber: number,
    latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined,
  ) {
    const map = new google.maps.Map(element, {
      zoom: zoomNumber,
      center: latLng || { lat: 40, lng: 0 },
    });
    console.log(map);
  }

  public static initMap(): void {
    const mapWrapper: HTMLElement | null = document.getElementById('map');
    GoogleMapsApi.directionsService = new google.maps.DirectionsService();
    GoogleMapsApi.directionsRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: { strokeColor: '#1CBAA7' },
      markerOptions: { icon: './assets/icons/geo.png' },
    });
    if (mapWrapper) {
      const map = new google.maps.Map(mapWrapper, {
        zoom: 8,
        center: { lat: 40, lng: 0 },
      });

      GoogleMapsApi.elevation = new google.maps.ElevationService();

      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (GoogleMapsApi.markers.length < 2) {
          GoogleMapsApi.placeMarker(event.latLng, map);
        }
      });
      GoogleMapsApi.directionsRenderer.setMap(map);
      GoogleMapsApi.directionsRenderer.setOptions({
        draggable: true,
      });

      // переменные и слушатель для определения местоположения пользователя по геолокации
      const infoWindow = new google.maps.InfoWindow();
      const locationButton = document.createElement('button');
      locationButton.textContent = 'Determine current location';
      locationButton.classList.add('custom-map-control-button');
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener('click', () => GoogleMapsApi.geoLocationButton(infoWindow, map));
    }
  }

  public static placeMarker(location: google.maps.LatLng | null, map: google.maps.Map): void {
    if (location) {
      GoogleMapsApi.marker = GoogleMapsApi.placeMarkerAndPanTo(location, map);
      map.setZoom(9);
      map.setCenter(GoogleMapsApi.marker.getPosition() as google.maps.LatLng);

      GoogleMapsApi.markers.push(GoogleMapsApi.marker);
      if (GoogleMapsApi.markers.length === 2) {
        const firstLan = GoogleMapsApi.getLat(GoogleMapsApi.markers[0]);
        const firstLng = GoogleMapsApi.getLng(GoogleMapsApi.markers[0]);
        const secondLan = GoogleMapsApi.getLat(GoogleMapsApi.markers[1]);
        const secondLng = GoogleMapsApi.getLng(GoogleMapsApi.markers[1]);

        if (firstLan && firstLng && secondLan && secondLng) {
          const pathCoordinates: google.maps.LatLngLiteral[] = [
            { lat: firstLan, lng: firstLng },
            { lat: secondLan, lng: secondLng },
          ];

          const request = {
            origin: pathCoordinates[0],
            destination: pathCoordinates[1],
            travelMode: google.maps.TravelMode.WALKING, // DRIVING, WALKING, BICYCLING
            unitSystem: google.maps.UnitSystem.METRIC, // IMPERIAL Distances are shown using miles.
          };
          GoogleMapsApi.directionsService
            .route(request, (response, status) => {
              if (status === 'OK') {
                GoogleMapsApi.directionsRenderer.setDirections(response);
                console.log(`Distance ${response?.routes[0].legs[0].distance?.text}`);
                console.log(`Duration ${response?.routes[0].legs[0].duration?.text}`);
                GoogleMapsApi.markers.forEach((marker) => marker.setOpacity(0.0));
                GoogleMapsApi.elevation
                  .getElevationAlongPath({
                    path: [request?.origin, request?.destination],
                    samples: 200,
                  })
                  .then((res) => GoogleMapsApi.plotElevation(res))
                  .catch(() => {
                    GoogleMapsApi.chartDiv.element.textContent = 'Cannot show elevation';
                  });
              }
            })
            .catch((error) => console.error(`Directions request failed: ${error}`));
        }
      }

      GoogleMapsApi.marker.addListener('click', (e: google.maps.MapMouseEvent) => {
        GoogleMapsApi.deleteMarker(e);
      });
    }
  }

  public static plotElevation({ results }: google.maps.PathElevationResponse): void {
    const chart = new google.visualization.ColumnChart(GoogleMapsApi.chartDiv.element);
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');

    for (let i = 0; i < results.length; i += 1) {
      data.addRow(['', results[i].elevation]);
    }

    chart.draw(data, {
      height: 150,
      legend: 'none',
      title: 'Elevation (m)',
      colors: ['#219486', '#1CBAA7'],
    });
  }

  public static getLat(marker: google.maps.Marker): number | undefined {
    const lat = marker?.getPosition()?.lat();
    return lat;
  }

  public static getLng(marker: google.maps.Marker): number | undefined {
    const lng = marker?.getPosition()?.lng();
    return lng;
  }

  public static deleteMarker(e: google.maps.MapMouseEvent): void {
    GoogleMapsApi.markers.forEach((marker) => {
      if (marker.getPosition() === e.latLng) {
        marker.setMap(null);
        GoogleMapsApi.markers.splice(GoogleMapsApi.markers.indexOf(marker), 1);
      }
    });
  }

  public static getRoute(): void {
    console.log(GoogleMapsApi.directionsService);
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
            GoogleMapsApi.handleLocationError(true, infoWindow, latLngInfo, map);
          }
        },
      );
    } else {
      // если браузер не поддерживает геолокацию
      const latLngInfo = map.getCenter();
      if (latLngInfo) {
        GoogleMapsApi.handleLocationError(false, infoWindow, latLngInfo, map);
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
}
