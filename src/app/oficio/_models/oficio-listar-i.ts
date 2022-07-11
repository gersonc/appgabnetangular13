import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {TotalI} from "../../shared-datatables/models/total-i";

export interface OficioListarI {
  oficio_id?: number;
  oficio_processo_numero?: string;
  oficio_processo_id?: number;
  oficio_codigo?: string;
  oficio_numero?: string;
  oficio_solicitacao_descricao?: string;
  oficio_solicitacao_descricao_delta?: string;
  oficio_solicitacao_descricao_texto?: string;
  oficio_prioridade_id?: number;
  oficio_convenio?: string;
  oficio_prioridade_nome?: string;
  oficio_municipio_id?: number;
  oficio_municipio_nome?: string;
  oficio_tipo_solicitante_id?: number;
  oficio_tipo_solicitante_nome?: string;
  oficio_cadastro_id?: number;
  oficio_cadastro_nome?: string;
  oficio_assunto_id?: number;
  oficio_assunto_nome?: string;
  oficio_data_emissao?: string;
  oficio_data_recebimento2?: string;
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_delta?: string;
  oficio_descricao_acao_texto?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_id?: number;
  oficio_tipo_recebimento_nome?: string;
  oficio_area_interesse_id?: number;
  oficio_area_interesse_nome?: string;
  oficio_status_id?: number;
  oficio_status_nome?: string;
  oficio_valor_solicitado?: number;
  oficio_valor_recebido?: number;
  oficio_data_pagamento?: string;
  oficio_data_empenho?: string;
  oficio_solicitacao_id?: number;
  solicitacao_local_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
  oficio_arquivos?: ArquivoListagem[];
}

export interface OficioPaginacaoI {
  oficios: OficioListarI[];
  total: TotalI;
}

export const camposOficioListar: string[] = [
  'oficio_id',
  'oficio_processo_numero',
  'oficio_processo_id',
  'oficio_codigo',
  'oficio_numero',
  'oficio_solicitacao_descricao',
  'oficio_solicitacao_descricao_delta',
  'oficio_solicitacao_descricao_texto',
  'oficio_prioridade_id',
  'oficio_convenio',
  'oficio_prioridade_nome',
  'oficio_municipio_id',
  'oficio_municipio_nome',
  'oficio_tipo_solicitante_id',
  'oficio_tipo_solicitante_nome',
  'oficio_cadastro_id',
  'oficio_cadastro_nome',
  'oficio_assunto_id',
  'oficio_assunto_nome',
  'oficio_data_emissao',
  'oficio_data_recebimento',
  'oficio_orgao_solicitado_id',
  'oficio_orgao_solicitado_nome',
  'oficio_descricao_acao',
  'oficio_descricao_acao_delta',
  'oficio_descricao_acao_texto',
  'oficio_data_protocolo',
  'oficio_protocolo_numero',
  'oficio_orgao_protocolante_id',
  'oficio_orgao_protocolante_nome',
  'oficio_protocolante_funcionario',
  'oficio_prazo',
  'oficio_tipo_andamento_id',
  'oficio_tipo_andamento_nome',
  'oficio_tipo_recebimento_id',
  'oficio_tipo_recebimento_nome',
  'oficio_area_interesse_id',
  'oficio_area_interesse_nome',
  'oficio_status_nome',
  'oficio_valor_solicitado',
  'oficio_valor_recebido',
  'oficio_data_pagamento',
  'oficio_data_empenho',
  'oficio_solicitacao_id',
  'solicitacao_local_nome',
  'solicitacao_reponsavel_analize_nome'
];

export const OficoCamposTexto = [
  'oficio_solicitacao_descricao',
  'oficio_descricao_acao'
];
