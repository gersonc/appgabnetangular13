import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AppConfig } from "../_models/appconfig";
import { DispositivoService } from "./dispositivo.service";
import { TemaService } from "./tema.service";
import { DomHandler } from "primeng/dom";


@Injectable({
  providedIn: "root"
})
export class AppConfigService {

  primeiro = true;

  config: AppConfig = {
    usuario_uuid: null,
    theme: "lara-light-blue",
    dark: false,
    inputStyle: "outlined",
    ripple: true,
    scale: '14px',
    dispositivo: "desktop"
  };

  private configUpdate = new Subject<AppConfig>();

  configUpdate$ = this.configUpdate.asObservable();

  constructor(
    private ts: TemaService,
    private ds: DispositivoService
  ) {
    /*const c: AppConfig | null = this.ts.getTemaLogin();
    if (c !== null) {
      this.config = c;
    }
    this.config.dispositivo = this.ds.dispositivo;
    this.config.usuario_uuid = this.ts.usuario_uuid*/;

  }

  updateConfig(config: AppConfig) {
    this.config = config;
    this.config.dispositivo = this.ds.dispositivo;
    // this.updateConfig(this.config);
    this.configUpdate.next(config);
  }

  updateDispositivo(dispositivo: string) {
    this.ds.dispositivo = dispositivo;
    this.config.dispositivo = this.ds.dispositivo;
    // this.updateConfig(this.config);
    this.configUpdate.next(this.config);
  }

  setRipple(vf: boolean) {
    this.config.ripple = vf;
   //  this.updateConfig(this.config);
    this.configUpdate.next(this.config);
    // this.ts.setTema(this.config);
  }

  setScale(n: string) {
    this.config.scale = n;
    console.log('setScale',this.config);
    // this.updateConfig(this.config);
    this.configUpdate.next(this.config);
    // this.ts.setTema(this.config);
  }

  setDarkMode(dark: boolean, theme: string) {
    this.config.dark = dark;
    this.config.theme = theme;
    // this.updateConfig(this.config);
    this.configUpdate.next(this.config);
    // this.ts.setTema(this.config);
  }

  setInputStyle(s: string) {
    this.config.inputStyle = s;
    // this.updateConfig(this.config);
    this.configUpdate.next(this.config);
    // this.ts.setTema(this.config);
  }

  setConfig(config: AppConfig) {
    // this.updateConfig(this.config);
    this.ts.setTema(config);
  }

  setThema(str: string, d: boolean) {
    this.config.theme = str;
    this.config.dark = d;
    // this.updateConfig(this.config);
    this.configUpdate.next(this.config);
    // this.ts.setTema(this.config);
  }


  getConfig() {
    if (localStorage.getItem('appconfig')) {
      this.config = this.ts.parceAppConfig(JSON.parse(localStorage.getItem('appconfig')));
      if (this.config.usuario_uuid === undefined) {
        this.config.usuario_uuid = JSON.parse(localStorage.getItem('usuario_uuid'));
      }
      this.configUpdate.next(this.config);
      // this.updateConfig(this.config);
    } else {
      this.configUpdate.next(this.config);
      // this.updateConfig(this.config);
    }
    //return this.config;
  }

  onRippleChange() {
    if (this.config.ripple)
      DomHandler.removeClass(document.body, 'p-ripple-disabled');
    else
      DomHandler.addClass(document.body, 'p-ripple-disabled');
  }

  applyScale() {
    document.documentElement.style.fontSize = this.config.scale + 'px';
  }

  toggleDarkMode() {
    // this.config.dark = !this.config.dark;

    let theme = this.config.theme;
    theme = this.config.dark
      ? theme.replace("light", "dark")
      : theme.replace("dark", "light");
    this.config = { ...this.config, dark: this.config.dark, theme: theme };
  }

  /*onMenuButtonClick() {
    this.addClass(document.body, 'blocked-scroll');
  }
  addClass(element: any, className: string) {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += ' ' + className;
  }

  removeClass(element: any, className: string) {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }*/

}
