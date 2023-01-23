import { Injectable } from '@angular/core';
import {TarefaFormI, TarefaI, TarefaUsuarioAlterar, TarefaUsuarioSituacaoI} from "../_models/tarefa-i";
import {SelectItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class TarefaFormService {
  tarefaListar: TarefaI | null = null;
  tarefa: TarefaFormI | null = null;
  tarefaOld: TarefaFormI | null = null;
  url = '';
  acao?: string | null = null;
  btnEnviar = true;
  origem: 'menu' | 'listagem' = 'menu';
  idx = 0;
  menu = false;

  ddTarefa_situacao_id: SelectItem[] = [];
  ddUsuario_id: SelectItem[] = [];
  ddUsuarioAlterar: TarefaUsuarioAlterar[] = [];

  constructor() { }

  criaTarefa() {
    this.tarefa = {};
    this.tarefaOld = {};
  }

  resetConta() {
    delete this.tarefa;
    delete this.tarefaListar;
    this.tarefa = null;
    this.tarefaListar = null;
  }

  resetTudo() {
    this.ddTarefa_situacao_id = [];
    this.ddUsuario_id = [];
    this.resetConta();
    this.tarefaListar = null;
    this.acao = null;
    this.btnEnviar = true;
    // this.showForm = false;
    this.idx = 0;
  }

  parceTarefaForm(t: TarefaI): TarefaFormI {
    this.montaDD();
    this.tarefa = {};
    const r: TarefaFormI = {};
    r.tarefa_id = +t.tarefa_id;
    r.tarefa_usuario_autor_id = t.tarefa_usuario_autor_id;
    r.tarefa_usuario2 = t.tarefa_usuario_situacao.map(u => {
      const a: TarefaUsuarioAlterar = {
        tus_id: u.tus_id,
        tus_tu_id: u.tus_tu_id,
        tus_usuario_id: u.tus_usuario_id,
        tu_usuario_nome: u.tu_usuario_nome,
        tus_situacao_id: u.tus_situacao_id,
        tus_situacao_nome: u.tus_situacao_nome
      }
      return a;
    });
    r.tarefa_usuario_incluir = [];
    r.tarefa_usuario_excluir = [];
    r.tarefa_data = t.tarefa_data;
    r.tarefa_data2 = t.tarefa_data2;
    r.tarefa_data3 = t.tarefa_data3;
    r.tarefa_titulo = t.tarefa_titulo;
    r.tarefa_tarefa = t.tarefa_tarefa;
    r.tarefa_tarefa_delta = t.tarefa_tarefa_delta;
    r.tarefa_tarefa_texto = t.tarefa_tarefa_texto;
    r.email = 0;
    r.agenda = 0;
    r.tipo_listagem = 0;
    r.alterar = false;
    this.tarefa = r;

    return r
  }

  criaFormIncluir() {
    this.montaDD();
    this.tarefa = {};
    this.tarefa.tarefa_id = null;
    this.tarefa.tarefa_usuario_autor_id = null;
    this.tarefa.tarefa_usuario_id = null;
    this.tarefa.tarefa_data = null;
    this.tarefa.tarefa_data2 = null;
    this.tarefa.tarefa_data3 = null;
    this.tarefa.tarefa_titulo = null;
    this.tarefa.tarefa_tarefa = null;
    this.tarefa.tarefa_tarefa_delta = null;
    this.tarefa.tarefa_tarefa_texto = null;
    this.tarefa.email = 0;
    this.tarefa.agenda = 0;
    this.tarefa.tipo_listagem = 0;
  }

  montaDDAlterar(): TarefaUsuarioAlterar[] {
    const sit: number = this.ddTarefa_situacao_id.findIndex(s => s.value === 1);
    const usertemp: SelectItem[] = this.ddUsuario_id.filter((obj) => {
      return this.tarefaListar.tarefa_usuario_situacao.findIndex(u => u.tus_usuario_id === obj.value) === -1;
    });
    this.ddUsuarioAlterar = usertemp.map(u => {
      const a: TarefaUsuarioAlterar = {
        tus_id: 0,
        tus_tu_id: 0,
        tus_usuario_id: u.value,
        tu_usuario_nome: u.label,
        tus_situacao_id: 1,
        tus_situacao_nome: this.ddTarefa_situacao_id[sit].label
      }
      return a;
    });
    return this.ddUsuarioAlterar;
  }

  montaDD() {
    if (this.ddTarefa_situacao_id.length === 0) {
      this.ddTarefa_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-tarefa_situacao'));
    }
    if (this.ddUsuario_id.length === 0) {
      this.ddUsuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
    }
  }
}
