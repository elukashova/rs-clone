import App from './app/app';

const app = new App(document.body);

app.init();

function initMap(): void {
  const mapWrapper: HTMLElement | null = document.getElementById('map');
  if (mapWrapper) {
    const map = new google.maps.Map(mapWrapper, {
      zoom: 8,
      center: { lat: 40, lng: 0 },
    });
    console.log(map);
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
