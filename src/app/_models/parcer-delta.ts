export class StringDelta {
  private _in?: any | any[];

  get (): any | any[] {
    return this._in;
  }

  set (value: any | any[]) {
    this._in = this.parcer(value);
  }

  parcer(valor: any | any[]): any | any[] {
    if(Array.isArray(valor)) {
      valor.map(this.parcer);
    } else {
      const k = Object.keys(valor);
      k.forEach(n => {
        if (n.indexOf('delta') !== -1) {
          valor[n] = this.stringToDelta(valor[n]);
        }
      });
      return valor;
    }
  }

  stringToDelta(v: any): any|null {
    if (typeof (v) === 'undefined' || v === null ) {
      return null;
    } else {
      return JSON.parse(v);
    }
  }
}

export class DeltaString {
  private _in?: any | any[];

  get (): any | any[] {
    return this._in;
  }

  set (value: any | any[]) {
    this._in = this.parcer(value);
  }

  parcer(valor: any | any[]): any | any[] {
    if(Array.isArray(valor)) {
      valor.map(this.parcer);
    } else {
      const k = Object.keys(valor);
      k.forEach(n => {
        if (n.indexOf('delta') !== -1) {
          valor[n] = this.deltaToString(valor[n]);
        }
      });
      return valor;
    }
  }

  deltaToString(v: any | any[]): string|null {
    if (typeof (v) === 'undefined' || v === null ) {
      return null;
    } else {
      return JSON.stringify(v);
    }
  }
}

export function deltaToStr(valor: any | any[]) {
  if(Array.isArray(valor)) {
    valor.map(deltaToStr);
  } else {
    Object.keys(valor).forEach(n => {
      if (n.indexOf('delta') !== -1) {
        if (valor[n] instanceof Object) {
          valor[n] = JSON.parse(valor[n]);
        } else {
          valor[n] = null;
        }
      }
    });
    return valor;
  }
}

export function strToDelta(valor: any | any[]) {
  console.log('entrada',valor);
  if(!Array.isArray(valor)) {
    Object.keys(valor).forEach(n => {
      if (n.indexOf('delta') !== -1) {
        if (valor[n] instanceof Object) {
          valor[n] = JSON.stringify(valor[n]);
        } else {
          valor[n] = null;
        }
      } else {
        if (valor[n] instanceof Object) {
          Object.keys(valor[n]).forEach(m => {
            valor[n][m] = strToDelta(valor[n][m]);
          });
        }
      }
    });
  } else {
    valor.map(strToDelta);
  }
  console.log('saida',valor);
  return valor;
}
