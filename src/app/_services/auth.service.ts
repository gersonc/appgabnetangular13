import { Injectable } from '@angular/core';
import { Autoriza } from "../_models/autoriza";
import { User } from "../_models";
import { BehaviorSubject, Observable, of, Subject, Subscription } from "rxjs";
import { environment } from "../../environments/environment";
import { map, take } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { telaI } from "../_models/telaI";


function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  expires = 0;
  expiresRef = 0;
  token: string | null = null;
  refToken:  string | null = null;
  teste: any = null;
  _logado: boolean;
  autoriza = new Autoriza();
  usuario_uuid: string | null = null;
  currentUser: User | null = null;
  public logadoSubject = new BehaviorSubject<number>(0); // 0 - inicio, 1 - logado,  2 - AuthenticationService recupara credenciais, 3 - logout, 4 login, 5- sai login
  public logado$ = this.logadoSubject.asObservable();
  sub: Subscription[] = [];

  public subLogin = new Subject<boolean>();
  public slogin = this.subLogin.asObservable();


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
  }

  nativeWindow(): any {
    return _window();
  }

  getScreen(): telaI {
    const w = this.nativeWindow();
    const m = w.screen;
    const n = w.navigator;

    return  {
      height:m.height,
      width: m.width,
      innerWidth: w.innerWidth,
      innerHeight: w.innerHeight,
      availWidth: m.availWidth,
      availHeight: m.availHeight,
      pixelDepth: m.pixelDepth,
      colorDepth: m.colorDepth,
      userAgent: n.userAgent,
      onLine: n.onLine,
      hostname: w.location.hostname,
    };
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
                delete user.token;
                delete user.refleshToken;
                delete user.expiresRef;
                delete user.expires;
                delete user.appconfig;
                localStorage.setItem('currentUser', JSON.stringify(user));
                return true;
              } else {
                console.log('getInicio 6');
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
      return this.expires > Math.floor((+Date.now()) / 1000);
    } else {
      if(localStorage.getItem('access_token')) {
        this.token = localStorage.getItem('access_token');
        this.expires = +localStorage.getItem('expires');
        return this.expires > Math.floor((+Date.now()) / 1000);
      } else {
        return false;
      }
    }
  }

  get refTokenVF(): boolean {
    if (this.refToken !== null) {
      return (this.expiresRef > Math.floor((+Date.now()) / 1000));
    } else {
      if (localStorage.getItem('reflesh_token')) {
        this.refToken = localStorage.getItem('reflesh_token');
        this.expiresRef = +localStorage.getItem('expiresRef');
        return this.expiresRef > Math.floor((+Date.now()) / 1000);
      } else {
        return false;
      }
    }
  }

  get vfRefToken(): boolean {
    if (this.vfToken) {
      return true;
    } else {
      if (this.refTokenVF) {
        return true;
      } else {
        return false;
      }
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

  parseLogado(u?: User) {
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

  getRefleh() {
    // if (this.vfRefToken) {
    if (this.refTokenVF) {
      let v: boolean;
      this.sub.push(this.refleshToken().pipe(take(1)).subscribe({
          next: (vf) => {
            this.logado = vf;
            if (vf) {
              this.logadoSubject.next(2);
              // this.refleshSubject.next(2);
            } else {
              this.logadoSubject.next(3);
            }
          },
          error: (err) => {
            console.error(err.toString());
          },
          complete: () => {
            console.log('reflesh ok?', v);
            this.sub.forEach( s => s.unsubscribe());
          }
        })
      );
    } else {
      this.logado = false;
      this.logadoSubject.next(3);
    }
  }


  login2(username: string, password: string, tela: telaI = null): Observable<any> {
    console.log('login2', username, password);
    const bt = username + ':' + password;
    const hvalue = 'Basic ' + btoa(bt);
    const url = this.getUrl() + 'login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': hvalue
      })
    };

    return this.http.post<User>(url, tela, httpOptions);
  }


  login(username: string, password: string, tela: telaI = null) {
    console.log('login', username, password);
    let vf: boolean;
    this.sub.push(this.login2(username, password, tela).subscribe({
      next: (user) => {
        console.log('login3', user);
        if (user && user.token) {
          vf = true;
          localStorage.removeItem('currentUser');
          localStorage.removeItem('access_token');
          localStorage.removeItem('reflesh_token');
          localStorage.removeItem('expiresRef');
          localStorage.removeItem('expires');
          localStorage.removeItem('usuario_uuid');
          localStorage.setItem('access_token', user.token);
          // this.token = user.token;
          localStorage.setItem('reflesh_token', user.refleshToken);
          // this.refToken = user.refleshToken;
          localStorage.setItem('expiresRef', user.expiresRef);
          // this.expiresRef = +user.expiresRef;
          localStorage.setItem('expires', user.expires);
          // this.expires = +user.expires;
          localStorage.setItem('usuario_uuid', user.usuario_uuid);
          // this.usuario_uuid = user.usuario_uuid;
          if (user.appconfig !== undefined) {
            const u: any = user.appconfig;
            if (u.usuario_uuid === undefined) {
              u.usuario_uuid = user.usuario_uuid;
            }
            localStorage.setItem('appconfig', JSON.stringify(u));
          }
          // this.currentUser = JSON.parse(user);

          // this.expires = +user.expires;
          // this.expiresRef = +user.expiresRef;
          // this._token =user.token;
          // this._refToken = user.refleshToken;
          delete user.token;
          delete user.refleshToken;
          delete user.expiresRef;
          delete user.expires;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.parseLogado();
          this.logado = true;
          // this.logadoSubject.next(true);
          // this.teste = this.getTeste();
          this.subLogin.next(vf);
        } else {
          vf = false;
          this.logado = false;
          this.subLogin.next(vf);
        }
      },
      complete: () => {
        console.log('login5');
        //this.subLogin.next(vf);
        if (vf) {
          this.logadoSubject.next(1);
        }
        this.subLogin.complete();
        console.log('fim');
      }
    }));
  }

  /*login(username: string, password: string, tela: telaI = null) {
    console.log('login', username, password);
    let vf: boolean;
    this.sub.push(this.login2(username, password, tela).pipe(take(1)).subscribe({
        next: (user) => {

          if (user && user.token) {
            vf = true;
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
            if (user.appconfig !== undefined) {
              const u: any = user.appconfig;
              if (u.usuario_uuid === undefined) {
                u.usuario_uuid = user.usuario_uuid;
              }
              localStorage.setItem('appconfig', JSON.stringify(u));
            }
            this.currentUser = JSON.parse(user.currentUser);;
            // this.expires = +user.expires;
            // this.expiresRef = +user.expiresRef;
            // this._token =user.token;
            // this._refToken = user.refleshToken;
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.logado = true;
            // this.logadoSubject.next(true);
            // this.teste = this.getTeste();
            this.subLogin.next(vf);
          } else {
            vf = false;
            this.logado = false;
            this.subLogin.next(vf);
          }
        },
        complete: () => {
          //this.subLogin.next(vf);
          if (vf) {
            this.logadoSubject.next(1);
          }
          this.subLogin.complete();
          console.log('fim');
        }
      }));
  }*/


  /*login3(username: string, password: string, tela: telaI = null): Subscription {
    console.log('login', username, password, tela);
    const bt = username + ':' + password;
    const hvalue = 'Basic ' + btoa(bt);
    const url = this.getUrl() + 'login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': hvalue
      })
    };
    return this.http.post<any>(url, tela, httpOptions)
      .pipe(take(1)).subscribe({
        next: (user) => {
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
            this.token = user.token;
            localStorage.setItem('reflesh_token', user.refleshToken);
            this.refToken = user.refleshToken;
            localStorage.setItem('expiresRef', user.expiresRef);
            this.expiresRef = +user.expiresRef;
            localStorage.setItem('expires', user.expires);
            this.expires = +user.expires;
            localStorage.setItem('usuario_uuid', user.usuario_uuid);
            this.usuario_uuid = user.usuario_uuid;
            if (user.appconfig !== undefined) {
              const u: any = user.appconfig;
              if (u.usuario_uuid === undefined) {
                u.usuario_uuid = user.usuario_uuid;
              }
              localStorage.setItem('appconfig', JSON.stringify(u));
            }
            this.currentUser = JSON.parse(user.currentUser);;
            // this.expires = +user.expires;
            // this.expiresRef = +user.expiresRef;
            // this._token =user.token;
            // this._refToken = user.refleshToken;
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.logado = true;
            // this.logadoSubject.next(true);
            // this.teste = this.getTeste();
            return of(vf);
          } else {
            vf = false;
            this.logado = false;
            return of(vf);
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('fim');
          return of(true);
        }
      })
  }*/

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
            this.currentUser = JSON.parse(user.currentUser);;
            delete user.token;
            delete user.refleshToken;
            delete user.expiresRef;
            delete user.expires;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
          } else {
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
}
