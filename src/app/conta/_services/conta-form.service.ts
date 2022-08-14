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
    r.conta_tipo = +t.conta_tipo_id;
    r.conta_paga = +t.conta_paga_id;
    r.conta_vencimento = null;
    r.conta_vencimento2 = t.conta_vencimento3;
    r.conta_pagamento = null;
    r.conta_pagamento2 = t.conta_pagamento3;
    r.conta_cedente = t.conta_cedente;
    r.conta_valor = +t.conta_valor2;
    r.conta_debito_automatico = +t.conta_debito_automatico_id;
    r.conta_local_id = +t.conta_local_id;
    r.conta_observacao = t.conta_observacao;
    r.conta_observacao_delta = t.conta_observacao_delta;
    r.conta_observacao_texto = t.conta_observacao_texto;
    r.conta_rptdia = t.conta_rptdia;
    r.conta_parcelas = t.conta_parcelas;
    r.conta_agenda = t.conta_agenda;
    this.conta = r;
    return r
  }

  criaFormIncluir() {
    this.conta = {};
    this.conta.conta_id = null;
    this.conta.conta_cedente = null;
    this.conta.conta_valor = null;
    this.conta.conta_vencimento = null;
    this.conta.conta_vencimento2 = null;
    this.conta.conta_observacao = null;
    this.conta.conta_observacao_delta = null;
    this.conta.conta_observacao_texto = null;
    this.conta.conta_debito_automatico = null;
    this.conta.conta_local_id = null;
    this.conta.conta_tipo = null;
    this.conta.conta_paga = null;
    this.conta.conta_pagamento = null;
    this.conta.conta_pagamento2 = null;
    this.conta.conta_rptdia = 0;
    this.conta.conta_parcelas = 0;
    this.conta.conta_agenda = 0;
  }
}
