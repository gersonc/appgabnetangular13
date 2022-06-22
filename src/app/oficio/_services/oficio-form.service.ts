import { Injectable } from '@angular/core';

import { OficioFormulario, OficioFormularioInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class OficioFormService {

  oficio: OficioFormularioInterface;
  solicitacao_id = 0;
  processo_id = 0;
  url = '';


  constructor( ) { }

  criaOficio() {
    this.oficio = new OficioFormulario();
  }

  resetOficio() {
    delete this.oficio;
    this.oficio = new OficioFormulario();
  }
}
