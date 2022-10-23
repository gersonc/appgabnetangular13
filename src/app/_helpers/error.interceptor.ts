import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { AuthenticationService } from '../_services';
import {MsgService} from "../_services/msg.service";
import {ErrI, ErroI} from "./erro-i";
import {ErroService} from "../shared/erro/_services/erro.service";

@Injectable()
export abstract class ErroInterceptado {
  abstract erro(erros: any): any;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private ms: MsgService,
    private authenticationService: AuthenticationService,
    private ErroInterceptado: ErroInterceptado
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      if (err.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', err.error);

      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${err.status}, body was: `, err.error.text);
      }

      let er: ErroI = err;
      this.ErroInterceptado.erro(er);
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }

      // this.ErroInterceptado.erro(err);

      // const error = err.error || err.statusText;
      const error2 = err;
      if (error2.status !== 417) {
        const error = err.error || err.statusText;
        let data: any = {};
        /*data = {
          reason: error && error.error.reason ? error.error.reason : '',
          status: error.status
        };*/
        data = {
          reason: error2.name,
          status: error2.message!
        };

        this.ms.add({severity: 'Error', summary: data.reason, detail: data.status});

      } else {
        const error: ErroI = error2.error;
        this.ms.add({severity: 'Error', summary: error.type.toUpperCase(), detail: error.detail});
      }


      return throwError(err);

    }));
  }
}

@Injectable()
export class ErroInterceptador implements ErroInterceptado {

  constructor(
    private es: ErroService,
  ) { }


  erro(erros: any): any {
    this.es.erro = erros;
    return erros;
  }

}
