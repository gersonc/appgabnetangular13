export interface SolicitacaoBuscaCampoInterface {
  field: string;
  header: string;
}

export interface SolicitacaoBuscaInterface {
  solicitacao_posicao?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_id?: number;
  solicitacao_assunto_id?: number;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_id?: number;
  cadastro_municipio_id?: number;
  cadastro_regiao_id?: number;
  solicitacao_local_id?: number;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_area_interesse_id?: number;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_data?: string;
  solicitacao_descricao?: string;
  solicitacao_orgao?: string;
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean;
  campos?: SolicitacaoBuscaCampoInterface[];
  ids?: SolicitacaoBuscaCampoInterface[];
}

export class SolicitacaoBusca {
  solicitacao_posicao = '';
  solicitacao_cadastro_tipo_id = 0;
  solicitacao_cadastro_id = 0;
  solicitacao_assunto_id = 0;
  solicitacao_atendente_cadastro_id = 0;
  solicitacao_cadastrante_cadastro_id = 0;
  cadastro_municipio_id = 0;
  cadastro_regiao_id = 0;
  solicitacao_local_id = 0;
  solicitacao_tipo_recebimento_id = 0;
  solicitacao_area_interesse_id = 0;
  solicitacao_reponsavel_analize_id = 0;
  solicitacao_data = '';
  solicitacao_descricao = '';
  solicitacao_orgao = '';
  numlinhas = '';
  inicio = '';
  sortorder = '';
  sortcampo = '';
  todos?: boolean;
  campos?: SolicitacaoBuscaCampoInterface[];
  ids?: SolicitacaoBuscaCampoInterface[];
}
