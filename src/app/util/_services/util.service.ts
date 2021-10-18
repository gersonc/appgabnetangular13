import { Injectable } from '@angular/core';
import { PrintJSInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public static copiaObjetos(obj: any[] | null): any {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = UtilService.copiaObjetos(obj[i]);
      }
      return copy;
    }

    // Handle Object
    copy = {};
    // @ts-ignore
    for (const attr in obj) {
      // @ts-ignore
      if (obj.hasOwnProperty(attr)) {
        // @ts-ignore
        copy[attr] = UtilService.copiaObjetos(obj[attr]);
      }
    }
    return copy;

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
  }

  public static colunasParaPrintJS(campos: any[]): PrintJSInterface[] {
    const colunas: PrintJSInterface[] = [];
    campos.forEach((c) => {
      colunas.push({
        field: c.field,
        displayName: c.header.toString()
      });
    });
    return colunas;
  }

  public static camposValoresParaPrintJS (campos: any[], valores: any[]): any[] {
    const colunas: PrintJSInterface[] = [];
    campos.forEach((c) => {
      colunas.push({
        field: c.field,
        displayName: c.header.toString()
      });
    });
    valores.forEach((v) => {
      const linha: any[] = [];
      campos.forEach((c) => {
        if (v[c.field] === null) {
          v[c.field] = '';
        }
      });
    });
    const resp: any[] = [];
    // @ts-ignore
    resp['colunas'] = colunas;
    // @ts-ignore
    resp['linhas'] = valores;
    return resp;
  }

  public static getIds(campo_nome: string, dados: any): number[] {
    const ids: number[] = [];
    dados.forEach((v: { [x: string]: number; }) => {
      ids.push(v[campo_nome]);
    });
    return ids;
  }

}
