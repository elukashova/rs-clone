export type MapRequest = {
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  travelMode: google.maps.TravelMode;
  unitSystem: google.maps.UnitSystem;
};

export type OptionsForMap = {
  zoom?: number;
  center: {
    lat: number;
    lng: number;
  };
  mapTypeId?: google.maps.MapTypeId;
};

export type DirectionsRendererType = google.maps.DirectionsResult | null;

export type LatLngType = {
  lat: number;
  lng: number;
};
