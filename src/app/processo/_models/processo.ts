import { SelectItem } from 'primeng/api';

export interface ProcessoTotalInterface {
  num: number;
}

export interface ProcessoSQLInterface {
  sql: string;
}

export interface ProcessoOficioInterface {
  oficio_id?: number;
  oficio_processo_id?: number;
  oficio_codigo?: number;
  oficio_numero?: string;
  oficio_prioridade_nome?: string;
  oficio_convenio?: string;
  oficio_data_emissao?: string;
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_descricao_acao?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_nome?: string;
  oficio_status?: string;
  oficio_valor_solicitado?: string;
  oficio_valor_recebido?: string;
  oficio_data_pagamento?: string;
  oficio_data_empenho?: string;
}

export interface ProcessoHistoricoInterface {
  historico_id?: number;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  historico_processo_id?: number;
}

export interface ProcessoListagemInterface {
  processo_id?: number;
  processo_numero?: string;
  processo_status_id?: number;
  processo_status_nome?: string;
  processo_cadastro_id?: number;
  processo_solicitacao_id?: number;
  processo_carta?: string;
  cadastro_tipo_nome?: string;
  cadastro_nome?: string;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_municipio_nome?: string;
  cadastro_regiao_nome?: string;
  cadastro_cep?: string;
  cadastro_estado_nome?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_rede_social?: string;
  cadastro_outras_midias?: string;
  cadastro_data_nascimento?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_situacao?: string;
  solicitacao_status_id?: number;
  solicitacao_status_nome?: string;
  solicitacao_aceita_sn?: string;
  oficio_id?: number;
  oficio_processo_id?: number;
  oficio_codigo?: string;
  oficio_numero?: string;
  oficio_prioridade_nome?: string;
  oficio_convenio?: string;
  oficio_data_emissao?: string;
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_descricao_acao?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_nome?: string;
  oficio_status?: string;
  oficio_valor_solicitado?: string;
  oficio_valor_recebido?: string;
  oficio_data_pagamento?: string;
  oficio_data_empenho?: string;
  historico_id?: number;
  historico_data?: string;
  historico_andamento?: string;
  historico_processo_id?: number;

  cadastro_tipo_id?: number;
  cadastro_municipio_id?: number;
  cadastro_regiao_id?: number;
  solicitacao_assunto_id?: number;
  solicitacao_local_id?: number;
  solicitacao_area_interesse_id?: number;
  oficio_tipo_recebimento_nome?: string;
  oficio_status_nome?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  processo_carta_delta?: string;
  processo_carta_texto?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  cadastro_grupo_id?: number;
  cadastro_grupo_nome?: string;
  solicitacao_situacao2?: string;
  solicitacao_data2?: string;
  oficio_data_pagamento2?: string;
  oficio_data_empenho2?: string;
  oficio_prazo2?: string;
  oficio_data_protocolo2?: string;
  oficio_data_emissao2?: string;
  oficio_data_recebimento2?: string;
  historico_data2?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_reponsavel_analize_nome?: string;

  oficio?: ProcessoOficioInterface | ProcessoOficioInterface[];
  historico?: ProcessoHistoricoInterface | ProcessoHistoricoInterface[];
}

export interface ProcessoPaginacaoInterface {
  processo: ProcessoListagemInterface[];
  total: ProcessoTotalInterface;
  sql: ProcessoOficioInterface;
}

export interface ProcessoDetalheInterface {
  processo: ProcessoSolicitacaoInterface;
  processo_titulo?: any[];
  cadastro?: ProcessoCadastroInterface;
  cadastro_titulo?: any[];
  oficios?: ProcessoOficioInterface[];
  oficio_titulo?: any[];
  oficios_num?: any[];
  historicos?: ProcessoHistoricoInterface[];
  historico_titulo?: any[];
  historicos_num?: any[];
  arquivos?: any[];
  permissao?: any[];
}

export interface ProcessoSolicitacaoInterface {
  processo_id?: number;
  processo_numero?: string;
  processo_status_nome?: string;
  processo_carta?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_local_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_aceita_recusada?: string;
}

export interface ProcessoCadastroInterface {
  cadastro_tipo_nome?: string;
  cadastro_nome?: string;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_municipio_nome?: string;
  cadastro_regiao_nome?: string;
  cadastro_cep?: string;
  cadastro_estado_nome?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_rede_social?: string;
  cadastro_outras_midias?: string;
  cadastro_data_nascimento?: string;
}

export interface ProcessoSolicitacaoCadastroInterface {
  processo_id?: number;
  processo_numero?: string;
  processo_status?: string;
  processo_cadastro_id?: number;
  processo_solicitacao_id?: number;
  processo_carta?: string;
  cadastro_tipo_nome?: string;
  cadastro_nome?: string;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_municipio_nome?: string;
  cadastro_regiao_nome?: string;
  cadastro_cep?: string;
  cadastro_estado_nome?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_rede_social?: string;
  cadastro_outras_midias?: string;
  cadastro_data_nascimento?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_situacao?: string;
  solicitacao_status_id?: number;
  solicitacao_status_nome?: string;
  solicitacao_aceita_sn?: string;
}
