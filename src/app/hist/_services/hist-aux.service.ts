import { Injectable } from '@angular/core';
import {HistFormI, HistI, HistListI} from "../_models/hist-i";

@Injectable({
  providedIn: 'root'
})
export class HistAuxService {
  hist: HistI;
  histListI: HistListI;
  histFormI: HistFormI;

  constructor() { }
}



/*


export interface HistI {
  historico_id?: number | null;
  historico_data?: string | null;
  historico_data2?: string | null;
  historico_andamento?: string | null;
  historico_andamento_delta?: any | null;
  historico_andamento_texto?: string | null;
  historico_solicitacao_id?: number | null;
  historico_processo_id?: number | null;
}

export interface HistFormI {
  idx?: number;
  acao?: string;
  modulo?: string;
  hist?: HistI;
}

export interface HistListI {
  registro_id?: number;
  modulo?: string;
  hist?: HistI[];
}

*/


