import {ColunasI} from "../../_models/colunas-i";
import {striptags} from "striptags";
import {html_entity_decode} from "./html-entity";

export function pdfTabelaCampoTexto (colunas: ColunasI[], campoTexto: string[], dados: any[]): any[] {
  let cps: ColunasI[] = [];
  let parse = false;
  colunas.forEach( (c, i) => {
    if (campoTexto.indexOf(c.field) !== -1) {
      cps.push(c);
    }
  });
  if (cps.length > 0) {
    parse = true;
    let ctmp: any[] = [];
    cps.forEach(c => {
      ctmp.push({htm: c.field, txt: c.field + '_texto'});
    });
    let dtmp: any[] = dados;
    dados.forEach((d,i,dd) => {
      ctmp.forEach(ct =>{
        console.log(1,dd[i][ct.htm], dd[i][ct.txt]);
        if (d[ct.txt] !== undefined && d[ct.txt] !== null) {
          dd[i][ct.htm] = d[ct.txt];
          console.log(2,dd[i][ct.htm], dd[i][ct.txt]);
        } else {
          if (d[ct.htm] !== undefined && d[ct.htm] !== null) {
            dd[i][ct.htm] = html_entity_decode(striptags(dd[i][ct.htm]), 'HTML_SPECIALCHARS');
            console.log(3,dd[i][ct.htm], dd[i][ct.txt]);
          } else {
            dd[i][ct.htm] = null;
          }
        }
      })
    });
  }
  console.log(4,dados);
  return dados;
}
