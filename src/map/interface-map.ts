export type Coordinates = {
  lat: number;
  lng: number;
};

export type MapRequest = {
  origin: Coordinates;
  destination: Coordinates;
  waypoints?: { location: Coordinates; stopover: false }[] | undefined;
  travelMode: google.maps.TravelMode;
  unitSystem?: google.maps.UnitSystem;
};

export type StaticMapRequest = {
  key: string;
  size: string;
  path: string;
  markers: string;
};

export type OptionsForMap = {
  zoom?: number;
  center: Coordinates;
  mapTypeId?: google.maps.MapTypeId;
};

export type DirectionsRenderer = google.maps.DirectionsResult | null;

export enum GeoErrors {
  Service = "Error: The Geolocation service don't work now.",
  Browser = "Error: This browser doesn't support geolocation.",
}

export enum ZoomSettings {
  Closer = 11,
}

export enum MaxMarkers {
  Count = 2,
}

export type MapPoints = {
  startPoint: Coordinates;
  endPoint: Coordinates;
};

export enum APIKey {
  maps = 'AIzaSyC90BCUHG7PI6cW9XNex-5bY3Dd44Rqhgs',
}
