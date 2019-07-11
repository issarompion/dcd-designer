import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import { defineCustomElements as defineCustomElementsGoogleMaps } from 'web-google-maps/dist/loader'; //Map

if (environment.production) {
  enableProdMode();
}

defineCustomElementsGoogleMaps(window); //Map

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
  //Maybe here?
});
