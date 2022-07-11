import {SelectItem} from "primeng/api";
import { DdOficioProcessoIdI } from "./dd-oficio-processo-id-i";

export interface OficioI {
  oficio_id?: number;
  oficio_processo_numero?: string;
  oficio_processo_id?: number;
  oficio_codigo?: string;
  oficio_numero?: string;
  oficio_solicitacao_id?: number;
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
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_id?: number;
  oficio_orgao_solicitado_nome?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_delta?: string;
  oficio_descricao_acao_texto?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_id?: number;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_id?: number;
  oficio_tipo_recebimento_nome?: string;
  oficio_area_interesse_id?: number;
  oficio_area_interesse_nome?: string;
}



export interface OficioFormI {
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
  oficio_prioridade_nome?: string;
  oficio_processo_id?: number;
  oficio_protocolante_funcionario?: string;
  oficio_protocolo_numero?: string;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_id?: number;
  oficio_tipo_recebimento_nome?: string;
  oficio_valor_recebido?: string;
  oficio_valor_solicitado?: string;
  historico_andamento?: string;
  historico_andamento_texto?: string;
  historico_andamento_delta?: string;
}



