export interface SolicI {
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_aceita_sn2?: string;
  solicitacao_aceita_sn?: number;
  solicitacao_area_interesse_id?: number;
  solicitacao_area_interesse_nome?: string;
  solicitacao_assunto_id?: number;
  solicitacao_assunto_nome?: string;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_cadastro_id?: number;
  solicitacao_cadastro_nome?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  solicitacao_data2?: string;
  solicitacao_data?: string;
  solicitacao_data_atendimento2?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_id?: number;
  solicitacao_indicacao_nome?: string;
  solicitacao_indicacao_sn2?: string;
  solicitacao_indicacao_sn?: number;
  solicitacao_local_id?: number;
  solicitacao_local_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_posicao2?: string;
  solicitacao_posicao?: string;
  solicitacao_processo_id?: number;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_tipo_analize?: number;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_tipo_recebimento_nome?: string;
}

export interface SolicProcessoI {
  processo_id: number;
  processo_numero: string;
  processo_status: number
  processo_status_nome: string; // 0 -> 'EM ANDAMENTO' / 1 - 'INDEFERIDO' / 2 - 'DEFERIDO' / 3 - 'SUSPENSO'
}

export interface SolicCadastro {
  cadastro_id?: number;
  cadastro_nome_limpo?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
  cadastro_bairro?: string;
  cadastro_regiao_id?: number;
  cadastro_regiao_nome?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_estado_nome?: string;
}

export interface SolicHistoricoSolicitacao {
  solicitacao_id?: number;
  historico_id?: number;
  historico_data2?: string;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
}

export interface SolicHistoricoProcesso {
  solicitacao_id?: number;
  historico_id?: number;
  historico_data2?: string;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
}

export interface SolicListarI {
  solicitacao_id?: number;
  solicitacao_posicao?: string;
  solicitacao_data?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_cadastro_id?: number;
  solicitacao_cadastro_nome?: string;
  solicitacao_data2?: string;
  solicitacao_assunto_id?: number;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn2?: number;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_data_atendimento2?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_orgao?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_aceita_sn?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  solicitacao_local_id?: number;
  solicitacao_local_nome2?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_tipo_recebimento_nome2?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_numero_oficio?: string;
  solicitacao_area_interesse_id?: number;
  solicitacao_area_interesse_nome?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_aceita_sn2?: number;
  solicitacao_posicao1?: number;
  solicitacao_processo_id?: number;
  cadastro_id?: number;
  cadastro_nome_limpo?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
  cadastro_bairro?: string;
  cadastro_regiao_id?: number;
  cadastro_regiao_nome?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_estado_nome?: string;
  processo_id?: number;
  processo_status2?: number;
  processo_status?: string;
  processo_numero?: string;
}
