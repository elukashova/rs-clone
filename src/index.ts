import App from './app/app';
import './lang/lang';
import './styles.css';

const app = new App(document.body);

window.onload = (): void => {
  app.init();

  // строчка для добавления Google Charts
  google.charts.load('current', { packages: ['corechart'] });
};

window.onpopstate = (): void => {
  app.handleRouting();
};
