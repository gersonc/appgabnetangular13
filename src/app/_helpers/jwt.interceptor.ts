import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';

import { map } from 'rxjs/operators';

import {Observable} from "rxjs";
import {AutenticacaoService} from "../_services/autenticacao.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private aut: AutenticacaoService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request instanceof HttpRequest) {
      // if (request.urlWithParams.search('viacep.com.br') === -1 && request.urlWithParams.search('gbnt05raiz.s3.sa-east-1.amazonaws.com') === -1 && request.urlWithParams.search('/reflesh') === -1 && request.urlWithParams.search('/msg') === -1) {
      if (request.urlWithParams.search('viacep.com.br') === -1 && request.urlWithParams.search('gbnt05raiz.s3.sa-east-1.amazonaws.com') === -1 && request.urlWithParams.search('/reflesh') === -1) {
        if (this.aut.vfToken) {
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + this.aut.token
            }
          });
        }
      }
      if (request.urlWithParams.search('/reflesh') > -1) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + this.aut.refToken
          }
        });
      }
    }


    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (event.status / 100) > 3) {
          console.log('JwtInterceptor2::event =', event);
        }
        return event;
      }));

  }
}
