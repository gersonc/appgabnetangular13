import {ColunasI} from "../../_models/colunas-i";
import {striptags} from "striptags";
import {html_entity_decode} from "./html-entity";

export function limpaTabelaCampoTexto (colunas: ColunasI[], campoTexto: string[], dados: any[]): any[] {
  const cps: ColunasI[] = [];
  colunas.forEach( (c, i) => {
    if (campoTexto.indexOf(c.field) !== -1) {
      cps.push(c);
    }
  });
  if (cps.length > 0) {
    const ctmp: any[] = [];
    cps.forEach(c => {
      ctmp.push({htm: c.field, txt: c.field + '_texto'});
    });
    dados.forEach((d,i,dd) => {
      ctmp.forEach(ct =>{
        if (d[ct.txt] !== undefined && d[ct.txt] !== null) {
          dd[i][ct.htm] = d[ct.txt];
        } else {
          if (d[ct.htm] !== undefined && d[ct.htm] !== null) {
            dd[i][ct.htm] = html_entity_decode(striptags(dd[i][ct.htm]), 'HTML_SPECIALCHARS');
          } else {
            dd[i][ct.htm] = null;
          }
        }
      })
    });
  }
  return dados;
}
