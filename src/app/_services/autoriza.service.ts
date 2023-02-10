import { Injectable } from '@angular/core';
import { Autoriza } from "../_models/autoriza";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { User } from "../_models";
import { map, take } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AutorizaService {

  expires = 0;
  expiresRef = 0;
  // exp = 0;
  // expRef = 0;
  token: string | null = null;
  refToken:  string | null = null;
  teste: any = null;
  _logado: boolean;
  autoriza = new Autoriza();
  usuario_uuid: string | null = null;
  currentUser: User | null = null;

  // inicio = new Subscription();

  public logadoSubject = new BehaviorSubject<number>(0); // 0 - inicio, 1 - logado,  2 - AuthenticationService recupara credenciais, 3 - logout, 4 login, 5- sai login
  public logado$ = this.logadoSubject.asObservable();
  // public refleshSubject = new BehaviorSubject<number>(0); // 0 - inicio, 1 - reflesh, 2 - AuthenticationService recupara credenciais
  // public reflesh  = this.refleshSubject.asObservable();
  sub: Subscription[] = [];

  constructor(
    private http: HttpClient,
  ) {
    this.sub.push(this.getInicio().pipe(take(1)).subscribe( {
      next: (vf) => {
        this._logado = vf;
        if (vf) {
          this.logadoSubject.next(1);
        } else {
          this.logadoSubject.next(4);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.sub.forEach(s => s.unsubscribe());
      }

    }));




    // this._logado = this.vfToken || this.refTokenVF;

   /* this.refleshSubject = new BehaviorSubject<boolean>((this._logado));

    /!*if (localStorage.getItem('access_token')) {
      this.parseLogado();
      this._logado = true;
      // const vv: boolean = (this.expires - 4800) > Math.floor((+Date.now()) / 1000) || (this.expiresRef > Math.floor((+Date.now()) / 1000));
      this._logado = this.vfToken || this.refTokenVF;
      this.logadoSubject = new BehaviorSubject<boolean>(this._logado);
      this.refleshSubject = new BehaviorSubject<boolean>((this._logado));
    } else {
      this._logado = false;
      this.logadoSubject = new BehaviorSubject<boolean>(this._logado);
      this.refleshSubject = new BehaviorSubject<boolean>(false);
    }*!/
    this.logado$  = this.logadoSubject.asObservable();
    this.reflesh  = this.refleshSubject.asObservable();
    if (this.vfToken) {
      this.parseLogado();
    }*/

  }

  getInicio() : Observable<boolean> {
    console.log('getInicio 0');
    if (this.vfToken) {
      console.log('getInicio 1');
      this.parseLogado();
      return of(true);
    } else {
      console.log('getInicio 2');
      if (this.refTokenVF) {
        console.log('getInicio 3');
        let vf: boolean;
        const url =`${environment.apiUrl}` + 'reflesh';
        return this.http.get<any>(url)
          .pipe(
            take(1),
            map(user => {
              console.log('getInicio 4');
              if (user && user.token) {
                console.log('getInicio 5');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('access_token');
                localStorage.removeItem('reflesh_token');
                localStorage.removeItem('expiresRef');
                localStorage.removeItem('expires');
                localStorage.removeItem('usuario_uuid');
                localStorage.setItem('access_token', user.token);
                this.token = user.token;
                localStorage.setItem('reflesh_token', user.refleshToken);
                this.refToken = user.refleshToken;
                localStorage.setItem('expiresRef', user.expiresRef);
                this.expiresRef = +user.expiresRef;
                localStorage.setItem('expires', user.expires);
                this.expires = +user.expires;
                localStorage.setItem('usuario_uuid', user.usuario_uuid);
                this.usuario_uuid = user.usuario_uuid;
                if (!localStorage.getItem('appconfig')) {
                  if (user.appconfig !== undefined) {
                    const u: any = user.appconfig;
                    if (u.usuario_uuid === undefined) {
                      u.usuario_uuid = user.usuario_uuid;
                    }
                    localStorage.setItem('appconfig', JSON.stringify(u));
                  }
                }
                this.currentUser = JSON.parse(user);
                // this.expires = +user.expires;
                // this.expiresRef = +user.expiresRef;
                // this._token = user.token;
                // this._refToken = user.refleshToken;
                delete user.token;
                delete user.refleshToken;
                delete user.expiresRef;
                delete user.expires;
                delete user.appconfig;
                localStorage.setItem('currentUser', JSON.stringify(user));
                // this.atz.logado = true;
                // this.carregaPermissoes(user);
                return true;
              } else {
                console.log('getInicio 6');
                // this.cancelaPermissoes();
                // this.atz.logado = false;
                return false;
              }
            }));
      } else {
        console.log('getInicio 7');
        return of(false);
      }
    }
  }

  get vfToken(): boolean {
    if (this.token !== null) {
      return (this.expires - 4800) > Math.floor((+Date.now()) / 1000);
    } else {
      if(localStorage.getItem('access_token')) {
        this.token = localStorage.getItem('access_token');
        this.expires = (this.expires > 0) ? this.expires : (localStorage.getItem('expires')) ? +localStorage.getItem('expires') : 0;
        return (this.expires - 4800) > Math.floor((+Date.now()) / 1000);
      } else {
        return false;
      }
    }
  }

  get refTokenVF(): boolean {
    if (this.refToken !== null && this.expiresRef > 0) {
      return (this.expiresRef > Math.floor((+Date.now()) / 1000));
    } else {
      if (this.expiresRef === 0) {
        if (!localStorage.getItem('expiresRef')) {
          return false;
        } else {
          this.expiresRef = +localStorage.getItem('expiresRef');
          if (!(this.expiresRef > Math.floor((+Date.now()) / 1000))) {
            return false;
          }
        }
        if (localStorage.getItem('expiresRef')) {
          this.expiresRef = +localStorage.getItem('expiresRef');
          if (!(this.expiresRef > Math.floor((+Date.now()) / 1000))) {
            return false;
          }
        } else {
          return false;
        }
      } else {
        if (!(this.expiresRef > Math.floor((+Date.now()) / 1000))) {
          return false;
        }
      }
      if (this.refToken === null && !localStorage.getItem('reflesh_token')) {
        return false;
      }
      if (this.refToken === null && localStorage.getItem('reflesh_token')) {
        this.refToken = localStorage.getItem('reflesh_token');
        return (this.expiresRef > Math.floor((+Date.now()) / 1000));
      }
      if (this.refToken !== null) {
        return (this.expiresRef > Math.floor((+Date.now()) / 1000));
      }
    }
  }

  get vfRefToken(): boolean {
    if (this.vfToken) {
      return true;
    } else {
      if (this.refTokenVF) {
        // this.refleshSubject.next(1);
        return true;
      } else {
        // this.refleshSubject.next(2);
        return false;
      }
      /*const vf: boolean = !this.vfToken && (this.expiresRef > Math.floor((+Date.now()) / 1000));
      if (vf) {

      } else {

      }*/
    }
  }

  renovaTokens() {

  }

  set logado(vf: boolean) {
      this._logado = vf;
      if (vf) {
        this.parseLogado();
      } else {
          this.desconecta();
      }
  }

  get logado(): boolean {
    return this._logado;
  }

  parseLogado() {
    this.token = localStorage.getItem('access_token');
    this.refToken = localStorage.getItem('reflesh_token');
    this.expires = +localStorage.getItem('expires');
    this.expiresRef = +localStorage.getItem('expiresRef');
    this.usuario_uuid = localStorage.getItem('usuario_uuid');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.autoriza = {
      expires: this.expires,
      expiresRef: this.expiresRef,
      token: this.token,
      refToken: this.refToken,
      teste: this.teste,
      usuario_uuid: this.usuario_uuid,
      currentUser: this.currentUser,
      logado: this._logado
    }
  }

  desconecta() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('reflesh_token');
    localStorage.removeItem('expires');
    localStorage.removeItem('expiresRef');
    localStorage.removeItem('usuario_uuid');
    localStorage.removeItem('currentUser');
    this.expires = 0;
    this.expiresRef = 0;
    this.token = null;
    this.refToken = null;
    this.teste = null;
    this._logado = false;
    this.autoriza = new Autoriza();
    this.usuario_uuid = null;
    this.currentUser = null;
  }

}
