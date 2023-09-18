import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment.prod';

const firebaseConfig = environment.firebaseConfig;
const app = initializeApp(firebaseConfig);


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
