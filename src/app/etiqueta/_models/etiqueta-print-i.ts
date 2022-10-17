import {Celula} from "./celula";

export interface EtiquetaPrintI {
}

export class Linha {
  private _celulas: Celula[] | null = null;


  constructor(c?: [] | Celula | Celula[] | null) {
    this.set(c);
  }

  public add (c: Celula) {
    this._celulas.push(c);
  }

  push (c?: [] | Celula | Celula[] | null) {
    if (c === undefined || c === [] || c === null ) {
      this._celulas = null;
    } else {
      if(Array.isArray(c)) {
        this._celulas.push(...c);
      } else {
        this._celulas.push(c);
      }
    }
  }

  set (c?: [] | Celula | Celula[] | null) {
    if (c === undefined || c === [] || c === null ) {
      this._celulas = null;
    } else {
      if(Array.isArray(c)) {
        this._celulas.push(...c);
      } else {
        this._celulas.push(c);
      }
    }
  }

  get lenght(): number {
    return (this._celulas === null || this._celulas.length === 0) ? 0 : this._celulas.length;
  }

  get (): Celula[] {
    return this._celulas;
  }

  toArray<Celula>(xs: Iterable<Celula>): Celula[] {
      return [...xs];
  }

}


export class Tabela {
  private _linhas: Linha[] | null = null;


  constructor(c?: [] | Linha | Linha[] | null) {
    this.set(c);
  }

  public add (c: Linha) {
    this._linhas.push(c);
  }

  push (c?: [] | Linha | Linha[] | null) {
    if (c === undefined || c === [] || c === null ) {
      this._linhas = null;
    } else {
      if(Array.isArray(c)) {
        this._linhas.push(...c);
      } else {
        this._linhas.push(c);
      }
    }
  }

  set (c?: [] | Linha | Linha[] | null) {
    if (c === undefined || c === [] || c === null ) {
      this._linhas = null;
    } else {
      if(Array.isArray(c)) {
        this._linhas.push(...c);
      } else {
        this._linhas.push(c);
      }
    }
  }

  get lenght(): number {
    return (this._linhas === null || this._linhas.length === 0) ? 0 : this._linhas.length;
  }

  get (): Linha[] {
    return this._linhas;
  }

  toArray<Linha>(xs: Iterable<Linha>): Linha[] {
    return [...xs];
  }

}
