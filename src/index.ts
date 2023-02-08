import App from './app/app';
import './styles.css';

const app = new App(document.body);

window.onload = (): void => {
  app.init();
};

window.onpopstate = (): void => {
  app.handleRouting();
};
