import { Injectable } from '@angular/core';
import {CelulaI} from "../_models/celula-i";

@Injectable({
  providedIn: 'root'
})
export class CelulaService {

  celula: CelulaI | null = null;
  camposTextos: string[] = []
  showCampoTexto = false;
  modulo: string | null = null;

  constructor() { }

  mostraTexto(celula: CelulaI) {
    this.celula = celula;
    this.showCampoTexto = true;
  }

  fecharTexto() {
    this.celula = null;
    this.showCampoTexto = false;
  }




}
