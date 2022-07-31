export interface ProposicaoI {
  proposicao_id?: number;
  proposicao_numero?: string;
  proposicao_tipo_id?: number;
  proposicao_tipo_nome?: string;
  proposicao_relator?: string;
  proposicao_relator_atual?: string;
  proposicao_data_apresentacao?: string;
  proposicao_data_apresentacao2?: string;
  proposicao_area_interesse_id?: number;
  proposicao_area_interesse_nome?: string;
  proposicao_ementa?: string;
  proposicao_ementa_delta?: string;
  proposicao_ementa_texto?: string;
  proposicao_texto?: string;
  proposicao_texto_delta?: string;
  proposicao_texto_texto?: string;
  proposicao_situacao_id?: number;
  proposicao_situacao_nome?: string;
  proposicao_parecer?: string;
  proposicao_origem_id?: number;
  proposicao_origem_nome?: string;
  proposicao_orgao_id?: number;
  proposicao_orgao_nome?: string;
  proposicao_emenda_tipo_id?: number;
  proposicao_emenda_tipo_nome?: string;
  proposicao_autor?: string;
}
