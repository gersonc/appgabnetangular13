import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';

import { map, take } from "rxjs/operators";

import { Observable } from "rxjs";
import {AutenticacaoService} from "../_services/autenticacao.service";
import { Router } from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private aut: AutenticacaoService,
    private router: Router,
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
          return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && (event.status / 100) > 3) {
              console.log('JwtInterceptor2::event =', event);
            }
            return event;
          }));
        } else {
          if (this.aut.rtkvalido) {
            this.aut.refleshToken().pipe(take(1)).subscribe({
              next: (vf) => {
                if (vf) {
                  request = request.clone({
                    setHeaders: {
                      Authorization: 'Bearer ' + this.aut.token
                    }
                  });
                  return next.handle(request).pipe(map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse && (event.status / 100) > 3) {
                      console.log('JwtInterceptor2::event =', event);
                    }
                    return event;
                  }));
                } else {
                  this.router.navigate(['/login']);
                }
              }
            });
            /*request = request.clone({
              setHeaders: {
                Authorization: 'Bearer ' + this.aut.refToken
              }
            });*/
          } else {
            this.router.navigate(['/login']);
          }
        }
      }


      if (request.urlWithParams.search('/reflesh') > -1) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + this.aut.refToken,
            Reflesh: 'true'
          }
        });
      }

      return next.handle(request).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (event.status / 100) > 3) {
          console.log('JwtInterceptor2::event =', event);
        }
        return event;
      }));
    }

  }
}
