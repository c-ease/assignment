import { ApplicationConfig } from '@angular/core';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';


function loggingInterceptors(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log("\n[Ongoing request]", request)
  return next(request).pipe(
    tap({
      next: event => {
        if (event.type === HttpEventType.Response) {
          console.log("\n[Incoming Response] Status: ", event.status, event)
        }
      }
    })
  );
}

// called when httpreq is made or httpres is recieved, helps log, cache and modify them
// clone to add token token gen

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loggingInterceptors])
    ),    
  ]
};
