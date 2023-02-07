export type ElevationRequest = {
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
