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
  err: ErrI[] | null = null;

  constructor() { }


  set erro(erro: any) {

    if (typeof erro === 'object') {
      const k = Object.keys(erro);
      const n = k.length - 1;
      k.forEach((campo, i) => {
        if (erro[campo] !== undefined && erro[campo] !== null) {
          console.log('ErroService2', campo, erro[campo]);
          this.err.push({chave: campo, valor: erro[campo].toString()});
        }
        if (i === n) {
          this.display = true;
        }

      });
    }
    this.erroSubject.next(this.display);
  }

}
