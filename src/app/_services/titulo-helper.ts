import {TSMap} from "typescript-map";

export class TituloHelper {

  static get(nome: string): TSMap<string, TSMap<string, string>> | undefined {
    // @ts-ignore
    return new TSMap().fromJSON(JSON.parse(sessionStorage.getItem(nome)), true);
  }

  static set(titulos: any[], nome: string): TSMap<string, TSMap<string, string>> {
      if (sessionStorage.getItem(nome)) {
        // @ts-ignore
        return new TSMap().fromJSON(JSON.parse(sessionStorage.getItem(nome)), true);
      } else {
        return  this.makeTitulos(titulos, nome);
      }
  }

  static makeTitulos(titulos: any[], nome: string): TSMap<string, TSMap<string, string>> {
    const titulosKeys: string[] = Object.keys(titulos);
    const neys = titulosKeys.length;
    const titulosValues: any[] = Object.values(titulos);
    let tit = new  TSMap<string, TSMap<string, string>>();
    for (let tk = 0; tk < neys; tk++) {
      let mtit = new  TSMap<string, string>();
      const kk = titulosKeys[tk];
      const ttk = Object.keys(titulosValues[tk]);
      const ttv = Object.values(titulosValues[tk]);
      const ttn = ttv.length;
      for (let tt = 0; tt < ttn; tt++) {
        mtit.set(ttk[tt], ttv[tt].toString());
      }
      tit.set(kk, mtit);
    }
    sessionStorage.setItem(nome, JSON.stringify(tit.toJSON()));
    return tit;
  }
}
