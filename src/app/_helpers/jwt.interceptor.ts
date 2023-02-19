import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";

import { map, take } from "rxjs/operators";

import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { RefTokenService } from "../_services/ref-token.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private rf: RefTokenService,
    private router: Router
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request instanceof HttpRequest) {
      if (request.urlWithParams.search("viacep.com.br") === -1 &&
        request.urlWithParams.search("gbnt05raiz.s3.sa-east-1.amazonaws.com") === -1 &&
        request.urlWithParams.search("/reflesh") === -1 &&
        request.urlWithParams.search("/reliogin") === -1 &&
        request.urlWithParams.search("/login") === -1) {
        if(!request.headers.has('Authorization')) {
          request = request.clone({
            setHeaders: {
              Authorization: "Bearer " + this.rf.Token()
            }
          });
        }
        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && (event.status / 100) > 3) {
            console.log("JwtInterceptor0::event =", event);
          }
          return event;
        }));
      }

      if (request.urlWithParams.search("/reflesh") > -1 || request.urlWithParams.search("/relogin") > -1) {
        if (this.rf.vfRefExp()) {
          if(!request.headers.has('Authorization')) {
            request = request.clone({
              setHeaders: {
                Authorization: "Bearer " + this.rf.refleshToken(),
                Reflesh: "true"
              }
            });
          }
          return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && (event.status / 100) > 3) {
              console.log("JwtInterceptor1::event =", event);
            }
            return event;
          }));
        } else {
          this.router.navigate(["/login"]);
        }
      }

      if (request.urlWithParams.search("/login") > -1) {
        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && (event.status / 100) > 3) {
            console.log("JwtInterceptor3::event =", event);
          }
          return event;
        }));
      }

      if (request.urlWithParams.search("viacep.com.br") !== -1) {
        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
          return event;
        }));
      }

    }
  }
}
