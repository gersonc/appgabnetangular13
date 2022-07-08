export interface ProcessoBuscaCampoInterface {
  field: string;
  header: string;
}

export interface ProcessoBuscaInterface {
  processo_id?: number;
  processo_numero?: number;
  processo_status_id?: number;
  processo_status_nome?: string;
  solicitacao_cadastro_tipo_id?: number;
  processo_cadastro_id?: number;
  cadastro_municipio_id?: number;
  cadastro_regiao_id?: number;
  solicitacao_local_id?: number;
  processo_solicitacao_id?: number;
  solicitacao_status_id?: number;
  solicitacao_status_nome?: string;
  solicitacao_situacao?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_area_interesse_id?: number;
  solicitacao_assunto_id?: number;
  solicitacao_data1?: string;
  solicitacao_data2?: string;
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean;
  campos?: ProcessoBuscaCampoInterface[];
  ids?: ProcessoBuscaCampoInterface[];
}

export class ProcessoBusca implements ProcessoBuscaInterface {
  processo_id = 0;
  processo_numero = 0;
  processo_status_id = 0;
  processo_status_nome = '';
  solicitacao_cadastro_tipo_id = 0;
  processo_cadastro_id = 0;
  cadastro_municipio_id = 0;
  cadastro_regiao_id = 0;
  solicitacao_local_id = 0;
  processo_solicitacao_id = 0;
  solicitacao_status_id = 0;
  solicitacao_status_nome = '';
  solicitacao_situacao = '';
  solicitacao_reponsavel_analize_id = 0;
  solicitacao_area_interesse_id = 0;
  solicitacao_assunto_id = 0;
  solicitacao_data1 = '';
  solicitacao_data2 = '';
  numlinhas = '0';
  inicio = '0';
  sortorder = '';
  sortcampo = 'processo_status_nome';
  todos = false;
  campos = [];
  ids = [];
}
