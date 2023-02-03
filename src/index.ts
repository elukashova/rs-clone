import App from './app/app';

const app = new App(document.body);

window.onload = (): void => {
  app.init();
};

window.onpopstate = (): void => {
  app.locationHandler();
};
