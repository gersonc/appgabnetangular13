import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }

      const error = err.error || err.statusText;

      console.log('Erro->', error);

      let data: any = {};
      data = {
        reason: error && error.error.reason ? error.error.reason : '',
        status: error.status
      };
      this.messageService.add({severity: 'success', summary: data.reason, detail: data.status});

      return throwError(error);
    }));
  }
}
