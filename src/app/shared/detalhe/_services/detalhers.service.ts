import { Injectable } from '@angular/core';
import {DetalheService} from "./detalhe.service";

@Injectable({
  providedIn: 'root'
})
export class DetalhersService {
  mostraDetalhe: boolean = false;
  id: number;
  campo_id: string;
  modulo: string;
  registro?: any = null;


  constructor(
    private ds: DetalheService
  ) { }

  getDetalhes(modulo: string, id: number) {
    this.modulo = modulo;
    this.id = id;
     //  this.ds.getDetalhe(modulo, id);
  }

  sair() {
    this.mostraDetalhe = false;
    delete this.id;
    delete this.registro;
    delete this.modulo;
    delete this.campo_id;
    this.ds.destroy();
  }

}
