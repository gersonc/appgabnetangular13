import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse, HttpHeaderResponse
} from '@angular/common/http';
import {EMPTY, finalize, Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /*intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => ErrorInterceptor.handleError(error, req, next))
    );
  }*/
  private handleError: HandleError;

  constructor(
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('Erro Interceptor');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("handleError 1");
    if (next instanceof HttpResponse) {
      console.log("handleError 2");
      let ok: string;
      return next.handle(req)
        .pipe(
          tap({
            // Succeeds when there is a response; ignore other events
            next: (event) => (ok = event instanceof HttpHeaderResponse ? event.status.toString() : ''),
            // Operation failed; error is an HttpErrorResponse
            error: (err) => (err instanceof HttpErrorResponse ? err.status + ' ' + err.message : err.message)
          }),
          // Log when response observable either completes or errors
          finalize(() => {
            const elapsed = Date.now();
            const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
            // this.messenger.add(msg);
            console.log("handleError 3", ok);
            console.log("handleError 4", msg);
          })
        );






     /* return next.handle(req).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
          console.log('HttpResponse::event3 =', event, event.status);
          this.handleError('search', [event,event.status ])
        }
        console.log("handleError 4");
        return event;
      }));*/

    } else {
      console.log("handleError 5");
      return next.handle(req);
    }


    /*return next.handle(req)
      .pipe(
        map(res => {
          console.log("Passed through the interceptor in response");
          return res;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('This is client side error', error.error.message);
            errorMsg = `Error: ${error.error.message}`;
          } else {
            console.log('This is server side error', error.status, error.message);
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          console.log(errorMsg);
          return throwError(() => error);
        })
      )*/
  }


  /*private static handleError(err: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<any> {

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
    return throwError(() => err);
  }*/
}
