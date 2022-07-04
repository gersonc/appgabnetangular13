import {html_entity_decode} from "./html-entity";
import {striptags} from "striptags";

export function limpaCampoTexto(campoTexto: string[], dados: any[]): any[] {
  dados.forEach((d, i, dd) => {
    campoTexto.forEach(ct => {
      if (d[ct] !== undefined && d[ct] !== null) {
        dd[i][ct] = html_entity_decode(striptags(dd[i][ct]), 'HTML_SPECIALCHARS');
      }
    })
  });
  return dados;
}
