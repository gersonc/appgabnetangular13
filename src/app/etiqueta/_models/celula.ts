import {EtiquetaInterface} from "./etiqueta.interface";
import {CadastroEtiquetaI} from "./cadastro-etiqueta-i";
import {EtiquetaCelula} from "./etiqueta-celula";

/*interface CelulaParams {
  v?: CadastroEtiquetaI;
}*/

export class Celula {
  private _celula: string = '';

  constructor(
    x?: CadastroEtiquetaI | null
  ) {
    this.set(x);
  }

  set (x?: CadastroEtiquetaI | null ) {
      this._celula = EtiquetaCelula.montaCelula(x);
  }

  get (): string {
    return this._celula;
  }


}
