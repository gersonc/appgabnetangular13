export interface SolicitacaoInterface {
  solicitacao_id?: number;
  solicitacao_posicao2?: string;
  solicitacao_data?: string;
  solicitacao_data_atendimento?: string;
  processo_numero?: string;
  processo_id?: number;
  processo_status?: number;
  processo_status2?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_cadastro_id?: number;
  solicitacao_cadastro_nome?: string;
  solicitacao_assunto_id?: number;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn?: number;
  solicitacao_indicacao_sn2?: string;
  solicitacao_orgao?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_local_id?: number;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_area_interesse_id?: number;
  solicitacao_area_interesse_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_aceita_sn?: number;
  solicitacao_aceita_sn2?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_posicao?: string;
  solicitacao_processo_id?: number;
  solicitacao_carta?: string;
  solicitacao_carta_texto?: string;
  cadastro_bairro?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
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
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_texto?: string;
  arquivo?: any[];
  arquivo_num?: number;
}

export interface SolicitacaoInterfaceExcel {
  solicitacao_id?: number;
  solicitacao_posicao?: string;
  solicitacao_data?: string;
  solicitacao_data_atendimento?: string;
  processo_numero?: string;
  processo_status?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_cadastro_nome?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn?: number;
  solicitacao_orgao?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_aceita_sn?: number;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta_texto?: string;
  cadastro_bairro?: string;
  cadastro_municipio_nome?: string;
  cadastro_regiao_nome?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  historico_data?: string;
  historico_andamento_texto?: string;
}

export interface SolicitacaoInterfaceExcel2 {
  solicitacao_id?: any;
  solicitacao_posicao?: any;
  solicitacao_data?: any;
  solicitacao_data_atendimento?: any;
  processo_numero?: any;
  processo_status?: any;
  solicitacao_cadastro_tipo_nome?: any;
  solicitacao_cadastro_nome?: any;
  solicitacao_assunto_nome?: any;
  solicitacao_indicacao_sn?: any;
  solicitacao_orgao?: any;
  solicitacao_indicacao_nome?: any;
  solicitacao_atendente_cadastro_nome?: any;
  solicitacao_cadastrante_cadastro_nome?: any;
  solicitacao_local_nome?: any;
  solicitacao_tipo_recebimento_nome?: any;
  solicitacao_area_interesse_nome?: any;
  solicitacao_descricao?: any;
  solicitacao_descricao_texto?: any;
  solicitacao_reponsavel_analize_nome?: any;
  solicitacao_aceita_sn?: any;
  solicitacao_aceita_recusada?: any;
  solicitacao_aceita_recusada_texto?: any;
  solicitacao_carta?: any;
  solicitacao_carta_texto?: any;
  cadastro_bairro?: any;
  cadastro_municipio_nome?: any;
  cadastro_regiao_nome?: any;
  cadastro_email?: any;
  cadastro_email2?: any;
  cadastro_telefone?: any;
  cadastro_telefone2?: any;
  cadastro_celular?: any;
  cadastro_celular2?: any;
  cadastro_telcom?: any;
  cadastro_fax?: any;
  historico_data?: any;
  historico_andamento?: any;
  historico_andamento_texto?: any;
}

export interface SolicitacaoTotalInterface {
  num: number;
}

export interface SolicitacaoSQLInterface {
  sql: string;
}

/*
export interface SolicitacaoPaginacaoInterface {
  solicitacao: SolicitacaoInterface[];
  total: SolicitacaoTotalInterface;
  sql: SolicitacaoSQLInterface[];
}
*/

export interface SolicitacaoPaginacaoInterface {
  solicitacao: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
  total: SolicitacaoTotalInterface;
  sql: SolicitacaoSQLInterface[];
}


export interface SolicitacaoFormularioInterface {
  solicitacao_id?: number;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_cadastro_id?: number;
  solicitacao_cadastro_nome?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
  cadastro_bairro?: string;
  solicitacao_data?: string;
  solicitacao_assunto_id?: number;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn?: number;
  solicitacao_orgao?: string;
  solicitacao_numero_oficio?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_local_id?: number;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_area_interesse_id?: number;
  solicitacao_area_interesse_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_aceita_sn?: number;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_posicao?: string;
  solicitacao_processo_id?: number;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  solicitacao_tipo_analize?: number;
  processo_numero?: string;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
}


export interface SolicitacaoListar12Interface {
  solicitacao_id?: number;
  solicitacao_posicao?: string;
  solicitacao_cadastro_nome?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_orgao?: string;
  processo_numero?: string;
  processo_status?: string;
  cadastro_municipio_nome?: string;
  cadastro_regiao_nome?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_cadastrante_cadastro_nome?: string;
  historico_data?: string;
  solicitacao_aceita_sn?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  historico_andamento?: string;
  historico_andamento_texto?: string;
  historico_andamento_delta?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  solicitacao_cadastro_id?: number;
  processo_id?: number;
}

export interface SolicitacaoListar345Interface {
  solicitacao_id?: number;
  solicitacao_posicao?: string;
  solicitacao_cadastro_nome?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_reponsavel_analize_nome?: string;
  cadastro_municipio_nome?: string;
  cadastro_regiao_nome?: string;
  solicitacao_local_nome?: string;
  historico_data?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_aceita_sn?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  solicitacao_cadastro_id?: number;
  cadastro_bairro?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
}

export class SolicitacaoExcel12 implements SolicitacaoListar12Interface {
  solicitacao_id = null;
  solicitacao_posicao = null;
  solicitacao_cadastro_nome = null;
  solicitacao_data = null;
  solicitacao_assunto_nome = null;
  solicitacao_area_interesse_nome = null;
  processo_numero = null;
  processo_status = null;
  cadastro_municipio_nome = null;
  cadastro_regiao_nome = null;
  solicitacao_indicacao_sn = null;
  solicitacao_indicacao_nome = null;
  solicitacao_reponsavel_analize_nome = null;
  solicitacao_local_nome = null;
  solicitacao_tipo_recebimento_nome = null;
  solicitacao_cadastro_tipo_nome = null;
  solicitacao_data_atendimento = null;
  solicitacao_atendente_cadastro_nome = null;
  solicitacao_cadastrante_cadastro_nome = null;
  historico_data = null;
  historico_andamento = null;
  solicitacao_aceita_sn = null;
  cadastro_email = null;
  cadastro_email2 = null;
  cadastro_telefone = null;
  cadastro_telefone2 = null;
  cadastro_celular = null;
  cadastro_celular2 = null;
  cadastro_telcom = null;
  cadastro_fax = null;
}

export interface SolicitacaoHistoricoInterface {
  historico_id?: number;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  historico_solicitacao_id?: number;
}




