import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AppConfig } from "../_models/appconfig";
import { DispositivoService } from "./dispositivo.service";
import { TemaService } from "./tema.service";


@Injectable({
  providedIn: "root"
})
export class AppConfigService {

  active = false;

  primeiro = true;

  config: AppConfig = {
    usuario_uuid: null,
    theme: "lara-light-blue",
    dark: false,
    inputStyle: "outlined",
    ripple: true,
    scale: "14px",
    dispositivo: "desktop"
  };

  private configUpdate = new Subject<AppConfig>();

  configUpdate$ = this.configUpdate.asObservable();

  constructor(
    private ts: TemaService,
    private ds: DispositivoService
  ) {
  }

  setRipple(vf: boolean) {
    this.config.ripple = vf;
    this.configUpdate.next(this.config);
  }

  setScale(n: string) {
    this.config.scale = n;
    this.configUpdate.next(this.config);
  }

  setInputStyle(s: string) {
    this.config.inputStyle = s;
    this.configUpdate.next(this.config);
  }

  setConfig(config: AppConfig) {
    this.ts.setTema(config);
  }

  gravaTema() {
    console.log("grava thema");
    if (!this.primeiro) {
      this.ts.gravaTema();
    } else {
      this.primeiro = false;
    }
  }

  getConfig() {
    if (localStorage.getItem("appconfig")) {
      this.config = this.ts.parceAppConfig(JSON.parse(localStorage.getItem("appconfig")));
      if (this.config.usuario_uuid === undefined && localStorage.getItem("usuario_uuid")) {
        this.config.usuario_uuid = JSON.parse(localStorage.getItem("usuario_uuid"));
      }
      console.log('PEGA THEMA');
      this.configUpdate.next(this.config);
    } else {
      this.primeiro = false;
      this.configUpdate.next(this.config);
    }
  }

  setThema(str: string, d: boolean) {
    this.config.theme = str;
    this.config.dark = d;
    this.configUpdate.next(this.config);
  }

}
