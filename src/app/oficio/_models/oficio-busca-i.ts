import {ColunasI} from "../../_models/colunas-i";
import {BuscaI} from "../../_models/busca-i";

/*export interface OficioBuscaCampoInterface {
  field: string;
  header: string;
}*/

export interface OficioBuscaI extends BuscaI {
  oficio_processo_id?: number;
  oficio_codigo?: string;
  oficio_numero?: string;
  oficio_protocolo_numero?: string;
  oficio_municipio_id?: number;
  oficio_tipo_solicitante_id?: number;
  oficio_cadastro_id?: number;
  oficio_convenio?: string;
  oficio_assunto_id?: number;
  oficio_area_interesse_id?: number;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_local_id?: number;
  oficio_orgao_solicitado_nome?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_status_id?: number;
  oficio_prioridade_id?: number;
  oficio_tipo_andamento_id?: number;
  oficio_data_emissao1?: string;
  oficio_data_emissao2?: string;
  oficio_data_empenho1?: string;
  oficio_data_empenho2?: string;
  oficio_data_protocolo1?: string;
  oficio_data_protocolo2?: string;
  oficio_data_pagamento1?: string;
  oficio_data_pagamento2?: string;
  oficio_prazo1?: string;
  oficio_prazo2?: string;
  oficio_descricao_acao?: string;
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  sortcampo?: string;
  todos?: boolean;
  campos?: ColunasI[];
  ids?: number[];
  excel?: boolean;
}

/*export class OficioBusca implements OficioBuscaInterface {
  oficio_processo_id = 0;
  oficio_codigo = '';
  oficio_numero = '';
  oficio_protocolo_numero = '';
  oficio_municipio_id = 0;
  oficio_tipo_solicitante_id = 0;
  oficio_cadastro_id = 0;
  oficio_convenio = '';
  oficio_assunto_id = 0;
  oficio_area_interesse_id = 0;
  solicitacao_reponsavel_analize_id = 0;
  solicitacao_local_id = 0;
  oficio_orgao_solicitado_nome = '';
  oficio_orgao_protocolante_nome = '';
  oficio_status = 0;
  oficio_prioridade_id = 0;
  oficio_tipo_andamento_id = 0;
  oficio_data_emissao1 = '';
  oficio_data_emissao2 = '';
  oficio_data_empenho1 = '';
  oficio_data_empenho2 = '';
  oficio_data_protocolo1 = '';
  oficio_data_protocolo2 = '';
  oficio_data_pagamento1 = '';
  oficio_data_pagamento2 = '';
  oficio_prazo1 = '';
  oficio_prazo2 = '';
  oficio_descricao_acao = '';
  numlinhas = '0';
  inicio = '0';
  sortorder = '';
  sortcampo = 'oficio_status';
  todos = false;
  campos = [];
  ids = [];
}*/
