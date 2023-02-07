import App from './app/app';
// import CustomMap from './map/custom-map';

const app = new App(document.body);

window.onload = (): void => {
  app.init();
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
// строчка для добавления Charts
google.charts.load('current', { packages: ['corechart'] });

window.onpopstate = (): void => {
  app.handleRouting();
};
