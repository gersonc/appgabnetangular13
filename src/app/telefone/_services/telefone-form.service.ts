import { Injectable } from '@angular/core';
import {TelefoneFormI, TelefoneInterface} from "../_models/telefone";


@Injectable({
  providedIn: 'root'
})
export class TelefoneFormService {
  telefoneListar: TelefoneInterface | null = null;
  telefone: TelefoneFormI | null = null;
  telefoneOld: TelefoneFormI | null = null;
  url = '';
  public acao?: string | null = null;
  public btnEnviar = true;
  showForm = false;

  constructor() { }

  criaTelefone() {
    this.telefone = {};
    this.telefoneOld = {};
  }

  resetTelefone() {
    delete this.telefone;
    delete this.telefoneListar;
    this.telefone = null;
    this.telefoneListar = null;
  }

  parceTelefoneForm(t: TelefoneInterface): TelefoneFormI {
    this.telefoneListar = t;
    this.telefone = {};
    let r: TelefoneFormI = {};
    r.telefone_id = +t.telefone_id;
    r.telefone_tipo = +t.telefone_tipo;
    r.telefone_data = null;
    r.telefone_data2 = t.telefone_data3;
    r.telefone_de = t.telefone_de;
    r.telefone_para = t.telefone_para;
    r.telefone_ddd = t.telefone_ddd;
    r.telefone_telefone = t.telefone_telefone;
    r.telefone_assunto = t.telefone_assunto;
    r.telefone_local_id = +t.telefone_local_id;
    r.telefone_local_nome = t.telefone_local_nome;
    r.telefone_observacao = t.telefone_observacao;
    r.telefone_observacao_delta = t.telefone_observacao_delta;
    r.telefone_observacao_texto = t.telefone_observacao_texto;
    r.telefone_resolvido = +t.telefone_resolvido_id;
    r.telefone_usuario_nome = t.telefone_usuario_nome;
    this.telefone = r;
    return r
  }

  criaFormIncluir() {
    this.telefone = {};
    this.telefone.telefone_data2 = null;
    this.telefone.telefone_tipo = null;
    this.telefone.telefone_data = null;
    this.telefone.telefone_de = null;
    this.telefone.telefone_para = null;
    this.telefone.telefone_ddd = null;
    this.telefone.telefone_telefone = null;
    this.telefone.telefone_assunto = null;
    this.telefone.telefone_local_id = null;
    this.telefone.telefone_local_nome = null;
    this.telefone.telefone_observacao = null;
    this.telefone.telefone_observacao_delta = null;
    this.telefone.telefone_observacao_texto = null;
    this.telefone.telefone_resolvido = null;
    this.telefone.telefone_usuario_nome = null;
  }

}
