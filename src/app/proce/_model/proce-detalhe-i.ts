
export interface ProceDetalheI {
  processo?: ProceSolicitacaoI;
  processo_titulo?: any[];
  cadastro?: ProceCadastroI;
  cadastro_titulo?: any[];
  oficios?: ProceOficioI[];
  oficio_titulo?: any[];
  oficios_num?: any[];
  historicos?: ProceHistoricoI[];
  historico_titulo?: any[];
  historicos_num?: any[];
  arquivos?: any[];
  permissao?: any[];
}



export interface ProceSolicitacaoI {
  processo_id?: number;
  processo_numero?: string;
  processo_status_nome?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_local_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_aceita_recusada?: string;
}

export interface ProceCadastroI {
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

export interface ProceOficioI {
  oficio_id?: number;
  oficio_processo_id?: number;
  oficio_codigo?: number | string;
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

export interface ProceHistoricoI {
  historico_id?: number;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  historico_processo_id?: number;
}
