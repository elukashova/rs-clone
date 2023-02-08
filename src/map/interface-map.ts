export type Coordinates = {
  lat: number;
  lng: number;
};

export type MapRequest = {
  origin: Coordinates;
  destination: Coordinates;
  travelMode: google.maps.TravelMode;
  unitSystem: google.maps.UnitSystem;
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
  Closer = 7,
}
