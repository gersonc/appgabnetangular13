import {ColunasI} from "../../_models/colunas-i";

export function ExcelParcer(valores: any[], campos: ColunasI[]): any[] {
  let dados: any[];
  let keys: string[] = [];
  let tamanho: any[] = [];
  let titulos = {}
  campos.forEach(c => {
    keys.push(c.field);
    tamanho.push({
      wch: ((+c.width.replace('px', '') / 10) + 2), s: {
        alignment: {
          vertical: "top",
          horizontal: "left",
          wrapText: true
        }
      }
    });
    titulos[c.field] = c.header;
  });
  dados = valores;
  // @ts-ignore
  const arrayOfKeys: (keyof dados)[] = keys;
  let titulosTmp = {}
  arrayOfKeys.forEach(key => {
    if (titulos[key] === undefined) {
      titulosTmp[key] = '';
    } else {
      titulosTmp[key] = titulos[key];
    }
  });
  dados.splice(0, 0, titulosTmp);
  let tituloVF = true;
  const fooArrayWithLimitedKeys = dados.map(item => {
    const returnValue = {}
    arrayOfKeys.forEach(key => {
      if (item[key] === undefined || item[key] === null) {
        item[key] = '';
      }
      if (tituloVF) {
        returnValue[key] = {
          v: item[key],
          t: "s",
          s: {
            fill: {bgColor: {rgb: "FFFFFF"}, fgColor: {rgb: "007BFF"}},
            font: {bold: true, color: {rgb: "FFFFFF"}},
            alignment: {wrapText: true},
            border: {left: {style: "thin", color: {rgb: "FFFFFF"}}, right: {style: "thin", color: {rgb: "FFFFFF"}}}
          }
        };
      } else {
        returnValue[key] = {
          v: item[key],
          t: (typeof item[key] === 'string') ? 's' : (typeof item[key] === 'number') ? 'n' : (typeof item[key] === 'object') ? 'd' : 's',
          s: {alignment: {wrapText: true, vertical: "top"}},
          z: (typeof item[key] === 'object') ? "dd/mm/yyyy" : (typeof item[key] === 'number' && key.toString().search('valor')) ? "4" : null}
      }
      // t: (typeof item[key] === 'string') ? 's' : (typeof item[key] === 'number') ? 'n' : (item[key] instanceof Date) ? 'd' : 's',
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
    tamanho.push({
      wch: ((+c.width.replace('px', '') / 10) + 2), s: {
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: '1'
        }
      }
    });
  });

  // @ts-ignore
  const arrayOfKeys: (keyof dados)[] = keys;


  const fooArrayWithLimitedKeys = dados.map(item => {
    const returnValue = {}
    arrayOfKeys.forEach(key => {
      returnValue[key] = {v: item[key], t: 's', s: {alignment: {wrapText: true}}}
    })
    return returnValue;
  })

  return [fooArrayWithLimitedKeys, [titulos], tamanho];

}
