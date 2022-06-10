export interface QuillViewI {
  cphtml?: string | null;
  cpdelta?: any;
  cdtexto?: string | null;
  format: 'html' | 'object' | 'text' | 'json';
}

export class QuillViewC implements QuillViewI {
  private _cdtexto?: string | null = null;
  private _cpdelta?: any = null;
  private _cphtml?: string | null = null;
  private _format?: 'html' | 'object' | 'text' | 'json' = 'html';
  private resp?: any = null;

    /*constructor(cdtexto?: string, cpdelta?: any, cphtml?: string, format?: 'html' | 'object' | 'text' | 'json') {
      this._cdtexto = cdtexto;
      this._cpdelta = cpdelta;
      this._cphtml = cphtml;
      this._format = format;
    }*/
  constructor() {
  }

  get cdtexto(): string {
    return this._cdtexto;
  }

  set cdtexto(value: string) {
    this.modifica('tx', value);
  }

  get cpdelta(): any {
    return this._cpdelta;
  }

  set cpdelta(value1: any) {
    this._cpdelta = value1;
    this.modifica('dt', value1);
  }

  get cphtml(): string {
    return this._cphtml;
  }

  set cphtml(value: string) {
    this.modifica('ht', value);
  }

  get format(): 'html' | 'object' | 'text' | 'json' {
    return this._format;
  }

  set format(value: string) {
    this.modifica('ft', value);
  }

  get conteudo(): any {
      return this.resp;
  }

  modifica(cp: string, valor: any) {
    console.log(cp, valor);
    switch (cp) {
      case 'dt':
        if (valor !== null) {
        // if (valor !== null) {
          // this._cpdelta = JSON.parse(valor);
          console.log('Object', valor);

          this._format = 'json';
          this.resp = valor;
          /*if (valor instanceof Object) {
            console.log('instanceof Object ', valor);
            this._cpdelta = valor;
            this._format = 'json';
            this.resp = valor;
          } else {
            if (typeof (valor) === 'string') {
              console.log('Objectstring ', valor);
              this._cpdelta = JSON.parse(valor);
              this._format = 'json';
              this.resp = valor;
            } else {
              this._cpdelta = null;
            }
          }*/
        }
        break;
      case 'ht':
        if (typeof (valor) !== 'undefined' && valor !== null) {
          if (typeof (valor) === 'string') {
            this._cphtml = valor;
            if (this._cpdelta === null) {
              this._format = 'html';
              this.resp = valor;
            }
          } else {
            this._cphtml = null;
          }
        }
        break;
      case 'tx':
        if (typeof (valor) !== 'undefined' && valor !== null) {
          if (typeof (valor) === 'string') {
            this._cdtexto = valor;
            if (this._cpdelta === null && this._cphtml === null) {
              this._format = 'text';
              this.resp = valor;
            }
          } else {
            this._cdtexto = null;
          }
        }
        break;
      case 'ft':
        this._format = valor;
        break;
    }
  }


}
