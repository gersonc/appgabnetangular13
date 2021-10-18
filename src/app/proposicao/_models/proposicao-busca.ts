import { ProposicaoBuscaCampoInterface } from './proposicao';

export interface ProposicaoBuscaInterface {
  proposicao_tipo_id?: number;
  proposicao_numero?: string;
  proposicao_autor?: string;
  proposicao_relator?: string;
  proposicao_area_interesse_id?: number;
  proposicao_parecer?: string;
  proposicao_origem_id?: number;
  proposicao_emenda_tipo_id?: number;
  proposicao_situacao_id?: number;
  proposicao_relator_atual?: string;
  proposicao_orgao_id?: number;
  proposicao_data1?: string;
  proposicao_data2?: string;
  proposicao_ementa?: string;
  proposicao_texto?: string;
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean;
  campos?: ProposicaoBuscaCampoInterface[];
  ids?: ProposicaoBuscaCampoInterface[];
}

export class ProposicaoBusca implements ProposicaoBuscaInterface {
  proposicao_tipo_id = 0;
  proposicao_numero = '';
  proposicao_autor = '';
  proposicao_relator = '';
  proposicao_area_interesse_id = 0;
  proposicao_parecer = '';
  proposicao_origem_id = 0;
  proposicao_emenda_tipo_id = 0;
  proposicao_situacao_id = 0;
  proposicao_relator_atual = '';
  proposicao_orgao_id = 0;
  proposicao_data1 = '';
  proposicao_data2 = '';
  proposicao_ementa = '';
  proposicao_texto = '';
  numlinhas = '0';
  inicio = '0';
  sortorder = '';
  sortcampo = '';
  todos = false;
  campos = [];
  ids = [];
}
