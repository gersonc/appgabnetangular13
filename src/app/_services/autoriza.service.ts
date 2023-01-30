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
  _logado = false;
  autoriza = new Autoriza();
  _visto = false;
  usuario_uuid: string | null = null;
  currentUser: string | null = null;
  segundo = false;
  tt = 0;
  ttt = 0;
  dd = 0;

  public logadoSubject = new BehaviorSubject<boolean>(false);
  public logado$ = this.logadoSubject.asObservable();
  public refleshSubject = new BehaviorSubject<boolean>(false);
  public reflesh = this.refleshSubject.asObservable();

  constructor() { }

  get visto(): boolean {
    this.ttt++;
    console.log('AutorizaService this._visto', this._visto, this.ttt);
    if (this._visto) {
      return true;
    }
    if (!this._visto) {
      if (this._logado) {
        this._visto = true;
        return true;
      } else {
        if (!localStorage.getItem('access_token')) {
          this._visto = true;
          return true;
        } else {
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
          this._visto = true;
          return true;
        }
      }
    }
  }

  get vfToken(): boolean {
    return this.visto && ((this.expires - 4800) > Math.floor((+Date.now()) / 1000));
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
    this.tt++;
    console.log('AutorizaService logado', vf, this.tt);
      this._logado = vf;
      if (vf) {
        this.parseLogado();
        console.log('AutorizaService logado 22222222222', vf, this.tt);
        this.logadoSubject.next(vf);
      } else {
        if (this._visto) {
          this.desconecta();
        }
      }
  }

  get logado(): boolean {
    return (this.visto && this._logado);
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
    this._visto = true;
  }

  desconecta() {
    this.dd++;
    console.log('AutorizaService desconecta', this.dd);
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
    this._visto = false;
    this.usuario_uuid = null;
    this.currentUser = null;
    // this.refleshSubject.complete();
    // this.logadoSubject.complete();
    this._visto = false;
  }

}
