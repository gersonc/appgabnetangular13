import {TitulosI} from "./titulo-i";

export type modulostitulos = {
  [index in string | number]: TitulosModulo;
};

export interface TitulosModuloI {
  titulos: TitulosI[];
  campos: string[];
  modulo: string;
}

export class TitulosModulo implements TitulosModuloI{
  private _titulos: TitulosI[] = [];
  private _campos: string[] = [];
  private _modulo: string | null = null;

  constructor(mod?: string, cps?: string[], tit?: TitulosI[]) {
    if (mod !== undefined) {
      this._modulo = mod;
    }
    if (cps !== undefined) {
      this._campos = [...cps];
    }
    if (tit !== undefined) {
      this._titulos = this.parceTitulos(cps, tit);
    }
  }

  get campos(): string[] {
    return this._campos
  }

  set campos(value: string[]) {
    this._campos = [];
    this._campos = [...value];
  }

  get modulo(): string {
    return this._modulo;
  }

  set modulo(value: string) {
    this._modulo = value;
  }

  get titulos(): TitulosI[] {
    return this._titulos;
  }

  set titulos(value: TitulosI[]) {
    this._titulos = this.parceTitulos(this._campos, value);
  }

  pegaTitulos(cps: string[] = []): TitulosI[] {
    if (Array.isArray(this._titulos)) {
      if (cps.length === 0) {
        return this._titulos;
      } else {
        return cps.map(c => {
          return this._titulos.find( t => t.field === c);
        });
      }
    }
  }

  parceTitulos(cps: string[] = [], tit: TitulosI[] = []): TitulosI[] {
    return cps.map(c => {
      let fd: TitulosI = this._titulos.find( t => t.field === c);
      return (fd !== undefined) ? fd : {
        field: c,
        titulo: c.toUpperCase() + ' NÃO DEFINIDO',
        mtitulo: c + ' não definido'
      }
    });
  }

  getMinusculos(fields: string[]): any[] {
    let minusculos: any[] = [];
    fields.forEach(f => {
      const t: TitulosI = this._titulos.find( t => t.field === f);
      minusculos[t.field] = t.mtitulo;
    });
    return minusculos;
  }

  getMaiusculos(fields: string[]): any[] {
    let maiusculos: any[] = [];
    fields.forEach(f => {
      const t: TitulosI = this._titulos.find( t => t.field === f);
      maiusculos[t.field] = t.mtitulo;
    });
    return maiusculos;
  }


  length(): number {
    return this._titulos.length;
  }

  clear():void {
    this._titulos = [];
    this._campos = [];
    this._modulo = null;
  }

  add(t: TitulosI | TitulosI[]) {
    if(Array.isArray(t)) {
      this._titulos.push(...t);
    } else {
      this._titulos.push(t);
    }
  }

  vf(): boolean {
    return this._titulos.length > 0;
  }
}
