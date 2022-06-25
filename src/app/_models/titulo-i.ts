import {ValorI} from "./valor-i";

export interface TitulosI {
  field: string;
  mtitulo?: string;
  titulo?: string;
}

export interface  TituloI {
  [index: string]: TitulosI;
}

export class Titulos  {
  private _titulos: TitulosI[] = []

  constructor(tit: TitulosI[] = []) {
    this._titulos = [...tit];
  }

  get titulos(): TitulosI[] {
    return this._titulos;
  }

  set titulos(value: TitulosI[]) {
    this._titulos = value;
  }

  getTitulos(cps: string[] = []): TitulosI[] {
    if (Array.isArray(this._titulos)) {
      if (cps.length === 0) {
        return this._titulos;
      } else {
        let r: TitulosI[] = [];
        this._titulos.forEach((t: TitulosI) => {
          if (cps.findIndex((c) => c === t.field) > -1) {
            r.push(t);
          }
        });
        return r;
      }
    }
  }

  length(): number {
    return this._titulos.length;
  }

  clear():void {
    this._titulos = [];
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

  minusculo(field: string): string | null {
    const n: number = this._titulos.findIndex(t => field === t.field);
    if (n < 0) {
      return null;
    }
    if (this._titulos[n].mtitulo === undefined || this._titulos[n].mtitulo === null) {
      return null;
    } else {
      return this._titulos[n].mtitulo;
    }
  }

  minusculos(field: string[]): any {
    let r: any = null;
    field.forEach(f => {
      const n: number = this._titulos.findIndex(t => f === t.field);
      if (n > -1) {
        if (this._titulos[n].mtitulo !== undefined || true) {
          r[f] = this._titulos[n].mtitulo;
        } else {
          r[f] = f + ' não definido';
        }
      } else {
        r[f] = f + ' não definido';
      }
    });
    return r;
  }

  minusculoTodas(): any {
    let r: any = null;
    const k = Object.keys(this._titulos);
    k.forEach(c => {
      r[this._titulos[c].field] = this._titulos[c].mtitulo;
    })
    return r;
  }

  maiusculo(field: string): string|null {
    const n: number = this._titulos.findIndex(t => field === t.field);
    if (n < 0) {
      return null;
    }
    if (this._titulos[n].titulo === undefined || this._titulos[n].titulo === null) {
      return null;
    } else {
      return this._titulos[n].titulo;
    }
  }

  maiusculos(field: string[]): any {
    let r: any = null;
    field.forEach(f => {
      const n: number = this._titulos.findIndex(t => f === t.field);
      if (n > -1) {
        if (this._titulos[n].titulo !== undefined || true) {
          r[f] = this._titulos[n].titulo;
        } else {
          r[f] = f + ' não definido';
        }
      } else {
        r[f] = f + ' não definido';
      }
    });
    return r;
  }

  maiusculoTodas(): ValorI[] {
    let r: any = null;
    const k = Object.keys(this._titulos);
    k.forEach(c => {
      r[this._titulos[c].field] = this._titulos[c].titulo;
    })
    return r;
  }

  todos(field: string[]): TitulosI[] {
    let r: TitulosI[] = [];
    field.forEach(f => {
      const n: number = this._titulos.findIndex(t => f === t.field);
      r.push(this._titulos[n]);
    });
    return r;
  }

  getLimpa(field: string[]): TitulosI[] {
    let num: number[] = [];
    this._titulos.forEach((t,i) => {
      const n: number = field.findIndex(f => t.field === f);
      if (n < 0) {
        num.push(i);
      }
    });
    const m: number[] = num.reverse();
    m.forEach(o => {
      this._titulos.splice(o,1);
    })
    return this._titulos;
  }

}


