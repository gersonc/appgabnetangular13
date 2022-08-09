import { Injectable } from '@angular/core';
import {TelefoneFormI, TelefoneInterface} from "../_models";

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

  constructor() { }

  criaTelefone() {
    this.telefone = {};
    this.telefoneOld = {};
  }

  resetTelefone() {
    delete this.telefone;
    delete this.telefoneOld;
    this.telefone = {};
    this.telefoneOld = {};
  }

  parceTelefoneForm(t: TelefoneInterface): TelefoneFormI {
    this.telefone = {};
    let r: TelefoneFormI = {};
    r.telefone_id = +t.telefone_id;
    r.telefone_tipo = +t.telefone_tipo_id;
    r.telefone_data = t.telefone_data2;
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
    this.telefoneOld = r;
    return r
  }

}
