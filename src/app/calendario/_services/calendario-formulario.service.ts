import { Injectable } from '@angular/core';
import {EventoInterface} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class CalendarioFormularioService {
  abreFecha = false;
  eventoRetorno: EventoInterface[] = [];
  formDados: any = null;

  constructor() { }

  limpaFormulario() {
    this.abreFecha = false;
    this.eventoRetorno = [];
    this.formDados = null;
  }
}
