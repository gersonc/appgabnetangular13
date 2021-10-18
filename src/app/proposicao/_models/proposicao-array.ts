export class ProposicaoArray {
  public static getArrayTitulo() {
    const proposicaoArrayTitulos: any[] = [];
    proposicaoArrayTitulos['proposicao_area_interesse_id'] = 'ÁREA DE INTERESSE';
    proposicaoArrayTitulos['proposicao_area_interesse_nome'] = 'ÁREA DE INTERESSE';
    proposicaoArrayTitulos['proposicao_autor'] = 'AUTOR';
    proposicaoArrayTitulos['proposicao_data_apresentacao'] = 'DATA APRESENTAÇÃO';
    proposicaoArrayTitulos['proposicao_emenda_tipo_id'] = 'TIPO DE EMENDA';
    proposicaoArrayTitulos['proposicao_emenda_tipo_nome'] = 'TIPO DE EMENDA';
    proposicaoArrayTitulos['proposicao_ementa'] = 'EMENTA';
    proposicaoArrayTitulos['proposicao_id'] = 'ID';
    proposicaoArrayTitulos['proposicao_numero'] = 'NÚMERO';
    proposicaoArrayTitulos['proposicao_orgao_id'] = 'ORGÃO ATUAL';
    proposicaoArrayTitulos['proposicao_orgao_nome'] = 'ORGÃO ATUAL';
    proposicaoArrayTitulos['proposicao_origem_id'] = 'ORGÃO ORIGEM';
    proposicaoArrayTitulos['proposicao_origem_nome'] = 'ORGÃO ORIGEM';
    proposicaoArrayTitulos['proposicao_parecer'] = 'PARECER';
    proposicaoArrayTitulos['proposicao_relator'] = 'RELATOR';
    proposicaoArrayTitulos['proposicao_relator_atual'] = 'RELATOR ATUAL';
    proposicaoArrayTitulos['proposicao_situacao_id'] = 'SITUAÇÃO';
    proposicaoArrayTitulos['proposicao_situacao_nome'] = 'SITUAÇÃO';
    proposicaoArrayTitulos['proposicao_texto'] = 'TEXTO';
    proposicaoArrayTitulos['proposicao_tipo_id'] = 'TIPO';
    proposicaoArrayTitulos['proposicao_tipo_nome'] = 'TIPO';
    proposicaoArrayTitulos['andamento_proposicao_data'] = 'AND. DATA';
    proposicaoArrayTitulos['andamento_proposicao_id'] = 'AND. ID';
    proposicaoArrayTitulos['andamento_proposicao_orgao_nome'] = 'AND. ORGÃO';
    proposicaoArrayTitulos['andamento_proposicao_relator_atual'] = 'AND. RELATOR';
    proposicaoArrayTitulos['andamento_proposicao_situacao_nome'] = 'AND. SITUAÇÃO';
    proposicaoArrayTitulos['andamento_proposicao_texto'] = 'ANDAMENTO';
    return proposicaoArrayTitulos;
  }
}

export class AndamentoProposicaoArray {
  public static getArrayTitulo() {
    const andamentoProposicaoArrayTitulos: any[] = [];
    andamentoProposicaoArrayTitulos['andamento_proposicao_data'] = 'DATA';
    andamentoProposicaoArrayTitulos['andamento_proposicao_id'] = 'ID';
    andamentoProposicaoArrayTitulos['andamento_proposicao_orgao_nome'] = 'ORGÃO';
    andamentoProposicaoArrayTitulos['andamento_proposicao_relator_atual'] = 'RELATOR';
    andamentoProposicaoArrayTitulos['andamento_proposicao_situacao_nome'] = 'SITUAÇÃO';
    andamentoProposicaoArrayTitulos['andamento_proposicao_texto'] = 'ANDAMENTO';
    return andamentoProposicaoArrayTitulos;
  }
}
