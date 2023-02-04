/* export default class CustomMap {
  public googleMap!: google.maps.Map;

  constructor() {
    const mapWrapper: HTMLElement | null = document.getElementById('map');
    if (mapWrapper) {
      this.googleMap = new google.maps.Map(mapWrapper, {
        zoom: 8,
        center: { lat: 40, lng: 0 },
      });
    }
  }
}
 */

export default class GoogleMapsApi {
  public googleMap!: google.maps.Map;
  // constructor() {}

  public static initMap(): void {
    const mapWrapper: HTMLElement | null = document.getElementById('map');
    if (mapWrapper) {
      const map = new google.maps.Map(mapWrapper, {
        zoom: 8,
        center: { lat: 40, lng: 0 },
      });
      console.log(map);
    }
  }

  /* public addMarker() {
    this.map.addEventListener('click', (e: Event) => {
      if (e instanceof google.maps.LatLng) {
        const lat = google.maps.LatLng.lat();
        const lng = google.maps.LatLng.lng();
      }
    });
  } */
}
