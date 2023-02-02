import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, take} from "rxjs/operators";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import {environment} from "../../environments/environment";
import { User } from "../_models";
import { AppConfigService } from "./appconfigservice";
import { AutorizaService } from "./autoriza.service";

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  //expires?: number;
  //expiresRef?: number;
  //exp?: number;
  //expRef?: number;
  //_token?: string;
  //_refToken?: string;
  //teste: any;
  //logado = false;

  // public logadoSub: BehaviorSubject<boolean>;
  // public logadoVF: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private atz: AutorizaService
    // private cs: AppConfigService
  ) {
    // this.logadoSub = new BehaviorSubject<boolean>(!!(localStorage.getItem('currentUser')));
    // this.logadoVF = this.logadoSub.asObservable();
  }


  refLogin(): boolean {
    return this.atz.vfRefToken;
  }

  getRefleh() {
    if (this.atz.vfRefToken) {
      if (!this.atz.vfToken) {
        let v: boolean;
        let s: Subscription;
        s = this.refleshToken().pipe(take(1)).subscribe({
          next: (vf) => {
            v = vf;
            this.atz.logado = vf;
            this.atz.logadoSubject.next(vf);
          },
          error: (err) => {
            console.error(err.toString());
          },
          complete: () => {
            console.log('reflesh ok?', v);
            s.unsubscribe();
          }
        });
      } else {
        this.atz.logado = true;
        this.atz.logadoSubject.next(true);
      }
    } else {
      this.atz.logado = false;
      this.atz.logadoSubject.next(false);
    }
  }



  login(username: string, password: string, screen: any = null): Observable<boolean> {
    const bt = username + ':' + password;
    const hvalue = 'Basic ' + btoa(bt);
    const url = this.getUrl() + 'login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': hvalue
      })
    };
    return this.http.post<any>(url, screen, httpOptions)
      .pipe(
        take(1),
        map(user => {
          let vf: boolean;
          if (user && user.token) {
            vf = true;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            localStorage.removeItem('reflesh_token');
            localStorage.removeItem('expiresRef');
            localStorage.removeItem('expires');
            localStorage.removeItem('usuario_uuid');
            localStorage.setItem('access_token', user.token);
            localStorage.setItem('reflesh_token', user.refleshToken);
            localStorage.setItem('expiresRef', user.expiresRef);
            localStorage.setItem('expires', user.expires);
            localStorage.setItem('usuario_uuid', user.usuario_uuid);
            if (user.appconfig !== undefined) {
              user.appconfig.usuario_uuid = user.usuario_uuid;
              localStorage.setItem('appconfig', JSON.stringify(user.appconfig));
              // this.cs.setConfig(user.appconfig);
            }
            // this.expires = +user.expires;
            // this.expiresRef = +user.expiresRef;
            // this._token =user.token;
            // this._refToken = user.refleshToken;
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.atz.logado = true;
            // this.atz.logadoSubject.next(true);
            // this.teste = this.getTeste();
            return vf;
          } else {
            vf = false;
            this.atz.logado = false;
            return vf;
          }
        }),
        catchError(err => of(err))
      );
  }

  refleshToken(): Observable<boolean> {
    const url = this.getUrl() + 'reflesh';
    return this.http.get<any>(url)
      .pipe(
        take(1),
        map(user => {
          if (user && user.token) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            localStorage.removeItem('reflesh_token');
            localStorage.removeItem('expiresRef');
            localStorage.removeItem('expires');
            localStorage.removeItem('usuario_uuid');
            localStorage.setItem('access_token', user.token);
            localStorage.setItem('reflesh_token', user.refleshToken);
            localStorage.setItem('expiresRef', user.expiresRef);
            localStorage.setItem('expires', user.expires);
            localStorage.setItem('usuario_uuid', user.usuario_uuid);
            if (user.appconfig !== undefined) {
              user.appconfig.usuario_uuid = user.usuario_uuid;
              localStorage.setItem('appconfig', JSON.stringify(user.appconfig));
              // this.cs.setConfig(user.appconfig);
            }
            // this.expires = +user.expires;
            // this.expiresRef = +user.expiresRef;
            // this._token = user.token;
            // this._refToken = user.refleshToken;
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.atz.logado = true;
            // this.carregaPermissoes(user);
            return true;
          } else {
            // this.cancelaPermissoes();

            this.atz.logado = false;
            return false;
          }
        }));
  }

  getUrl(): string {
    return `${environment.apiUrl}`;
    /*switch (location.hostname) {
      case 'app.gabinet.com.br' :
        return 'https://app.gabinet.com.br/api/';
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
    }*/
  }
/*

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



  getTokens(): number {
    if (!localStorage.getItem('access_token')) {
      this.expires = 0;
      this.expiresRef = 0;
      return 0;
    } else {
      this.expires = +JSON.parse(localStorage.getItem('expires'));
      this.expiresRef = +JSON.parse(localStorage.getItem('expiresRef'));
      this._refToken = localStorage.getItem('reflesh_token');
      this._token = localStorage.getItem('access_token');
      return this.expires;
    }
  }

  cancelaPermissoes() {
    delete this.expires;
    delete this.expiresRef;
    delete this.exp;
    delete this.expRef;
    delete this._token;
    delete this._refToken;
    delete this.teste;
  }

*/

}
