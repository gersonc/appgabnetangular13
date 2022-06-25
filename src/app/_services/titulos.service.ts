import { Injectable } from '@angular/core';
import {TituloI, Titulos, TitulosI} from "../_models/titulo-i";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})

export class TitulosService {
  resp: TitulosI[] = [] ;
  titulos = new Titulos();
  campos: string[] = [];
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

  buscaTitulosDetalhe(cps: string[]): TituloI[] {
    let rs: TituloI[] = [];
    cps.forEach(c => {
      if (this.titulos[c] !== undefined) {
        rs[c] = this.titulos[c].mtitulo;
      }
    })
    return rs;
  }

  OnDestroy() {
    this.campos = [];
    this.titulos.clear();
  }

}
