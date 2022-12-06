import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        console.log('ResponseInterceptor event1->', event.status);
        console.log('ResponseInterceptor event2->', event.body);
        //event = event.clone({body: ResponseInterceptor.modifyBody(event.body)});
      }
      return event;
    }));

  }

  private static modifyBody(body: any) {
    /*
    * write your logic to modify the body
    * */
    console.log('body', body);
    return body;
  }
}

