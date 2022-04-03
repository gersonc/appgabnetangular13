import {TSMap} from "typescript-map"


/* It takes a list of titles and a list of objects and returns a list of lists of lists of strings */
export class SolicSeparaSolicitaca {
  objeto: any;
  camposTxt: string[];
  camposTxtAtivos: boolean[];
  numCamposTXT = 0;
  subItens: string[];
  numSubItens = 0;
  numCamposExcluidos = 0;
  camposExcluidos: string[];
  orientacao: string[];
  titulos: TSMap<string, TSMap<string, string>>;
  subori = new TSMap<string, string>();
  resposta = new TSMap<string, string | string[]>();



  /**
   * It creates a new object of type `Question` with the given parameters.
   * @param {any} objeto - any
   * @param {string[]} subItens - an array of strings that represent the names of the sub-items that will be displayed in
   * the tree.
   * @param {string[]} orientacao - This is an array of strings that defines the orientation of the table. The first
   * element is the orientation of the first row, the second element is the orientation of the second row, and so on.
   * @param titulos - TSMap<string, TSMap<string, string>>
   * @param {string[]} camposTxt - an array of strings that represent the names of the fields that will be displayed in the
   * table.
   * @param {boolean[]} camposTxtAtivos - boolean[]
   * @param {string[]} camposExcluidos - an array of strings that represent the names of the fields that should not be
   * displayed.
   */
  constructor(objeto: any, subItens: string[] = [], orientacao: string[], titulos: TSMap<string, TSMap<string, string>>, camposTxt: string[] = [], camposTxtAtivos: boolean[], camposExcluidos: string[] = []) {
    this.objeto = objeto;
    this.subItens = subItens;
    this.numSubItens = this.subItens.length;
    this.camposTxt = camposTxt;
    this.camposTxtAtivos = camposTxtAtivos;
    this.camposExcluidos = camposExcluidos;
    this.orientacao = orientacao;
    this.numCamposExcluidos = this.camposExcluidos.length;
    this.titulos = titulos.clone();
  }

  /**
   * It creates an array of strings that will be used to create the fields in the database.
   * @param {string[]} camposTxt - string[]
   * @returns an array of strings.
   */
  getCamposTxt(camposTxt: string[]): string[] {
    if (camposTxt.length === 0) {
      this.numCamposTXT = 0;
      return [];
    }
    let chavesTexto: string[] = []
    camposTxt.forEach(t => {
      chavesTexto.push(t);
      chavesTexto.push(t + '_delta');
      chavesTexto.push(t + '_texto');
    });
    this.numCamposTXT = chavesTexto.length;
    return chavesTexto;
  }

  /**
   * It creates a map with the subitems as keys and the values as the subitems' titles and the subitems' values.
   * @returns A Map with the following structure:
   */
  getSeparaSolicitacao(): TSMap<string, string[] | string[][]> {
    for (let i = 0; i < this.numSubItens; i++) {
      this.subori.set(this.subItens[i], this.orientacao[i]);
    }
    const objKeys: string[] = Object.keys(this.objeto);
    const objValues: any[] = Object.values(this.objeto);
    let detalhe = new TSMap<string, string[] | string[][]>();
    for (let i = 0; i < this.numSubItens; i++) {
      if (this.subori.get(objKeys[i]) === 'vertical') {
        detalhe.set(objKeys[i], this.montaVertical(this.titulos.get(objKeys[i]), objKeys[i], objValues[i]));
      } else {
        detalhe.set(objKeys[i], this.montaHorizontal(this.titulos.get(objKeys[i]), objKeys[i], objValues[i]));
      }
    }
    return detalhe;
  }


