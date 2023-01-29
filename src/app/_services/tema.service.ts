import { Injectable } from '@angular/core';
import { UrlService } from "./url.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../_models/appconfig";
import { Observable, of } from "rxjs";
import { take } from "rxjs/operators";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  usuario_uuid: string = '';

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private aut: AuthenticationService
  ) {
    this.usuario_uuid = this.aut.usuario_uuid;
    if (this.usuario_uuid === undefined) {
      this.usuario_uuid = JSON.parse(localStorage.getItem('usuario_uuid'));
    }
  }

  getTemaLogin(): AppConfig | null {
    if (localStorage.getItem('appconfig')) {
      const t: AppConfig = this.parceAppConfig(JSON.parse(localStorage.getItem('appconfig')));
      if (t.usuario_uuid === undefined) {
        t.usuario_uuid = JSON.parse(localStorage.getItem('usuario_uuid'));
      }
      return t;
    } else {
      return null;
    }
  }

  getTema(uuid: string): Observable<AppConfig> {
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) }
    return this.http.post<AppConfig>(this.url.tema, uuid, httpOptions);
  }

  putTema(dados: AppConfig): Observable<any> {
    localStorage.setItem('appconfig', JSON.stringify(dados));
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) }
    return this.http.put<any>(this.url.tema, dados, httpOptions);
  }

  setTema(dados: AppConfig) {
    this.putTema(dados).pipe(take(1)).subscribe();
  }

  parceAppConfig(dados?: string): AppConfig {
    const a: any = (dados !== undefined) ? dados : JSON.parse(localStorage.getItem('appconfig'));
    if (a.usuario_uuid === undefined) {
      a.usuario_uuid = JSON.parse(localStorage.getItem('usuario_uuid'));
    }
    return {
      usuario_uuid: a.usuario_uuid,
      scale: +a.scale,
      theme: a.theme,
      dispositivo: a.dispositivo,
      dark: (+a.dark === 1),
      inputStyle: a.inputStyle,
      ripple: (+a.ripple === 1)
    }
  }


}
