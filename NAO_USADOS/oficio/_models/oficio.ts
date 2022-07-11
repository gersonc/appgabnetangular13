import { SelectItem } from 'primeng/api';

export interface OficioTotalInterface {
  num: number;
}

export interface OficioSQLInterface {
  sql: string;
}

export interface OficioPaginacaoInterface {
  oficio: OficioListagemInterface[];
  total: OficioTotalInterface;
  sql: OficioSQLInterface[];
}

/*export interface OficioListagemInterface {
  oficio_area_interesse_id?: number;
  oficio_area_interesse_nome?: string;
  oficio_assunto_id?: number;
  oficio_assunto_nome?: string;
  oficio_cadastro_id?: number;
  oficio_cadastro_nome?: string;
  oficio_codigo?: string;
  oficio_convenio?: string;
  oficio_data_emissao?: string;
  oficio_data_empenho?: string;
  oficio_data_pagamento?: string;
  oficio_data_protocolo?: string;
  oficio_data_recebimento?: string;
  oficio_descricao_acao?: string;
  oficio_id?: number;
  oficio_municipio_id?: number;
  oficio_municipio_nome?: string;
  oficio_numero?: string;
  oficio_orgao_protocolante_id?: number;
  oficio_orgao_protocolante_nome?: string;
  oficio_orgao_solicitado_id?: number;
  oficio_orgao_solicitado_nome?: string;
  oficio_prazo?: string;
  oficio_prioridade_id?: number;
  oficio_prioridade_nome?: string;
  oficio_processo_id?: number;
  oficio_processo_numero?: string;
  oficio_protocolante_funcionario?: string;
  oficio_protocolo_numero?: string;
  oficio_solicitacao_descricao?: string;
  oficio_solicitacao_id?: number;
  oficio_status?: string;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_id?: number;
  oficio_tipo_recebimento_nome?: string;
  oficio_tipo_solicitante_id?: number;
  oficio_tipo_solicitante_nome?: string;
  oficio_valor_recebido?: string;
  oficio_valor_solicitado?: string;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_local_nome?: string;
}*/

export interface OficioListagemInterface {
  oficio_id?: number;
  oficio_processo_id?: number;
  oficio_prioridade_id?: number;
  oficio_municipio_id?: number;
  oficio_tipo_solicitante_id?: number;
  oficio_cadastro_id?: number;
  oficio_assunto_id?: number;
  oficio_orgao_solicitado_id?: number;
  oficio_orgao_protocolante_id?: number;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_recebimento_id?: number;
  oficio_area_interesse_id?: number;
  oficio_solicitacao_id?: number;
  oficio_status2?: number;
  oficio_valor_solicitado?: number;
  oficio_valor_recebido?: number;
  oficio_data_emissao2?: string;
  oficio_data_recebimento2?: string;
  oficio_data_protocolo2?: string;
  oficio_prazo2?: string;
  oficio_data_pagamento2?: string;
  oficio_data_empenho2?: string;
  oficio_solicitacao_descricao?: string;
  oficio_solicitacao_descricao_delta?: string;
  oficio_solicitacao_descricao_texo?: string;
  oficio_descricao_acao?: string;
  oficio_processo_numero?: string;
  oficio_codigo?: string;
  oficio_numero?: string;
  oficio_convenio?: string;
  oficio_prioridade_nome?: string;
  oficio_municipio_nome?: string;
  oficio_tipo_solicitante_nome?: string;
  oficio_cadastro_nome?: string;
  oficio_assunto_nome?: string;
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
  oficio_area_interesse_nome?: string;
  oficio_status?: string;
  oficio_data_pagamento?: string;
  oficio_data_empenho?: string;
  solicitacao_local_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
}

export interface OficioInterface {
  oficio_area_interesse_id?: number;
  oficio_area_interesse_nome?: string;
  oficio_assunto_id?: number;
  oficio_assunto_nome?: string;
  oficio_cadastro_id?: number;
  oficio_cadastro_nome?: string;
  oficio_codigo?: string;
  oficio_convenio?: string;
  oficio_data_emissao?: string;
  oficio_data_empenho?: string;
  oficio_data_pagamento?: string;
  oficio_data_protocolo?: string;
  oficio_data_recebimento?: string;
  oficio_descricao_acao?: string;
  oficio_id?: number;
  oficio_municipio_id?: number;
  oficio_municipio_nome?: string;
  oficio_numero?: string;
  oficio_orgao_protocolante_id?: number;
  oficio_orgao_protocolante_nome?: string;
  oficio_orgao_solicitado_id?: number;
  oficio_orgao_solicitado_nome?: string;
  oficio_prazo?: string;
  oficio_prioridade_id?: number;
  oficio_prioridade_nome?: string;
  oficio_processo_id?: number;
  oficio_processo_numero?: string;
  oficio_protocolante_funcionario?: string;
  oficio_protocolo_numero?: string;
  oficio_solicitacao_descricao?: string;
  oficio_solicitacao_id?: number;
  oficio_status?: string;
  oficio_tipo_andamento_id?: number;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_id?: number;
  oficio_tipo_recebimento_nome?: string;
  oficio_tipo_solicitante_id?: number;
  oficio_tipo_solicitante_nome?: string;
  oficio_valor_recebido?: string;
  oficio_valor_solicitado?: string;
  solicitacao_local_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
}

export class Oficio implements OficioInterface {
  oficio_area_interesse_id = null;
  oficio_area_interesse_nome = null;
  oficio_assunto_id = null;
  oficio_assunto_nome = null;
  oficio_cadastro_id = null;
  oficio_cadastro_nome = null;
  oficio_codigo = null;
  oficio_convenio = null;
  oficio_data_emissao = null;
  oficio_data_empenho = null;
  oficio_data_pagamento = null;
  oficio_data_protocolo = null;
  oficio_data_recebimento = null;
  oficio_descricao_acao = null;
  oficio_id = null;
  oficio_municipio_id = null;
  oficio_municipio_nome = null;
  oficio_numero = null;
  oficio_orgao_protocolante_id = null;
  oficio_orgao_protocolante_nome = null;
  oficio_orgao_solicitado_id = null;
  oficio_orgao_solicitado_nome = null;
  oficio_prazo = null;
  oficio_prioridade_id = null;
  oficio_prioridade_nome = null;
  oficio_processo_id = null;
  oficio_processo_numero = null;
  oficio_protocolante_funcionario = null;
  oficio_protocolo_numero = null;
  oficio_solicitacao_descricao = null;
  oficio_solicitacao_id = null;
  oficio_status = null;
  oficio_tipo_andamento_id = null;
  oficio_tipo_andamento_nome = null;
  oficio_tipo_recebimento_id = null;
  oficio_tipo_recebimento_nome = null;
  oficio_tipo_solicitante_id = null;
  oficio_tipo_solicitante_nome = null;
  oficio_valor_recebido = null;
  oficio_valor_solicitado = null;
}

export interface OficioGetAlterarInterface {
  oficio: OficioInterface;
  ddOficio_prioridade_id: SelectItem[];
  ddOficio_andamento_id: SelectItem[];
  ddOficio_recebimento_id: SelectItem[];
}

export class OficioGetAlterar implements OficioGetAlterarInterface {
  oficio = null;
  ddOficio_prioridade_id = null;
  ddOficio_andamento_id = null;
  ddOficio_recebimento_id = null;
}

export interface OficioDetalheInterface {
  oficio: OficioListagemInterface;
  oficio_titulo: any[];
}
