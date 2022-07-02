import {ColunasI} from "../../_models/colunas-i";

export function ExcelParcer(dados: any[], campos: ColunasI[]): any[] {
  let keys: string[] = [];
  let titulos: string[] = [];
  let tamanho: any[] = [];
  campos.forEach(c => {
    keys.push(c.field);
    titulos.push(c.header);
    tamanho.push({ wch: ((+c.width.replace('px','')/10)+2)});
  });

  // @ts-ignore
  const arrayOfKeys: (keyof dados)[] = keys;

  const fooArrayWithLimitedKeys = dados.map(item => {
    const returnValue = {}
    arrayOfKeys.forEach(key => {
      returnValue[key] = item[key]
    })
    return returnValue;
  })

  return [fooArrayWithLimitedKeys, [titulos], tamanho];

}
