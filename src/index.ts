import App from './app/app';
// import CustomMap from './map/custom-map';

const app = new App(document.body);
app.init();

// делаем метод initMap глобальным, чтобы избежать
// ошибки TypeError: window.initMap is not a function
declare global {
  interface Window {
    initMap: (elem: HTMLElement, options: google.maps.MapOptions) => void;
  }
}

window.initMap = (parent: HTMLElement, options: google.maps.MapOptions): google.maps.Map => {
  const map = new google.maps.Map(parent, options);
  return map;
};

google.charts.load('current', { packages: ['corechart'] });

/* declare global {
  interface Window {
    initMap: (elem: HTMLElement, num: number) => void;
  }
}
window.initMap = CustomMap.initMap;

google.charts.load('current', { packages: ['corechart'] });
 */
