export interface AndamentoProposicaoI {
  andamento_proposicao_id?: number;
  andamento_proposicao_proposicao_id?: number;
  andamento_proposicao_data2?: string;
  andamento_proposicao_data?: string;
  andamento_proposicao_texto?: string;
  andamento_proposicao_texto_delta?: string;
  andamento_proposicao_texto_texto?: string;
  andamento_proposicao_relator_atual?: string;
  andamento_proposicao_orgao_id?: number;
  andamento_proposicao_orgao_nome?: string;
  andamento_proposicao_situacao_id?: number;
  andamento_proposicao_situacao_nome?: string;
}

export class AndamentoProposicao implements AndamentoProposicaoI {
  andamento_proposicao_id?: number;
  andamento_proposicao_proposicao_id?: number;
  andamento_proposicao_data2?: string;
  andamento_proposicao_data?: string;
  andamento_proposicao_texto?: string;
  andamento_proposicao_texto_delta?: string;
  andamento_proposicao_texto_texto?: string;
  andamento_proposicao_relator_atual?: string;
  andamento_proposicao_orgao_id?: number;
  andamento_proposicao_orgao_nome?: string;
  andamento_proposicao_situacao_id?: number;
  andamento_proposicao_situacao_nome?: string;
}

export interface AndamentoProposicaoFormI extends AndamentoProposicaoI{
  andamento_proposicao_id?: number;
  andamento_proposicao_proposicao_id?: number;
  andamento_proposicao_data2?: string;
  andamento_proposicao_data?: string;
  andamento_proposicao_texto?: string;
  andamento_proposicao_texto_delta?: string;
  andamento_proposicao_texto_texto?: string;
  andamento_proposicao_relator_atual?: string;
  andamento_proposicao_orgao_id?: number;
  andamento_proposicao_orgao_nome?: string;
  andamento_proposicao_situacao_id?: number;
  andamento_proposicao_situacao_nome?: string;
  sn_relator_atual?: number;
  sn_orgao?: number;
  sn_situacao?: number;
}

export interface AndPropI {
  idx?: number;
  acao?: string;
  registro_id?: number;
  andamentoProposicaoListar?: AndamentoProposicaoI[];
  andamentoProposicaoForm?: AndamentoProposicaoFormI;
}

/*export interface AndPropListI {
  idx?: number;
  acao?: string;
  registro_id?: number;
  andamentoProposicaoListar?: AndamentoProposicaoI[];
}*/


