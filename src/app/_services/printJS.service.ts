import { Injectable } from '@angular/core';
import { PrintJSInterface } from '../_models';
import * as printJS from 'print-js';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})

export class PrintJSService {

  constructor() { }

  public static imprimirTabela(campos: any[], valores: any[]) {
    const dados = UtilService.camposValoresParaPrintJS(campos, valores);

    const titTabStyle = 'background-color: red;' +
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
}
