import {Injectable} from '@angular/core';
import {EmendaForm, EmendaFormI} from "../_models/emenda-form-i";
import {EmendaListarI} from "../_models/emenda-listar-i";

@Injectable({
  providedIn: 'root'
})
export class EmendaFormService {
  emendaListar: EmendaListarI | null = null;
  emenda: EmendaFormI | null = null;
  solicitacao_id = 0;
  processo_id = 0;
  url = '';
  // emendaProcessoId?: DdEmendaProcessoIdI | null = null;
  public acao?: string | null = null;
  public btnEnviar = true;
  public analiseCpoEmendaNome: any = {ativo: false, tipo: null, cpoTitulo: null};


  constructor() {
  }

  criaEmenda() {
    this.emenda = new EmendaForm();
  }

  resetEmenda() {
    delete this.emenda;
    this.emenda = new EmendaForm();
  }

  /*parceDdEmendaProcessoId(sol: any) {
    this.emendaProcessoId = {
      processo_id: this.processo_id,
      solicitacao_id: this.solicitacao_id,
      processo_numero: (sol.processo_numero !== undefined) ? sol.processo_numero : null,
      solicitacao_cadastro_nome: sol.solicitacao_cadastro_nome,
      solicitacao_data: sol.solicitacao_data,
      solicitacao_assunto_nome: sol.solicitacao_assunto_nome,
      solicitacao_orgao: (sol.solicitacao_orgao !== undefined) ? sol.solicitacao_orgao : null,
      solicitacao_area_interesse_nome: sol.solicitacao_area_interesse_nome,
      solicitacao_descricao: (sol.solicitacao_descricao !== undefined) ? sol.solicitacao_descricao : null,
      solicitacao_descricao_texto: (sol.solicitacao_descricao_texto !== undefined) ? sol.solicitacao_descricao_texto : null,
      solicitacao_descricao_delta: (sol.solicitacao_descricao_delta !== undefined) ? sol.solicitacao_descricao_delta : null,
      cadastro_bairro: (sol.cadastro_bairro !== undefined) ? sol.cadastro_bairro : null,
      cadastro_municipio_nome: sol.solicitacao_cadastro_nome,
      emenda_codigo: (sol.emenda_codigo !== undefined) ? sol.emenda_codigo : null
    }
  }*/

  parceEmendaFormulario(o: EmendaListarI): EmendaFormI {
    this.emenda = new EmendaForm();
    this.emendaListar = o;
    this.resetEmenda();
    const r = new EmendaForm();
    r.emenda_id = o.emenda_id;
    r.emenda_cadastro_tipo_id = o.emenda_cadastro_tipo_id;
    r.emenda_cadastro_id = o.emenda_cadastro_id;
    r.emenda_autor_nome = o.emenda_autor_nome;
    r.emenda_situacao = o.emenda_situacao;
    r.emenda_numero = o.emenda_numero;
    r.emenda_funcional_programatica = o.emenda_funcional_programatica;
    r.emenda_orgao_solicitado_nome = o.emenda_orgao_solicitado_nome;
    r.emenda_numero_protocolo = o.emenda_numero_protocolo;
    r.emenda_assunto_id = o.emenda_assunto_id;
    r.emenda_data_solicitacao = o.emenda_data_solicitacao;
    r.emenda_processo = o.emenda_processo;
    r.emenda_tipo_emenda_id = o.emenda_tipo_emenda_id;
    r.emenda_ogu_id = o.emenda_ogu_id;
    r.emenda_valor_solicitadado = o.emenda_valor_solicitadado;
    r.emenda_valor_empenhado = o.emenda_valor_empenhado;
    r.emenda_data_empenho = o.emenda_data_empenho;
    r.emenda_numero_empenho = o.emenda_numero_empenho;
    r.emenda_crnr = o.emenda_crnr;
    r.emenda_gmdna = o.emenda_gmdna;
    r.emenda_observacao_pagamento = o.emenda_observacao_pagamento;
    r.emenda_data_pagamento = o.emenda_data_pagamento;
    r.emenda_valor_pago = o.emenda_valor_pago;
    r.emenda_numero_ordem_bancaria = o.emenda_numero_ordem_bancaria;
    r.emenda_justificativa = o.emenda_justificativa;
    r.emenda_local_id = o.emenda_local_id;
    r.emenda_uggestao = o.emenda_uggestao;
    r.emenda_siconv = o.emenda_siconv;
    r.emenda_regiao = o.emenda_regiao;
    r.emenda_contrato = o.emenda_contrato;
    r.emenda_porcentagem = o.emenda_porcentagem;
    r.cadastro_cpfcnpj = o.cadastro_cpfcnpj;
    r.cadastro_municipio_nome = o.cadastro_municipio_nome;
    r.historico_andamento = null;
    r.historico_andamento_delta = null;
    r.historico_andamento_texto = null;
    this.emenda = r;
    return r;
  }
}
