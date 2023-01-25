import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AppConfig } from "../_models/appconfig";
import { DispositivoService } from "./dispositivo.service";


@Injectable({
  providedIn: "root"
})
export class AppConfigService {

  config: AppConfig = {
    theme: "lara-light-blue",
    dark: false,
    inputStyle: "outlined",
    ripple: true,
    dispositivo: "desktop"
  };

  private configUpdate = new Subject<AppConfig>();

  configUpdate$ = this.configUpdate.asObservable();

  constructor(
    private ds: DispositivoService
  ) {
    this.config.dispositivo = this.ds.dispositivo;
  }

  updateConfig(config: AppConfig) {
    this.config = config;
    this.config.dispositivo = this.ds.dispositivo;
    this.configUpdate.next(config);
  }

  updateDispositivo(dispositivo: string) {
    this.ds.dispositivo = dispositivo;
    this.config.dispositivo = this.ds.dispositivo;
    this.configUpdate.next(this.config);
  }

  getConfig() {
    return this.config;
  }
}
