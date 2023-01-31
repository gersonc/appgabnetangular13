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
    /*this.usuario_uuid = this.aut.usuario_uuid;
    if (this.usuario_uuid === undefined) {
      this.usuario_uuid = JSON.parse(localStorage.getItem('usuario_uuid'));
    }*/
  }



  getTema(uuid: string): Observable<AppConfig> {
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) }
    return this.http.post<AppConfig>(this.url.tema, uuid, httpOptions);
  }

  putTema(dados: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) }
    return this.http.put<any>(this.url.tema, dados, httpOptions);
  }

  setTema(dados: AppConfig) {
    const dado: any = this.parceToServer(dados)
    localStorage.setItem('appconfig', JSON.stringify(dado));
    this.putTema(dado).pipe(take(1)).subscribe(c => {
      console.log('TEMA GRAVADO', c, dados);
    });
  }

  parceAppConfig(dados?: string): AppConfig {
    const a: any = (dados !== undefined) ? dados : JSON.parse(localStorage.getItem('appconfig'));
    if (a.usuario_uuid === undefined) {
      a.usuario_uuid = localStorage.getItem('usuario_uuid');
    }
    return {
      usuario_uuid: a.usuario_uuid,
      scale: a.scale,
      theme: a.theme,
      dispositivo: this.aut.dispositivo,
      dark: (+a.dark === 1),
      inputStyle: a.inputstyle,
      ripple: (+a.ripple === 1)
    }
  }

  parceToServer(a: AppConfig): any {
    return {
      usuario_uuid: a.usuario_uuid,
      scale: (a.scale.length < 3) ? '14px': a.scale,
      theme: a.theme,
      dispositivo: this.aut.dispositivo,
      dark: (a.dark) ? 1 : 0,
      inputstyle: a.inputStyle,
      ripple:(a.ripple) ? 1 : 0
    }
  }


}
