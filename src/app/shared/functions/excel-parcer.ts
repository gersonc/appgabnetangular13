import {ColunasI} from "../../_models/colunas-i";

export function ExcelParcer(valores: any[], campos: ColunasI[]): any[] {
  let dados: any[];
  let keys: string[] = [];
  let titulos: string[] = [];
  let tamanho: any[] = [];
  let titulosT = {}
  campos.forEach(c => {
    keys.push(c.field);
    titulos.push(c.header);
    tamanho.push({ wch: ((+c.width.replace('px','')/10)+2), s: {
        alignment: {
          vertical: "top",
          horizontal: "left",
          wrapText: true
      }}});
    titulosT[c.field] = c.header;
  });
  dados = valores;
  // @ts-ignore
  const arrayOfKeys: (keyof dados)[] = keys;
  let titulosTmp = {}
  arrayOfKeys.forEach(key => {
      if (titulosT[key] === undefined) {
        titulosTmp[key] = '';
      } else {
        titulosTmp[key] = titulosT[key];
      }
  });
  dados.splice(0,0, titulosTmp);
  let tituloVF = true;
  const fooArrayWithLimitedKeys = dados.map(item => {
    const returnValue = {}
    arrayOfKeys.forEach(key => {
      if (item[key] === undefined || item[key] === null) {
        item[key] = '';
      }
      if (tituloVF) {
        returnValue[key] = {v: item[key], t: "s", s: {fill: {bgColor: {rgb: "FFFFFF"}, fgColor: {rgb: "007BFF"}}, font: { bold: true, color: { rgb: "FFFFFF" }},  alignment: { wrapText: true }, border: {left: {style: "thin", color: {rgb: "FFFFFF"}},right: {style: "thin", color: {rgb: "FFFFFF"}}} } };
      } else {
        returnValue[key] = {v: item[key], t: 's', s: { alignment: { wrapText: true, vertical: "top" }}}
      }
    })
    tituloVF = false;
    return returnValue;
  })
  return [fooArrayWithLimitedKeys, tamanho];
}

export function ExcelParcer2(dados: any[], campos: ColunasI[]): any[] {
  let keys: string[] = [];
  let titulos: string[] = [];
  let tamanho: any[] = [];
  campos.forEach(c => {
    keys.push(c.field);
    titulos.push(c.header);
    tamanho.push({ wch: ((+c.width.replace('px','')/10)+2), s: {
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: '1'
        }}});
  });

  // @ts-ignore
  const arrayOfKeys: (keyof dados)[] = keys;



  const fooArrayWithLimitedKeys = dados.map(item => {
    const returnValue = {}
    arrayOfKeys.forEach(key => {
      // returnValue[key] = item[key];
      // returnValue[key] = {v: item[key], t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } },  alignment: { wrapText: true } } };
      returnValue[key] = {v: item[key], t: 's', s: { alignment: { wrapText: true }}}
    })
    return returnValue;
  })

  return [fooArrayWithLimitedKeys, [titulos], tamanho];

}
