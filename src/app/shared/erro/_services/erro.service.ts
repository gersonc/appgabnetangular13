import { Injectable } from '@angular/core';
import {ErrI} from "../../../_helpers/erro-i";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErroService {
  erroSubject = new BehaviorSubject({});
  erro$ = this.erroSubject.asObservable();

  display = false;
  err: any[] = [];

  constructor() { }

  add(erro: any) {
    this.err.push(erro);
  }

  clear() {
    this.err = [];
  }

  set erro(erro: any) {

    if (typeof erro === 'object') {
      this.err = [];
      const k = Object.keys(erro);
      const n = k.length - 1;
      k.forEach((campo, i) => {
        if (erro[campo] !== undefined && erro[campo] !== null) {
          console.log('ErroService2', campo, erro[campo]);
          const e = {
            chave: campo,
            valor: (erro[campo] !== undefined && erro[campo] !== null) ? erro[campo] : 'NULO'
          }
          this.err.push(e);
        }
        if (i === n) {
          this.display = true;
        }

      });
    } else {
      this.add(erro);
    }
    this.erroSubject.next(this.display);
  }

}
