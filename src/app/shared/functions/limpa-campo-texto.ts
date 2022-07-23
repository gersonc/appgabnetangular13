import {html_entity_decode} from "./html-entity";
import {striptags} from "striptags";
import {Stripslashes} from "./stripslashes";

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

export function limpaCampoTextoPlus(campoTexto: string[], dados: any[]): any[] {
  dados.forEach((d, i, dd) => {
    campoTexto.forEach(ct => {
      if (d[ct] !== undefined && d[ct] !== null) {
        dd[i][ct] = html_entity_decode(striptags(Stripslashes(dd[i][ct])), 'HTML_SPECIALCHARS');
      }
    })
  });
  return dados;
}
