import { Injectable } from '@angular/core';
import {ContaFormI, ContaI} from "../_models/conta-i";

@Injectable({
  providedIn: 'root'
})
export class ContaFormService {
  contaListar: ContaI | null = null;
  conta: ContaFormI | null = null;
  contaOld: ContaFormI | null = null;
  url = '';
  public acao?: string | null = null;
  public btnEnviar = true;
  showForm = false;
  idx = 0;
  menu = false;

  constructor() { }

  criaConta() {
    this.conta = {};
    this.contaOld = {};
  }

  resetConta() {
    delete this.conta;
    delete this.contaListar;
    this.conta = null;
    this.contaListar = null;
  }

  parceContaForm(t: ContaI): ContaFormI {
    this.contaListar = t;
    this.conta = {};
    let r: ContaFormI = {};
    r.conta_id = +t.conta_id;
    r.conta_uuid = t.conta_uuid;
    r.conta_tipo = +t.conta_tipo_id;
    r.conta_paga = +t.conta_paga_id;
    r.conta_vencimento = null;
    r.conta_vencimento2 = t.conta_vencimento3;
    r.conta_pagamento = null;
    r.conta_pagamento2 = t.conta_pagamento3;
    r.conta_cedente = t.conta_cedente;
    r.conta_valor = +t.conta_valor2;
    r.conta_local_id = +t.conta_local_id;
    r.conta_observacao = t.conta_observacao;
    r.conta_observacao_delta = t.conta_observacao_delta;
    r.conta_observacao_texto = t.conta_observacao_texto;
    if (t.conta_parcelas === undefined || t.conta_parcelas === null || +t.conta_parcelas < 2 || t.conta_rptdia === undefined || t.conta_rptdia === null  || +t.conta_rptdia === 0) {
      r.conta_rptdia = 0;
      r.conta_parcelas = 1;
    } else {
      r.conta_rptdia = t.conta_rptdia;
      r.conta_parcelas = t.conta_parcelas;
    }
    r.conta_agenda = (t.conta_agenda === undefined || t.conta_agenda === null) ? 0 : t.conta_agenda;
    r.conta_calendario_id = t.conta_calendario_id
    this.conta = r;
    console.log('parceContaForm', r, this.conta);
    return r
  }

  criaFormIncluir() {
    this.conta = {};
    this.conta.conta_id = null;
    this.conta.conta_uuid = null;
    this.conta.conta_cedente = null;
    this.conta.conta_valor = null;
    this.conta.conta_vencimento = null;
    this.conta.conta_vencimento2 = null;
    this.conta.conta_observacao = null;
    this.conta.conta_observacao_delta = null;
    this.conta.conta_observacao_texto = null;
    this.conta.conta_local_id = null;
    this.conta.conta_tipo = 0;
    this.conta.conta_paga = 0;
    this.conta.conta_paga2 = 0;
    this.conta.conta_pagamento = null;
    this.conta.conta_pagamento2 = null;
    this.conta.conta_rptdia = 0;
    this.conta.conta_parcelas = 2;
    this.conta.conta_agenda = 0;
    this.conta.conta_calendario_id = 0;
  }
}
