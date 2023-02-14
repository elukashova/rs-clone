import { APIKey /* , Coordinates, DirectionsRenderer */ } from './interface-map';

export default class StaticMap {
  // private APIKey: string;

  /* constructor( APIKey: string ) {
    this.APIKey = APIKey;
  }
 */
  public static getStaticMap(center: string, zoom: number, size: string): string {
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&key=${APIKey.maps}`;
    return url;
  }
  /* public parentElement: HTMLElement;

  public mapId: string;

  public endPoint: Coordinates;

  public startPoint: Coordinates;

  public zoom: number = 8;

  public currentTravelMode: google.maps.TravelMode;

  public path: string = '';

  constructor(
    parent: HTMLElement,
    mapId: string, // id оригинала карты
    zoom: number,
    startPoint: Coordinates,
    endPoint: Coordinates,
    travelMode: google.maps.TravelMode,
  ) {
    this.parentElement = parent;
    this.mapId = `${mapId}-image`;
    this.zoom = zoom;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.currentTravelMode = travelMode;
  }

  public static drawStaticRoute(startPoint: Coordinates, endPoint: Coordinates): void {
    const req = {
      origin: startPoint,
      destination: endPoint,
      travelMode: google.maps.TravelMode.WALKING,
    };
    const service = new google.maps.DirectionsService();
    service
      .route(req, (result: DirectionsRenderer, status: google.maps.DirectionsStatus) => {
        let polyline;
        if (status === 'OK' && result) {
          polyline = result.routes[0].overview_polyline;
        }
        if (polyline) {
          StaticMap.doStaticMap(startPoint, endPoint, polyline);
        }
        return polyline;
      })
      .catch((error: Error): void => console.error(`Directions request failed: ${error}`));
  }
 */
  /* public static doStaticMap(start: Coordinates, end: Coordinates, polyline: string): string {
     const polyline = StaticMap.requestTest(startPoint, endPoint);
    console.log(polyline);
    const test = encode([startPoint, endPoint], 5);
    console.log(`test: ${test}`);
    console.log(polyline);
    const request = {
      key: `${APIKey.maps}`,
      size: '800x400',
      // path: `color:0x0000ff|weight:5|enc:${encodedPolyline}`,
      path: `color:0x1CBAA7|weight:5|geodesic:true|enc:${polyline}`,
      zoom: 8,
      // scale: 2,
      center: `${start}`,
      // markers: `${startPoint}|${endPoint}`,
      // markers: `icon:https://i.yapx.ru/VgFzC.png|${testStr}`,
      markers: `color:0xFFAE0B|${start.lat},${start.lng}|${end.lat},${end.lng}`,
    };

    const url = `https://maps.googleapis.com/maps/api/staticmap?${Object.entries(request)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
    return url;

    'https://maps.googleapis.com/maps/api/staticmap?center=40.714%2c%20-73.998&zoom=12&size=400x400&key= YOUR_API_KEY';
  } */
}
