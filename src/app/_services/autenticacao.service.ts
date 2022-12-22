import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, take} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  expires?: number;
  expiresRef?: number;
  exp?: number;
  expRef?: number;
  _token?: string;
  _refToken?: string;
  vfToken = false;
  teste: any;


  constructor(
    private http: HttpClient,
  ) { }

  get token(): string {
    return this._token;
  }

  get refToken(): string {
    return this._refToken;
  }

  login(username: string, password: string) {
    const bt = username + ':' + password;
    const hvalue = 'Basic ' + btoa(bt);
    const url = this.getUrl() + 'login';
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
            this.expires = +user.expires;
            this.expiresRef = +user.expiresRef;
            this._token =user.token;
            this._refToken = user.refleshToken;
            this.vfToken = true;
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.teste = this.getTeste();
            console.log('testeLogin', this.teste);
            return true;
          } else {
            this.vfToken = false;
            return false;
          }
        }),
        catchError(err => of(err))
      );
  }

  refleshToken(): Observable<boolean> {
    const url = this.getUrl() + '/reflesh';
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
            this.expires = +user.expires;
            this.expiresRef = +user.expiresRef;
            this._token = user.token;
            this._refToken = user.refleshToken;
            this.vfToken = true;
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            // this.carregaPermissoes(user);
            return true;
          } else {
            this.vfToken = false;
            // this.cancelaPermissoes();
            return false;
          }
        }));
  }

  getUrl(): string {
    switch (location.hostname) {
      case 'gn5.icamara.com.br' :
        return 'http://gn5.icamara.com.br/api/';
      case 'localhost' :
        return 'http://slimgn08.dv/api/';
      case 'gn5.dv' :
        return 'http://api.gn5.dv/';
      case 'webcop.dv' :
        return 'http://webcop.dv/api/';
      case 'webcop2.dv' :
        return 'http://webcop2.dv/api/';
      case 'webcop3.dv' :
        return 'http://webcop3.dv/api/';
      case 'gabnet5.com.br' :
        return 'http://gabnet5.com.br/api/';
    }
  }

  getAgora(): number {
    return Math.floor((+Date.now())/ 1000);
  }

  validaExpires(): boolean {
    return (this.expires > this.getAgora());
  }

  validaExpiresRef(): boolean {
    return (this.expiresRef > this.getAgora());
  }
  validaExpRef(): boolean {
    return ((this.expiresRef - 3600) > this.getAgora());
  }


  getRefleshToken(): boolean {
    if (!this.validaExpires() && this.validaExpRef()) {
      return true;
    } else {
      return false;
    }
  }

  getTeste() {
    return {
      expires: JSON.parse(localStorage.getItem('expires')),
      expiresRef: JSON.parse(localStorage.getItem('expiresRef')),
      token: this._token,
      refToken: this._refToken,
      exp: Math.floor((+Date.now())/ 1000)
    }
  }

  getTokens(): any {
    this.expires = +JSON.parse(localStorage.getItem('expires'));
    this.expiresRef = +JSON.parse(localStorage.getItem('expiresRef'));
    this._token = localStorage.getItem('access_token');
    this._refToken = localStorage.getItem('reflesh_token');
  }



}
