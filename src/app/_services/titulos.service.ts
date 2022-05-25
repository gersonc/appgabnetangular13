import { Injectable } from '@angular/core';
import {TitulosI} from "../_models/titulo-i";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class TitulosService {

  resp: TitulosI[] = [] ;
  titulos: TitulosI[] = [];
  constructor(private httpClient: HttpClient) { }

  loadTitulos() {
    this.httpClient.get<TitulosI[]>("assets/titulos.json").pipe(take(1)).subscribe(dados => this.titulos = dados);
  }

  titulosSN(): boolean {
    if (this.titulos.length === 0) {
      this.loadTitulos();
      return false;
    } else {
      return true;
    }
  }

  buscaTitulos(cps: string[]): TitulosI[] {
    let rs: TitulosI[] = [];
    cps.forEach(c => {
      if (this.titulos[c] !== undefined) {
        rs.push(this.titulos[c]);
      } else {
        rs.push({field: c,mtitulo:'não definido',titulo:'não definido'});
      }

    })
    return rs;
  }


}
