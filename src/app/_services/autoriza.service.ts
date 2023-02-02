import { Injectable } from '@angular/core';
import { Autoriza } from "../_models/autoriza";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AutorizaService {

  expires = 0;
  expiresRef = 0;
  exp = 0;
  expRef = 0;
  token: string | null = null;
  refToken:  string | null = null;
  teste: any = null;
  _logado: boolean;
  autoriza = new Autoriza();
  usuario_uuid: string | null = null;
  currentUser: string | null = null;

  public logadoSubject: BehaviorSubject<boolean>;
  public logado$: Observable<boolean>;
  public refleshSubject: BehaviorSubject<boolean>;
  public reflesh: Observable<boolean>;

  constructor() {
    if (localStorage.getItem('access_token')) {
      this.parseLogado();
      this._logado = true;
      this.logadoSubject = new BehaviorSubject<boolean>(this.vfRefToken);
      this.refleshSubject = new BehaviorSubject<boolean>(this.vfRefToken);
    } else {
      this._logado = false;
      this.logadoSubject = new BehaviorSubject<boolean>(this._logado);
      this.refleshSubject = new BehaviorSubject<boolean>(false);
    }
    this.logado$  = this.logadoSubject.asObservable();
    this.reflesh  = this.refleshSubject.asObservable();
  }



  get vfToken(): boolean {
    return (this.expires - 4800) > Math.floor((+Date.now()) / 1000);
  }

  get vfRefToken(): boolean {
    if (this.vfToken) {
      return true;
    } else {
      const vf: boolean = !this.vfToken && (this.expiresRef > Math.floor((+Date.now()) / 1000));
      if (vf) {
        this.refleshSubject.next(true);
        return true;
      } else {
        this.refleshSubject.next(false);
        return false;
      }
    }
  }

  set logado(vf: boolean) {
      this._logado = vf;
      if (vf) {
        this.parseLogado();
        this.logadoSubject.next(vf);
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
    this.currentUser = localStorage.getItem('currentUser');
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
    this.exp = 0;
    this.expRef = 0;
    this.token = null;
    this.refToken = null;
    this.teste = null;
    this._logado = false;
    this.autoriza = new Autoriza();
    this.usuario_uuid = null;
    this.currentUser = null;
  }

}
