import { Injectable } from '@angular/core';
import { Autoriza } from "../_models/autoriza";
import { User, User2 } from "../_models";
import { BehaviorSubject, Observable, of, Subject, Subscription } from "rxjs";
import { environment } from "../../environments/environment";
import { map, take } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { telaI } from "../_models/telaI";
import { OnoffLineService } from "../shared/onoff-line/onoff-line.service";
import { AppConfig } from "../_models/appconfig";


function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  inicio = true;
  expires = 0;
  expiresRef = 0;
  token: string | null = null;
  refToken:  string | null = null;
  teste: any = null;
  _logado: boolean;
  autoriza = new Autoriza();
  usuario_uuid: string | null = null;
  currentUser: User | null = null;
  onlineVF: boolean;
  // inicio = new Subscription();
  // 0 - inicio,
  // 1 - logado,
  // 2 - AuthenticationService recupara credenciais,
  // 3 - logout,
  // 4 - login,
  // 5 - sai login
  public logadoSubject = new BehaviorSubject<number>(0);
  public logado$ = this.logadoSubject.asObservable();
  sub: Subscription[] = [];

  public subLogin = new Subject<boolean>();
  public slogin = this.subLogin.asObservable();


  constructor(
    private http: HttpClient,
    private online: OnoffLineService
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

    this.sub.push(this.online.onoff.subscribe(vf => {
      this.onlineVF = vf;
    }));
  }


  getInicio() : Observable<boolean> {
    console.log('getInicio 0', this.token, this.refToken);
    if (this.vfToken) {
      console.log('getInicio 1', this.vfToken, this.token, this.refToken);
      this.parseLogado();
      this._logado = false;
      return of(true);
    } else {
      console.log('getInicio 2', this.token, this.refToken);
      if (this.vfRefToken) {
        console.log('getInicio 3', this.vfRefToken, this.token, this.refToken);
        let vf: boolean;
        const url =`${environment.apiUrl}` + 'relogin';
        const dados: any = this.getScreen();
        const httpOptions = {
          headers: new HttpHeaders({
            'Authorization':  'Bearer ' + localStorage.getItem('reflesh_token'),
            'Content-Type': 'application/json'
          })
        };
        return this.http.post<User2>(url, dados, httpOptions)
          .pipe(
            take(1),
            map(user => {
              console.log('getInicio 4');
              if (user && user.token) {
                console.log('getInicio 5');
                this.parseLogado(user);
                this._logado = true;
                return true;
              } else {
                console.log('getInicio 6');
                this._logado = false;
                return false;
              }
            }));
      } else {
        console.log('getInicio 7');
        this._logado = false;
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

  get vfRefToken(): boolean {
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

  get tokensVF(): boolean {
    if (this.vfToken) {
      return true;
    } else {
      return this.vfRefToken;
    }
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

  parseLogado(u?: User2) {
    if (u === undefined) {
      this.token = localStorage.getItem('access_token');
      this.refToken = localStorage.getItem('reflesh_token');
      this.expires = +localStorage.getItem('expires');
      this.expiresRef = +localStorage.getItem('expiresRef');
      this.usuario_uuid = localStorage.getItem('usuario_uuid');
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.autoriza =  {
        expires: this.expires,
        expiresRef: this.expiresRef,
        token: this.token,
        refToken: this.refToken,
        teste: this.teste,
        usuario_uuid: this.usuario_uuid,
        currentUser: this.currentUser,
        logado: true,
        appconfig: (!localStorage.getItem('appconfig')) ? null : JSON.parse(localStorage.getItem('currentUser'))
      }
    } else {
      const uu: any = (u.appconfig !== undefined) ? u.appconfig : null;
      this.usuario_uuid = u.usuario_uuid;
      this.token = u.token;
      this.refToken = u.refleshToken;
      this.expiresRef = +u.expiresRef;
      this.expires = +u.expires;
      this.autoriza = {
        expires: this.expires,
        expiresRef: this.expiresRef,
        token: this.token,
        refToken: this.refToken,
        teste: this.teste,
        usuario_uuid: this.usuario_uuid,
        currentUser: this.currentUser,
        logado: true,
        appconfig: uu
      }
      localStorage.removeItem('currentUser');
      localStorage.removeItem('access_token');
      localStorage.removeItem('reflesh_token');
      localStorage.removeItem('expiresRef');
      localStorage.removeItem('expires');
      localStorage.removeItem('usuario_uuid');
      localStorage.setItem('access_token', this.token);
      localStorage.setItem('reflesh_token', this.refToken);
      localStorage.setItem('expiresRef', this.expiresRef.toString());
      localStorage.setItem('expires', this.expires.toString());
      localStorage.setItem('usuario_uuid', this.usuario_uuid);
      delete u.token;
      delete u.refleshToken;
      delete u.expiresRef;
      delete u.expires;
      delete u.appconfig;
      localStorage.setItem('currentUser', JSON.stringify(u));
      if (!localStorage.getItem('appconfig')) {
        if (uu !== null) {
          if (uu.usuario_uuid === undefined) {
            uu.usuario_uuid = this.usuario_uuid;
          }
          localStorage.setItem('appconfig', JSON.stringify(uu));
        }
      }
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
    if (this.vfRefToken) {
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

    return this.http.post<User2>(url, tela, httpOptions);
  }

  login(username: string, password: string) {
    console.log('login', username, password);
    let vf: boolean;
    this.sub.push(this.login2(username, password, this.getScreen()).subscribe({
      next: (user) => {
        console.log('login3', user);
        if (user && user.token) {
            this.parseLogado(user);
          vf = true;
            this._logado = true;
             this.subLogin.next(true);
            return true;
          } else {
            vf = false;
            console.log('getInicio 6');
            this._logado = false;
            this.subLogin.next(false);
            return false;
          }

      },
      complete: () => {
        console.log('login5');
        //this.subLogin.next(vf);
        if (vf) {
          this.logadoSubject.next(1);
        } else {
          this.logadoSubject.next(4);
        }
        this.subLogin.complete();
        console.log('fim');
      }
    }));
  }

  refleshToken(): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':  'Bearer ' + this.refToken,
        'Content-Type': 'application/json'
      })
    };
    const url = this.getUrl() + 'reflesh';
    return this.http.get<any>(url, httpOptions)
      .pipe(
        take(1),
        map(user => {
          if (user && user.token) {
            this.parseLogado(user);
            return true;
          } else {
            return false;
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
      hostname: w.location.hostname,
    };
  }

  getUrl(): string {
    return `${environment.apiUrl}`;
  }
}
