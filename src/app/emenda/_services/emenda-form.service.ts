import { Injectable } from '@angular/core';
import {EmendaFormulario, EmendaFormularioInterface} from "../_models";

@Injectable({
  providedIn: 'root'
})
export class EmendaFormService {

  eF: EmendaFormulario;

  constructor() { }

  criaEmenda(): void {
    if (!this.eF) {
      this.eF = new EmendaFormulario();
    }
  }

  resetEmenda(): void {
    delete this.eF;
    this.eF = new EmendaFormulario();
  }

  limpaEnvio(): EmendaFormulario {
    return this.eF;
  }

  destriEmenda(): void {
    delete this.eF;
  }
}