  /**
   * It takes a list of titles and a list of objects and returns a list of lists of lists
   * @param titulos - A map of the column names and their titles.
   * @param chave - The key of the object that you want to use to group the data.
   * @param {any[]} obj - any[]
   * @returns an array of arrays. The first array is the array of arrays that will be used to create the table. The second
   * array is the array of arrays that will be used to create the text.
   */
  montaHorizontal(titulos: TSMap<string, string>, chave, obj: any[]): string[][] {
    let resp: string[][] = [];
    let arrv: string[] = [];
    let arrx: string[] = [];
    let titulosCamposTexto = new TSMap<string, string>();
    this.camposExcluidos.forEach(k => {
      if (titulos.has(k)) {
        titulos.delete(k);
      }
      if (titulos.has(k + '_delta')) {
        titulos.delete(k + '_delta');
      }
      if (titulos.has(k + '_texto')) {
        titulos.delete(k + '_texto');
      }
    });

    let a = 0;
    /*this.camposTxt.forEach(k => {
      if (this.camposTxtAtivos[a]) {
        if (titulos.has(k)) {
          titulosCamposTexto.set(k, titulos.get(k));
        }
      }
      if (titulos.has(k + '_delta')) {
        titulos.delete(k + '_delta');
      }
      if (titulos.has(k + '_texto')) {
        titulos.delete(k + '_texto');
      }
      a++;
    });*/
    resp.push(titulos.values());
    obj.forEach(ob => {
      let arrtemp: string[] = [];
      // let arrtemptxt: string[] = [];
      const keys: string[] = Object.keys(ob);
      const vals: string[] = Object.values(ob);

      titulos.forEach((value, key) => {
        if (keys.indexOf(key) !== -1) {
          arrtemp.push(vals[keys.indexOf(key)]);
        }
      });
      /*titulosCamposTexto.forEach((value, key) => {
        if (keys.indexOf(key) !== -1) {
          arrtemptxt.push(vals[keys.indexOf(key)]);
        }
      });*/
      // arrx.push(arrtemptxt)
      resp.push(arrtemp);
    });
    if (arrv.length > 1) {
      return resp
    } else {
      const zero: string[][] = [];
      return zero;
    }
  }

  /**
   * Given a list of titles and a list of objects, return a list of lists of lists of strings
   * @param titulos - A map of the column titles.
   * @param chave - The key of the object you want to use as the header.
   * @param {any[]} obj - any[]
   * @returns an array of arrays of arrays.
   */
  montaVertical(titulos: TSMap<string, string>, chave, obj: any[]): string[] | string[][] {
    let titulosCamposTexto = new TSMap<string, string>();
    this.camposExcluidos.forEach(k => {
      if (titulos.has(k)) {
        titulos.delete(k);
      }
      if (titulos.has(k + '_delta')) {
        titulos.delete(k + '_delta');
      }
      if (titulos.has(k + '_texto')) {
        titulos.delete(k + '_texto');
      }
    });
    /*let a = 0;
    this.camposTxt.forEach(k => {
      if (this.camposTxtAtivos[a]) {
        if (titulos.has(k)) {
          titulosCamposTexto.set(k, titulos.get(k));
        }
      }
      if (titulos.has(k + '_delta')) {
        titulosCamposTexto.set(k, titulos.get(k + '_delta'));
      }
      if (titulos.has(k + '_texto')) {
        titulosCamposTexto.set(k, titulos.get(k + '_texto'));
      }
      a++;
    });*/

    if (Array.isArray(obj)) {
      let resp1: string[] = [];
      let atp: string[] = [];
      obj.forEach(ob => {
        const n: number = ob.length;
        const objKeys: string[] = Object.keys(ob);
        const nobjKeys = objKeys.length;
        const objValues: any[] = Object.values(ob);
        // const arrh: string[][] = []

        for (let i = 0; i < nobjKeys; i++) {
          if (objValues[i] && titulos.get(objKeys[i])) {
            atp.push(titulos.get(objKeys[i]), objValues[i]);
          }
        }
        resp1 = [...atp];
      })
      return resp1;
    } else {
      let resp2: string[] = [];
      let atp2: string[] = [];
      const objKeys: string[] = Object.keys(obj);
      const nobjKeys = objKeys.length;
      const objValues: any[] = Object.values(obj);
      let arrh: string[][] = []
      for (let i = 0; i < nobjKeys; i++) {
        if (objValues[i] && titulos.get(objKeys[i])) {
          resp2.push(titulos.get(objKeys[i]), objValues[i]);
        }
      }
      /// resp1.push(arrh);
      return resp2;
    }
  }
}
