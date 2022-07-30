import { Injectable } from '@angular/core';
// @ts-ignore
import {Mtitulos, TituloI, Titulos, TitulosI} from "../_models/titulo-i";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})

export class Titulos2Service {
  resp: TitulosI[] = [] ;
  titulos = new Titulos();
  campos: string[] = [];
  todosTitulos = {
    t: [],
    tt: null,
    ttt: null
  }

  mtitulos: Mtitulos[] = [];
  titulos2: TituloI[] = [];

  constructor(private httpClient: HttpClient) { }

  loadTitulos() {
    return this.httpClient.get<any>("assets/titulos.json");
  }

  carregaTitulos(cps: string[]) {
    this.loadTitulos().pipe(take(1)).subscribe((dados) => {
      const t: TitulosI[] = Object.values(dados);
      const tt = new Titulos(t);
      this.titulos = new Titulos(tt.getLimpa(cps));
    });
  }

  buscaTitulos(cps: string[] = []): TitulosI[] {
    if (this.titulos.length() === 0) {
      if (cps.length > 0) {
        this.carregaTitulos(cps);
      }
      return this.titulos.titulos;
    } else {
      return this.titulos.titulos;
    }
  }

  buscaTitulos2(modulo: string, cps: string[] = []) {
    if (this.titulos2.length === 0) {
      this.loadTitulos().pipe(take(1)).subscribe((dados) => {
        this.titulos2 = dados;
        this.mtitulos[modulo] = cps.map(c => {
          return this.titulos2[c];
        });
      })
    } else {
      if (this.mtitulos[modulo] === undefined) {
        this.mtitulos[modulo] = cps.map(c => {
          return [c] = this.titulos2[c];
        });
      }
    }
  }

  buscaTitulosDetalhe(cps: string[]): TituloI[] {
    let rs: TituloI[] = [];
    cps.forEach(c => {
      if (this.titulos[c] !== undefined) {
        rs[c] = this.titulos[c].mtitulo;
      }
    })
    return rs;
  }

  buscaTitulosRelatorio(cps: string[]): string[] {
    let rs: string[] = [];
    cps.forEach(c => {
      if (this.titulos[c] !== undefined) {
        rs[c] = this.titulos[c].mtitulo;
      }
    })
    return rs;
  }

  getTodos() {
    this.loadTitulos().pipe(take(1)).subscribe((dados) => {
      this.todosTitulos.t = Object.values(dados);
      this.todosTitulos.tt = new Titulos(this.todosTitulos.t);
      this.todosTitulos.ttt = dados;
    });
  }

  getTudo(): any {
    return this.todosTitulos;
  }

  OnDestroy() {
    this.campos = [];
    this.titulos.clear();
  }

}
