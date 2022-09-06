import { Injectable } from '@angular/core';
import {SelectItem} from "primeng/api";
import {TarefaI, TarefaUsuarioSituacaoI} from "../_models/tarefa-i";

@Injectable({
  providedIn: 'root'
})
export class TarefaSituacaoService {

  ddTarefa_situacao_id: SelectItem[] = [];
  tarefa?: TarefaI | null = null;
  tus: TarefaUsuarioSituacaoI | null = null;
  exibir: boolean = false;
  index: number = -1;
  usuario_id = 0;

  constructor() { }

  reset() {
    this.tarefa = null;
    this.tus = null;
    this.index = -1;
    this.usuario_id = 0;
  }

  resetAll() {
    this.exibir = false;
    this.reset();
    this.ddTarefa_situacao_id = [];
  }


}
