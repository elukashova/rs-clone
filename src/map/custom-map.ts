/* eslint-disable max-lines-per-function */
export default class GoogleMapsApi {
  public static map: google.maps.Map;

  public static marker: google.maps.Marker;

  public static geocoder: google.maps.Geocoder;

  public static responseDiv: HTMLDivElement;

  public static response: HTMLPreElement;

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
    if (mapWrapper) {
      const map = new google.maps.Map(mapWrapper, {
        zoom: 8,
        center: { lat: 40, lng: 0 },
      });

      /*
      Для маркера
      draggable: true,
      title: 'Start route!', */

      /* map.addListener('click', (event: { LatLng: google.maps.LatLng }) => {
        console.log(event.LatLng);
        console.log(GoogleMapsApi.geocoder);
        GoogleMapsApi.placeMarkerAndPanTo(event.LatLng, map);
      }); */

      /* GoogleMapsApi.marker = new google.maps.Marker({
        map,
      }); */

      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        GoogleMapsApi.placeMarker(event.latLng, map);
      });

      /*  map.addListener('click', (e: google.maps.MapMouseEvent) => {
        GoogleMapsApi.geocode({ location: e.latLng });
      }); */

      // переменные и слушатель для определения местоположения пользователя по геолокации
      const infoWindow = new google.maps.InfoWindow();
      const locationButton = document.createElement('button');
      locationButton.textContent = 'Determine current location';
      locationButton.classList.add('custom-map-control-button');
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener('click', () => GoogleMapsApi.geoLocationButton(infoWindow, map));
    }
    /* google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);

    function calcDistance(p1, p2) {
          var d = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
          console.log(d);
} */
  }

  public static placeMarker(location: google.maps.LatLng | null, map: google.maps.Map): void {
    if (location) {
      GoogleMapsApi.marker = new google.maps.Marker({
        position: location,
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });
      map.panTo(location);
      GoogleMapsApi.marker.addListener('click', (e: google.maps.MapMouseEvent) => {
        console.log(e);
        console.log(GoogleMapsApi.marker);
        /* marker = markers[id];
        marker.setMap(null); */
      });
    }
  }

  /* public static geocode(request: google.maps.GeocoderRequest): void {
    GoogleMapsApi.clear();

    GoogleMapsApi.geocoder = new google.maps.Geocoder();
    GoogleMapsApi.geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;

        GoogleMapsApi.map.setCenter(results[0].geometry.location);
        GoogleMapsApi.marker.setPosition(results[0].geometry.location);
        GoogleMapsApi.marker.setMap(GoogleMapsApi.map);
        GoogleMapsApi.response.innerText = JSON.stringify(result, null, 2);
        return results;
      })
      .catch((e) => {
        console.log(`Geocode was not successful ${e}`);
      });
  }

  public static clear(): void {
    GoogleMapsApi.marker.setMap(null);
  } */

  public static placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map): void {
    const marker = new google.maps.Marker({
      position: latLng,
      map,
    });
    console.log(marker);
    map.panTo(latLng);
  }

  // изменение карты по еолокации при клике на кнопку
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
        ? 'Error: The Geolocation service failed.'
        : "Error:This browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }

  public static addMarker(latLng: google.maps.LatLng): void {
    console.log(latLng);
    console.log('test');
    /* if (event instanceof google.maps.LatLng) {
      const lat = google.maps.LatLng.lat();
      const lng = google.maps.LatLng.lng();
    } */
  }
}
