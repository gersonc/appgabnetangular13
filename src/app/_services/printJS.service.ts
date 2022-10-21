import {Injectable} from '@angular/core';
import * as printJS from 'print-js';
import {UtilService} from './util.service';
import {ColunasI} from "../_models/colunas-i";


interface printPropertiesI {
  field: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})

export class PrintJSService {

  constructor() { }

  public static imprimirTabela2(campos: ColunasI[], valores: any[], titulo: string) {

    const properties: printPropertiesI[] = campos.map(c => {
      const prop: printPropertiesI = {
        field: c.field,
        displayName: c.header
      };
      return prop;
    });
    // @ts-ignore
    const arrayOfKeys: (keyof valores)[] = properties.map(p => {
      return p.field;
    });
    valores.forEach((v, i, vv)=> {
      arrayOfKeys.forEach(key => {
        if (v[key] === undefined || v[key] === null) {
          v[key] = '';
          vv[i][key] = '';
        }
      });
    });

    const titTabStyle =
      'padding-left: .3em;' +
      'padding-right: .3em;' +
      'font-weight: bold;' +
      'font-size: 12px;' +
      'border: 0.5px solid lightgray;' +
      'font-family: sans-serif;';

    const tabStyle = 'padding-left: .3em;' +
      'padding-top: .3em;' +
      'padding-right: .3em;' +
      'border: 0.5px solid lightgray;' +
      'font-weight: normal;' +
      'font-family: sans-serif;' +
      'font-size: 10px;' +
      'vertical-align: text-top;'

    printJS(
      {
        printable: valores,
        properties: properties,
        type: 'json',
        gridHeaderStyle: titTabStyle,
        gridStyle: tabStyle,
        documentTitle: titulo,
      });
  }



  public static imprimirTabela(campos: any[], valores: any[]) {
    const dados = UtilService.camposValoresParaPrintJS(campos, valores);

    const titTabStyle =
      'padding-left: .3em;' +
      'padding-right: .3em;' +
      'font-weight: bold;' +
      'font-size: 12px;' +
      'border: 0.5px solid lightgray;' +
      'font-family: sans-serif;';

    const tabStyle = 'padding-left: .3em;' +
      'padding-right: .3em;' +
      'border: 0.5px solid lightgray;' +
      'font-weight: normal;' +
      'font-family: sans-serif;' +
      'font-size: 10px;';

    printJS(
      {
        // @ts-ignore
        printable: dados['linhas'],
        // @ts-ignore
        properties: dados['colunas'],
        type: 'json',
        gridHeaderStyle: titTabStyle,
        gridStyle: tabStyle
      });
  }


  public static imprimirTabela3(dados: any[], titulos: any[]) {
    printJS(
      {
        printable: dados,
        properties: titulos,
        type: 'json'
      });
  }
}
