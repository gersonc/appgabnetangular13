import { Injectable } from '@angular/core';

import { OficioFormulario, OficioFormularioInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class OficioFormService {

  oficio: OficioFormularioInterface;


  constructor( ) { }

  criaOficio() {
    this.oficio = new OficioFormulario();
  }

  resetOficio() {
    delete this.oficio;
    this.oficio = new OficioFormulario();
  }
}
