import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, take} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private url = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
  ) { }

  login(username: string, password: string) {
    const bt = username + ':' + password;
    const hvalue = 'Basic ' + btoa(bt);
    const url = this.url + '/login';
    console.log('aut-login1', hvalue);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': hvalue
      })
    };
    return this.http.get<any>(url, httpOptions)
      .pipe(
        take(1),
        map(user => {
          console.log('aut-login2', user);
          if (user && user.token) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            localStorage.removeItem('reflesh_token');
            localStorage.removeItem('expiresRef');
            localStorage.removeItem('expires');
            localStorage.setItem('access_token', user.token);
            localStorage.setItem('reflesh_token', user.refleshToken);
            localStorage.setItem('expiresRef', user.expiresRef);
            localStorage.setItem('expires', user.expires);
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        }),
        catchError(err => of(err))
      );
  }

  refleshToken(): Observable<boolean> {
    const url = this.url + '/reflesh';
    return this.http.get<any>(url)
      .pipe(
        take(1),
        map(user => {
          console.log('autologin', user);
          if (user && user.token) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            localStorage.removeItem('reflesh_token');
            localStorage.removeItem('expiresRef');
            localStorage.removeItem('expires');
            localStorage.setItem('access_token', user.token);
            localStorage.setItem('reflesh_token', user.refleshToken);
            localStorage.setItem('expiresRef', user.expiresRef);
            localStorage.setItem('expires', user.expires);
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            // this.carregaPermissoes(user);
            return true;
          } else {
            // this.cancelaPermissoes();
            return false;
          }
        }));
  }



}
