export interface AndamentoProposicaoInterface {
  andamento_proposicao_id?: number;
  andamento_proposicao_proposicao_id?: number;
  andamento_proposicao_data?: string;
  andamento_proposicao_texto?: string;
  andamento_proposicao_relator_atual?: string;
  andamento_proposicao_orgao_id?: number;
  andamento_proposicao_orgao_nome?: string;
  andamento_proposicao_situacao_id?: number;
  andamento_proposicao_situacao_nome?: string;
}

export interface AndamentoProposicaoFormularioInterface {
  andamento_proposicao_id?: number;
  andamento_proposicao_proposicao_id?: number;
  andamento_proposicao_data?: string;
  andamento_proposicao_texto?: string;
  andamento_proposicao_relator_atual?: string;
  andamento_proposicao_orgao_id?: number;
  andamento_proposicao_orgao_nome?: string;
  andamento_proposicao_situacao_id?: number;
  andamento_proposicao_situacao_nome?: string;
  sn_relator_atual?: boolean;
  sn_orgao?: boolean;
  sn_situacao?: boolean;
}

export class AndamentoProposicao implements AndamentoProposicaoInterface {
  andamento_proposicao_id = 0;
  andamento_proposicao_proposicao_id = 0;
  andamento_proposicao_data = '';
  andamento_proposicao_texto = '';
  andamento_proposicao_relator_atual = '';
  andamento_proposicao_orgao_id = 0;
  andamento_proposicao_orgao_nome = '';
  andamento_proposicao_situacao_id = 0;
  andamento_proposicao_situacao_nome = '';
}

export interface AndamentoProposicaoListagemInterface {
  andamento_proposicao_id?: number;
  andamento_proposicao_proposicao_id?: number;
  andamento_proposicao_data?: string;
  andamento_proposicao_texto?: string;
  andamento_proposicao_relator_atual?: string;
  andamento_proposicao_orgao_id?: number;
  andamento_proposicao_orgao_nome?: string;
  andamento_proposicao_situacao_id?: number;
  andamento_proposicao_situacao_nome?: string;
}

export class AndamentoProposicaoFormulario implements AndamentoProposicaoFormularioInterface {
  andamento_proposicao_id = null;
  andamento_proposicao_proposicao_id = null;
  andamento_proposicao_data = null;
  andamento_proposicao_texto = null;
  andamento_proposicao_relator_atual = null;
  andamento_proposicao_orgao_id = null;
  andamento_proposicao_orgao_nome = null;
  andamento_proposicao_situacao_id = null;
  andamento_proposicao_situacao_nome = null;
  sn_relator_atual = true;
  sn_orgao = true;
  sn_situacao = true;
}
