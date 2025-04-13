import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app/app.routes';
import { CoreModule } from './app/core/core.module'; 

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CoreModule), 
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
  ],
});
