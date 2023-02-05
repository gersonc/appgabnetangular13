import { Injectable } from "@angular/core";
import { UrlService } from "./url.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../_models/appconfig";
import { Observable, of, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { AuthenticationService } from "./authentication.service";
import { DispositivoService } from "./dispositivo.service";

@Injectable({
  providedIn: "root"
})
export class TemaService {

  sub1: Subscription | null = null;
  sub2: Subscription | null = null;

  usuario_uuid: string = "";

  config: AppConfig = {
    usuario_uuid: null,
    theme: "lara-light-blue",
    dark: false,
    inputStyle: "outlined",
    ripple: true,
    scale: "14px",
    dispositivo: "desktop"
  };

  constructor(
    private url: UrlService,
    private http: HttpClient,
    public ds: DispositivoService,
  ) {
  }


  getTema(uuid: string): Observable<AppConfig> {
    const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
    return this.http.post<AppConfig>(this.url.tema, uuid, httpOptions);
  }

  putTema(dados: any): Observable<any> {
    this.config = dados;
    const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
    return this.http.put<any>(this.url.tema, dados, httpOptions);
  }

  setTema(dados: AppConfig): void {
    this.parceTema(dados);
  }

  gravaTema(dados: AppConfig) {
    this.config = dados;
    const dado: any = this.parceToServer(this.config);
    console.log('grava tema 2', dado);
    localStorage.setItem("appconfig", JSON.stringify(dado));
    this.putTema(dado).pipe(take(1)).subscribe(c => {
      console.log('grava tema 3', c);
    });
  }

  parceAppConfig(dados?: string): AppConfig {
    const a: any = (dados !== undefined) ? dados : JSON.parse(localStorage.getItem("appconfig"));
    if (a.usuario_uuid === undefined || a.usuario_uuid === null) {
      a.usuario_uuid = localStorage.getItem("usuario_uuid");
    }
    return {
      usuario_uuid: a.usuario_uuid,
      scale: a.scale,
      theme: a.theme,
      dispositivo: this.ds.dispositivo,
      dark: (+a.dark === 1),
      inputStyle: a.inputstyle,
      ripple: (+a.ripple === 1)
    };
  }

  parceToServer(a: AppConfig): any {
    return {
      usuario_uuid: a.usuario_uuid,
      scale: (a.scale.length < 3) ? "14px" : a.scale,
      theme: a.theme,
      dispositivo: this.ds.dispositivo,
      dark: (a.dark) ? 1 : 0,
      inputstyle: a.inputStyle,
      ripple: (a.ripple) ? 1 : 0
    };
  }

  parceTema(c: AppConfig): void {
    if (c.ripple !== undefined && c.ripple !== this.config.ripple) {
      this.config.ripple = c.ripple;
    }
    if (c.theme !== undefined && c.theme !== this.config.theme) {
      this.config.theme = c.theme;
    }
    if (c.dark !== undefined && c.dark !== this.config.dark) {
      this.config.dark = c.dark;
    }
    if (c.inputStyle !== undefined && c.inputStyle !== this.config.inputStyle) {
      this.config.inputStyle = c.inputStyle;
    }
    if (c.usuario_uuid !== undefined && c.usuario_uuid !== this.config.usuario_uuid) {
      this.config.usuario_uuid = c.usuario_uuid;
    }
    if ((c.usuario_uuid === null || c.usuario_uuid === undefined) && localStorage.getItem("usuario_uuid")) {
      c.usuario_uuid = JSON.parse(localStorage.getItem("usuario_uuid"));
    }
    if (c.scale !== undefined && c.scale !== this.config.scale) {
      this.config.scale = c.scale;
    }
    if (c.dispositivo !== undefined && c.dispositivo !== this.config.dispositivo) {
      this.config.dispositivo = c.dispositivo;
    }


  }


}
