import App from './app/app';
import './styles.css';
// import CustomMap from './map/custom-map';

const app = new App(document.body);

window.onload = (): void => {
  app.init();

  // строчка для добавления Google Charts
  google.charts.load('current', { packages: ['corechart'] });
};

// делаем метод initMap глобальным
declare global {
  interface Window {
    initMap: (elem: HTMLElement, options: google.maps.MapOptions) => void;
  }
}
window.initMap = (parent: HTMLElement, options: google.maps.MapOptions): google.maps.Map => {
  const map = new google.maps.Map(parent, options);
  return map;
};

window.onpopstate = (): void => {
  app.handleRouting();
};
