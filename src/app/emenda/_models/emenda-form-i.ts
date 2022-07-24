export interface EmendaFormI {
  emenda_id?: number | null;
  emenda_cadastro_tipo_id?: number | null;
  emenda_cadastro_id?: number | null;
  emenda_autor_nome?: string | null;
  emenda_situacao?: string | null;
  emenda_numero?: string | null;
  emenda_funcional_programatica?: string | null;
  emenda_orgao_solicitado_nome?: string | null;
  emenda_numero_protocolo?: string | null;
  emenda_assunto_id?: number | null;
  emenda_data_solicitacao?: string | null;
  emenda_processo?: string | null;
  emenda_tipo_emenda_id?: number | null;
  emenda_ogu_id?: number | null;
  emenda_valor_solicitadado?: string | null;
  emenda_valor_empenhado?: string | null;
  emenda_data_empenho?: string | null;
  emenda_numero_empenho?: string | null;
  emenda_crnr?: string | null;
  emenda_gmdna?: string | null;
  emenda_observacao_pagamento?: string | null;
  emenda_data_pagamento?: string | null;
  emenda_valor_pago?: string | null;
  emenda_numero_ordem_bancaria?: string | null;
  emenda_justificativa?: string | null;
  emenda_local_id?: number | null;
  emenda_uggestao?: string | null;
  emenda_siconv?: string | null;
  emenda_regiao?: string | null;
  emenda_contrato?: string | null;
  emenda_porcentagem?: string | null;
  cadastro_cpfcnpj?: string | null;
  cadastro_municipio_nome?: string | null;
  historico_andamento?: string | null;
  historico_andamento_delta?: string | null;
  historico_andamento_texto?: string | null;
}

export class EmendaForm implements EmendaFormI {
  emenda_id = null;
  emenda_cadastro_tipo_id = null;
  emenda_cadastro_id = null;
  emenda_autor_nome = null;
  emenda_situacao = null;
  emenda_numero = null;
  emenda_funcional_programatica = null;
  emenda_orgao_solicitado_nome = null;
  emenda_numero_protocolo = null;
  emenda_assunto_id = null;
  emenda_data_solicitacao = null;
  emenda_processo = null;
  emenda_tipo_emenda_id = null;
  emenda_ogu_id = null;
  emenda_valor_solicitadado = null;
  emenda_valor_empenhado = null;
  emenda_data_empenho = null;
  emenda_numero_empenho = null;
  emenda_crnr = null;
  emenda_gmdna = null;
  emenda_observacao_pagamento = null;
  emenda_data_pagamento = null;
  emenda_valor_pago = null;
  emenda_numero_ordem_bancaria = null;
  emenda_justificativa = null;
  emenda_local_id = null;
  emenda_uggestao = null;
  emenda_siconv = null;
  emenda_regiao = null;
  emenda_contrato = null;
  emenda_porcentagem = null;
  cadastro_cpfcnpj = null;
  cadastro_municipio_nome = null;
  historico_andamento = null;
  historico_andamento_delta = null;
  historico_andamento_texto = null;
}
