import App from './app/app';
import CustomMap from './map/custom-map';

const app = new App(document.body);
app.init();

// добавляем скрипт с ключом апи в конец верстки
App.addKey(document.body);

// делаем метод initMap класса CustomMap глобальным, чтобы избежать
// ошибки TypeError: window.initMap is not a function
declare global {
  interface Window {
    initMap: (elem: HTMLElement, num: number) => void;
  }
}
window.initMap = CustomMap.initMap;

google.charts.load('current', { packages: ['corechart'] });
