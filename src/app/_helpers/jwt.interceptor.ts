import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';


import { MessageService } from 'primeng/api';

import { AuthenticationService } from '../_services';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // tslint:disable-next-line:max-line-length
    if (request.urlWithParams.search('viacep.com.br') === -1 && request.urlWithParams.search('gbnt05raiz.s3.sa-east-1.amazonaws.com') === -1) {
      const currentUser = this.authenticationService.currentUserValue;
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + currentUser.token
          }
        });
      }
    }
    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (event.status / 100) > 3) {
          console.log('HttpResponse::event =', event, ';');
        } else {
         console.log('JwtInterceptor event =', event, ';');
        }
        return event;
      }));

  }
}
