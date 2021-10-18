export interface EmendaBuscaCampoInterface {
  field: string;
  header: string;
}

export interface EmendaBuscaInterface {
  emenda_id?: number;
  emenda_id2?: number;
  emenda_situacao?: string;
  emenda_tipo_emenda_id?: number;
  emenda_cadastro_tipo_id?: number;
  emenda_autor_nome?: string;
  emenda_cadastro_id?: number;
  emenda_autor_id?: number;
  emenda_cadastro_id2?: number;
  emenda_ogu_id?: number;
  emenda_orgao_solicitado_nome?: string;
  emenda_numero?: string;
  emenda_assunto_id?: number;
  emenda_crnr?: string;
  emenda_local_id?: number;
  emenda_gmdna?: string;
  emenda_numero_protocolo?: string;
  emenda_uggestao?: string;
  emenda_funcional_programatica?: string;
  emenda_regiao?: string;
  emenda_numero_empenho?: string;
  emenda_data_solicitacao?: string;
  emenda_processo?: string;
  emenda_contrato?: string;
  emenda_data_empenho?: string;
  emenda_numero_ordem_bancaria?: string;
  emenda_data_pagamento?: string;
  cadastro_municipio_id?: number;
  lst?: string;
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean;
  campos?: EmendaBuscaCampoInterface[];
  ids?: EmendaBuscaCampoInterface[];
}

export class EmendaBusca implements EmendaBuscaInterface {
  emenda_id = null;
  emenda_id2 = null;
  emenda_situacao = null;
  emenda_tipo_emenda_id = null;
  emenda_cadastro_tipo_id = null;
  emenda_autor_nome = null;
  emenda_cadastro_id = null;
  emenda_autor_id = null;
  emenda_cadastro_id2 = null;
  emenda_ogu_id = null;
  emenda_orgao_solicitado_nome = null;
  emenda_numero = null;
  emenda_assunto_id = null;
  emenda_crnr = null;
  emenda_local_id = null;
  emenda_gmdna = null;
  emenda_numero_protocolo = null;
  emenda_uggestao = null;
  emenda_funcional_programatica = null;
  emenda_regiao = null;
  emenda_numero_empenho = null;
  emenda_data_solicitacao = null;
  emenda_processo = null;
  emenda_contrato = null;
  emenda_data_empenho = null;
  emenda_numero_ordem_bancaria = null;
  emenda_data_pagamento = null;
  cadastro_municipio_id = null;
  lst = '';
  numlinhas = '0';
  inicio = '0';
  sortorder = '';
  sortcampo = 'emenda_situacao';
  todos = false;
  campos = [];
  ids = [];
}
