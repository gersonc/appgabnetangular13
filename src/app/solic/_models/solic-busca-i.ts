import {BuscaCampoI} from "../../shared-datatables/models/busca-campo-i";

export interface SolicBuscaI {
  solicitacao_posicao?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_id?: number;
  solicitacao_assunto_id?: number;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_id?: number;
  cadastro_municipio_id?: number;
  cadastro_regiao_id?: number;
  solicitacao_local_id?: number;
  cadastro_bairro?: string;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_area_interesse_id?: number;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_data?: string;
  solicitacao_descricao?: string;
  solicitacao_orgao?: string;
  processo_numero?: string;
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean;
  campos?: BuscaCampoI[];
  ids?: BuscaCampoI[];
}
