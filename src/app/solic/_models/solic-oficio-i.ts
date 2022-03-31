export interface SolicOficioI {
  oficio_id?: number;
  oficio_numero?: string;
  oficio_codigo?: string;
  oficio_convenio?: string;
  oficio_prioridade_nome?: string;
  oficio_data_emissao?: string;
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_nome?: string;
  oficio_status?: string;
  oficio_valor_solicitado?: string;
  oficio_valor_recebido?: string;
  oficio_data_pagamento?: string;
  oficio_data_empenho?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_delta?: string;
  oficio_descricao_acao_texto?: string;
}

export const oficio_titulo = [
  'ID',
  'NÚMERO',
  'CONVÊNIO',
  'PRIORIDADE',
  'DATA EMISSÃO',
  'DATA RECEBIMENTO',
  'ORGÃO SOLICITADO',
  'DT PROTOCOLO',
  'NUM. PROTOCOLO',
  'ORG. PROTOCOLANTE',
  'FUNCIONÁRIO ORG.',
  'PRASO',
  'TP. ANDAMENTO',
  'TP. RECEBIMENTO',
  'POSIÇÃO',
  'VL. SOLICITADO',
  'VL. RECEBIDO',
  'DT. PGTO',
  'DT. EMPENHO',
  'DESCRIÇÃO'
];
