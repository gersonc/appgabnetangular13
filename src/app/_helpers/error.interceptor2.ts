import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { AuthenticationService } from '../_services';
import {MsgService} from "../_services/msg.service";
import {ErroI} from "./erro-i";
import {ErroService} from "../shared/erro/_services/erro.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private es: ErroService,
    private ms: MsgService,
    private messageService: MessageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }

      this.es.err = err;

      // const error = err.error || err.statusText;
      const error2 = err;
      console.log('Erro->', err);
      // console.log('Err->', err);
      if (err.status !== 417) {
        const error = err.error || err.statusText;
        let data: any = {};
        data = {
          reason: error && error.error.reason ? error.error.reason : '',
          status: error.status
        };

        this.ms.add({severity: 'Error', summary: data.reason, detail: data.status});
      } else {
        const error: ErroI = err.error;
        this.ms.add({severity: 'Error', summary: error.type.toUpperCase(), detail: error.detail});
      }



      return throwError(error2);
    }));
  }
}
