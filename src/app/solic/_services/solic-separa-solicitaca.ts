import {SolicListarI} from "../_models/solic-listar-i";
import {Detalhe} from "../_models/detalhe";
import {take} from "rxjs/operators";
import { TSMap } from "typescript-map"



export class SolicSeparaSolicitaca {
  objeto: any;
  camposTxt: string[];
  numCamposTXT = 0;
  subItens: string[];
  numSubItens = 0;
  numCamposExcluidos = 0;
  camposExcluidos: string[];


  /**
   * It creates a new object of type "Objeto"
   * @param {any} objeto - The object that you want to display.
   * @param {string[]} subItens - an array of strings that represent the sub-items that will be displayed in the table.
   * @param {string[]} camposTxt - an array of strings that represent the names of the fields that should be displayed in
   * the table.
   * @param {string[]} camposExcluidos - an array of strings that represent the names of the fields that you want to
   * exclude from the export.
   */
  constructor(objeto: any, subItens: string[] = [], camposTxt: string[] = [], camposExcluidos: string[] = []) {
    this.objeto = objeto;
    this.subItens = subItens;
    this.numSubItens = this.subItens.length;
    this.camposTxt = camposTxt;
    this.numCamposTXT = this.camposTxt.length;
    this.camposExcluidos =  camposExcluidos;
    this.numCamposExcluidos = this.camposExcluidos.length;
    console.log('objeto', objeto);

  }

  getSeparaSolicitacao() {
    const objKeys: string[] = Object.keys(this.objeto);
    const nobjKeys = objKeys.length - 1;
    const objValues: any[] = Object.values(this.objeto);
    let chavesTexto: string[] = [];
    let obj = new Map<string, any>();
    let tmp = new Map<string, any>();
    let detalhe = new Map<string, Map<string, any>>();
    //const strObj = objKeys[0].slice(0, objKeys[0].indexOf('_'));

    if (this.numCamposTXT > 0) {
      this.camposTxt.forEach( t => {
        chavesTexto.push(t);
        chavesTexto.push(t + '_delta');
        chavesTexto.push(t + '_texto');
      });
    }
    const numChavesTexto = chavesTexto.length;


    for(let i = 0; i < nobjKeys; i++) {
      obj.set(objKeys[i], tmp);
    }
    console.log('tmp1', detalhe);
    detalhe.set(objKeys[0].slice(0, objKeys[0].indexOf('_')), obj);


    if (this.numSubItens > 0) {
      let a = 0;

      for (let [key, value] of tmp) {
        obj = new Map<string, any>();
        let kk = Object.keys(value);
        let nkk = kk.length;
        let vv = Object.values(value);
        for(let i = 0; i < nkk; i++) {
          if (this.numCamposExcluidos > 0) {
            if (this.camposExcluidos.indexOf(kk[i]) >= 0) {
              continue;
            }
          }
          if (this.numCamposTXT > 0) {
            if (chavesTexto.indexOf(kk[i]) >= 0) {
              continue;
            }
          }
          obj.set(kk[i], vv[i]);
        }
        detalhe.set(key, obj);
        a++;
      }
    }

    console.log('detalhe', detalhe);

    /*

    let sol: string[] = [];
    console.log('objKeys->', objKeys);
    console.log('objValues->', objValues);


    const k: string[] = Object.keys(titulos.solicitacao);
    const t: string[] = Object.values(titulos.solicitacao);
    const s: string[] = Object.keys(objeto);
    const v: any[] = Object.values(objeto);


    const tit: string[] = [];


    for (let i = 0; i < s.length; i++) {
      if (s[i] !== 'solicitacao_descricao' && s[i] !== 'solicitacao_aceita_recusada' && s[i] !== 'solicitacao_carta') {
        sol[s[i]] = v[i].toString();
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'solicitacao_descricao' && k[i] !== 'solicitacao_aceita_recusada' && k[i] !== 'solicitacao_carta') {
        tit[k[i]] = t[i];
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'solicitacao_descricao' && k[i] !== 'solicitacao_aceita_recusada' && k[i] !== 'solicitacao_carta') {
        solicitacao.push([tit[k[i]], sol[k[i]]]);
      }
    }

    */



  }

  separa(cpo: string, titulos: any, valores: any, subItens: string[] = [], camposExcluidos: string[] = []) {
    const k: string[] = Object.keys(titulos);
    const t: string[] = Object.values(titulos);
    const s: string[] = Object.keys(valores);
    const v: any[] = Object.values(valores);

    let rK: string[] = [];
    let rT: string[] = [];
    let rV: any[] = [];

    let dtl: Detalhe;

    for (let i = 0; i < k.length; i++) {

      if (k[i].indexOf(cpo) === 0) {
        rK.push(k[i]);
        rT.push(t[i]);
      }
    }

    for (let i = 0; i < rK.length; i++) {
      rV.push(v[s.indexOf(rK[i])]);
      // dtl.k[i] = s.indexOf(rK[i]);
    }




  }

}
