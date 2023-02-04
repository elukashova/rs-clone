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

      /* map.addListener('click', (event: { LatLng: google.maps.LatLng }) => {
        console.log(event.LatLng);
        console.log(GoogleMapsApi.geocoder);
        GoogleMapsApi.placeMarkerAndPanTo(event.LatLng, map);
      }); */

      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (GoogleMapsApi.markers.length < 2) {
          GoogleMapsApi.placeMarker(event.latLng, map);
        }
      });

      // переменные и слушатель для определения местоположения пользователя по геолокации
      const infoWindow = new google.maps.InfoWindow();
      const locationButton = document.createElement('button');
      locationButton.textContent = 'Determine current location';
      locationButton.classList.add('custom-map-control-button');
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener('click', () => GoogleMapsApi.geoLocationButton(infoWindow, map));
    }
    /* Посчитать дистанцию между точками
    google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);

    function calcDistance(p1, p2) {
          var d = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
          console.log(d);
} */
  }

  public static placeMarker(location: google.maps.LatLng | null, map: google.maps.Map): void {
    if (location) {
      GoogleMapsApi.marker = GoogleMapsApi.placeMarkerAndPanTo(location, map);
      map.setZoom(9);
      map.setCenter(GoogleMapsApi.marker.getPosition() as google.maps.LatLng);

      GoogleMapsApi.markers.push(GoogleMapsApi.marker);
      console.log(GoogleMapsApi.markers);

      GoogleMapsApi.marker.addListener('click', (e: google.maps.MapMouseEvent) => {
        GoogleMapsApi.deleteMarker(e);
      });
    }
  }

  public static deleteMarker(e: google.maps.MapMouseEvent): void {
    GoogleMapsApi.markers.forEach((marker) => {
      if (marker.getPosition() === e.latLng) {
        marker.setMap(null);
        GoogleMapsApi.markers.splice(GoogleMapsApi.markers.indexOf(marker), 1);
      }
    });
  }

  // eslint-disable-next-line max-len
  public static placeMarkerAndPanTo(location: google.maps.LatLng, map: google.maps.Map): google.maps.Marker {
    const marker = new google.maps.Marker({
      position: location,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    map.panTo(location);
    return marker;
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
        ? "Error: The Geolocation service don't work now."
        : "Error:This browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }
}
