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

  getDetalhes(modulo: string, id: number, campo_id?: string) {
      this.ds.getDetalhe(modulo, id, campo_id);
  }
}
