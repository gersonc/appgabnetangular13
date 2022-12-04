import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { AuthenticationService } from '../_services';
import {MsgService} from "../_services/msg.service";
import {ErrI, ErroI} from "./erro-i";
import {ErroService} from "../shared/erro/_services/erro.service";

@Injectable()
export abstract class ErroInterceptado {
  abstract erro(erros: ErroI): void;
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

      // console.error('ERRO-1->:', err);
      let er: ErroI = err;
      if (err.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', err.error);

      } else {
        if (err.status !== undefined && err.status !== null) {

          if (err.status === 401) { // SEM AUTENTICACAO
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
            location.reload(true);
          }

          if (err.status === 417) {
            console.error('ERRO-1->:', er.message);
            this.ErroInterceptado.erro(er);
            return EMPTY;
          }


          if (err.status !== 417) {

            const error = err.error || err.statusText;
            let data: any = {};
            data = {
              reason: error.name,
              status: error.message!
            };
            this.ms.add({severity: 'Error', summary: data.reason, detail: data.status});
            return throwError(err);
          }/* else {
            const error: ErroI = err.error;
            this.ms.add({severity: 'Error', summary: error.type.toUpperCase(), detail: error.detail});
            return throwError(err);
          }*/

        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error( `Backend returned code ${err.status}, body was: `, err.error.text);
          return throwError(err);
        }
      }


    }));
  }
}

@Injectable()
export class ErroInterceptador implements ErroInterceptado {

  constructor(
    private es: ErroService,
  ) { }


  erro(erros: ErroI): void {
    this.es.erro = erros;
    // return erros;
  }

}
