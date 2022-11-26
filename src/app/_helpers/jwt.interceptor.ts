import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import { map } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import * as http from "http";
import {Observable} from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercept', request);
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
          console.log('HttpResponse::event =', event);
        }
        return event;
      }));

  }
}
