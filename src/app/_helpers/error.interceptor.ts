import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MsgService} from "../_services/msg.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private ms: MsgService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let erro: any[];
    return next.handle(req)
      .pipe(
        tap({
          next: (event) => {
            if (event instanceof HttpResponse) {
              if ((event.status / 100) > 3) {
                console.log("handleError ERRO status", event.status);
                console.log("handleError ERRO ok", event.ok);
                console.log("handleError ERRO url", event.url);
                console.log("handleError ERRO body", event.body);
                console.log("handleError ERRO type", event.type);
                console.log("handleError ERRO headers", event.headers);
                console.log("handleError ERRO statusText", event.statusText);
              }

              if (event.body !== undefined && event.body !== null) {
                if (event.body.erro !== undefined && event.body.erro !== null) {
                  if (Array.isArray(event.body.erro)) {
                    this.ms.add({key: 'toastprincipal', severity: 'error', summary: 'ERRO', detail: event.body.erro[2]});
                  }
                }
              }
            }
          },
          error: (err) => {
            if (err instanceof HttpErrorResponse) {
              this.ms.add({key: 'toastprincipal', severity: 'error', summary: 'ERRO', detail: err.status + ' ' + err.message});
            } else {
              this.ms.add({key: 'toastprincipal', severity: 'error', summary: 'ERRO', detail: err});
            }
          }
        }),
        catchError(error =>
          ErrorInterceptor.handleError(this.ms,error, req, next)
        )
      );
  }


  private static handleError(ms: MsgService, err: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let errorMsg = '';
    if (err.error instanceof ErrorEvent) {
      // console.log('This is client side error', err.error.message);
      errorMsg = `Error: ${err.error.message}`;
      ms.add({key: 'toastprincipal', severity: 'error', summary: 'ERRO', detail: errorMsg});
    } else {
      // console.log('This is server side error', err.status, err.message);
      errorMsg = `Error Code: ${err.status},  Message: ${err.message}`;
      ms.add({key: 'toastprincipal', severity: 'error', summary: 'ERRO', detail: errorMsg});
    }
    // if token has expired
    if (err.status == 401) {
      console.log('refresh JWT token');
      // refresh JWT token
    }
    // server error
    else if (err.status == 500) {
      console.log('handle your server error here');
      //  handle your server error here
    }
    // rethrow Error
    console.log('Error', err.status);
    return of(err);
  }
}


