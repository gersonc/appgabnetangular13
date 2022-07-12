

export interface OficioFormularioInterface {
  oficio_codigo?: string;
  oficio_convenio?: string;
  oficio_data_emissao?: string;
  oficio_data_empenho?: string;
  oficio_data_pagamento?: string;
  oficio_data_protocolo?: string;
  oficio_data_recebimento?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_texto?: string;
  oficio_descricao_acao_delta?: string;
  oficio_id?: number;
  oficio_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_prazo?: string;
  oficio_prioridade_id?: number;
  oficio_processo_id?: number;
  oficio_processo_numero?: string;
  oficio_protocolante_funcionario?: string;
  oficio_protocolo_numero?: string;
  oficio_solicitacao_id?: number;
  oficio_status_id?: number;
  oficio_status?: number;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_recebimento_id?: number;
  oficio_valor_recebido?: number;
  oficio_valor_solicitado?: number;
  historico_andamento?: string;
  historico_andamento_texto?: string;
  historico_andamento_delta?: string;
}

export class OficioFormulario implements OficioFormularioInterface {
  oficio_codigo?: string;
  oficio_convenio?: string;
  oficio_data_emissao?: string;
  oficio_data_empenho?: string;
  oficio_data_pagamento?: string;
  oficio_data_protocolo?: string;
  oficio_data_recebimento?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_texto?: string;
  oficio_descricao_acao_delta?: string;
  oficio_id?: number;
  oficio_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_prazo?: string;
  oficio_prioridade_id?: number;
  oficio_processo_id?: number;
  oficio_processo_numero?: string;
  oficio_protocolante_funcionario?: string;
  oficio_protocolo_numero?: string;
  oficio_solicitacao_id?: number;
  oficio_status_id?: number;
  oficio_status?: number;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_recebimento_id?: number;
  oficio_valor_recebido?: number;
  oficio_valor_solicitado?: number;
  historico_andamento?: string;
  historico_andamento_texto?: string;
  historico_andamento_delta?: string;
}
