import { AppConfig, AppConfigServerI } from "../../_models/appconfig";

export function parceAppConfig(dados?: string): AppConfig {
  const a: any = (dados !== undefined) ? dados : JSON.parse(localStorage.getItem("appconfig"));
  if (a.usuario_uuid === undefined) {
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

export function parceToServer(a: AppConfig): AppConfigServerI {
  return {
    usuario_uuid: a.usuario_uuid,
    scale: (a.scale.length < 3) ? "14px" : a.scale,
    theme: a.theme,
    dispositivo: a.dispositivo,
    dark: (a.dark) ? 1 : 0,
    inputstyle: a.inputStyle,
    ripple: (a.ripple) ? 1 : 0
  };
}

export function parceFronServer(c: AppConfigServerI): AppConfig {
  let cAtual: AppConfig;
  cAtual.ripple = (c.ripple !== 0);
  cAtual.theme =(c.theme !== undefined) ? c.theme : "lara-light-blue";
  cAtual.dark = (c.dark === undefined || c.dark == 1);
  cAtual.inputStyle =(c.inputstyle !== undefined) ? c.inputstyle : "filled";
  cAtual.usuario_uuid = (c.usuario_uuid !== undefined) ? c.usuario_uuid : null;
  cAtual.scale = (c.scale !== undefined) ? c.scale : "14px";
  cAtual.dispositivo = (c.dispositivo !== undefined) ? c.dispositivo : "desktop";
  return cAtual
}
