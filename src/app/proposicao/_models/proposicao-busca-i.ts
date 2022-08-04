import {ColunasI} from "../../_models/colunas-i";

export interface ProposicaoBuscaI {
  proposicao_tipo_id?: number;
  proposicao_id?: number;
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
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  todos?: boolean;
  campos?: ColunasI[];
  ids?: number[];
  excel?: boolean;
}
