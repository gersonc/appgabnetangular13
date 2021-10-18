import {V} from '../../_services';

export class SolicitacaoArray {

  public static solicitacao = [
    ['solicitacao_id', 'Id', '#', '0', '0'],
    ['solicitacao_posicao', 'Posição', 'POSIÇÃO', '0', '0'],
    ['solicitacao_cadastro_id', 'Solicitante', 'SOLICITANTE', '0', '0'],
    ['solicitacao_cadastro_nome', 'Solicitante', 'SOLICITANTE', '0', '0'],
    ['solicitacao_cadastro_tipo_id', 'Tipo de Solicitante', 'TIPO DE SOLICITANTE', '0', '0'],
    ['solicitacao_cadastro_tipo_nome', 'Tipo de Solicitante', 'TIPO DE SOLICITANTE', '0', '0'],
    ['solicitacao_data', 'Data', 'DATA', '0', '0'],
    ['solicitacao_assunto_id', 'Assunto', 'ASSUNTO', '0', '0'],
    ['solicitacao_assunto_nome', 'Assunto', 'ASSUNTO', '0', '0'],
    ['processo_numero', 'Num. Processo', 'NUM. PROCESSO', '0', '0'],
    ['solicitacao_processo_id', 'Num. Processo', 'NUM. PROCESSO', '0', '0'],
    ['cadastro_municipio_id', 'Município', 'MUNICÍPIO', '0', '0'],
    ['cadastro_municipio_nome', 'Município', 'MUNICÍPIO', '0', '0'],
    ['cadastro_regiao_id', 'Região', 'REGIÃO', '0', '0'],
    ['cadastro_regiao_nome', 'Região', 'REGIÃO', '0', '0'],
    ['solicitacao_area_interesse_id', 'Área de interesse', 'ÁREA DE INTERESSE', '0', '0'],
    ['solicitacao_area_interesse_nome', 'Área de interesse', 'ÁREA DE INTERESSE', '0', '0'],
    ['solicitacao_local_id', 'Núcleo', 'NÚCLEO', '0', '0'],
    ['solicitacao_local_nome', 'Núcleo', 'NÚCLEO', '0', '0'],
    ['solicitacao_indicacao_sn', 'Indicação S/N', 'INDICAÇÃO S/N', '0', '0'],
    ['solicitacao_indicacao_nome', 'Indicação', 'INDICAÇÃO', '0', '0'],
    ['solicitacao_reponsavel_analize_id', 'Responsável', 'RESPONSÁVEL', '0', '0'],
    ['solicitacao_reponsavel_analize_nome', 'Responsável', 'RESPONSÁVEL', '0', '0'],
    ['solicitacao_atendente_cadastro_id', 'Atendente', 'ATENDENTE', '0', '0'],
    ['solicitacao_atendente_cadastro_nome', 'Atendente', 'ATENDENTE', '0', '0'],
    ['solicitacao_data_atendimento', 'Dt. Atendimento', 'DT. ATENDIMENTO', '0', '0'],
    ['solicitacao_tipo_recebimento_id', 'Tp. Recebimento', 'NÚCLEO', '0', '0'],
    ['solicitacao_tipo_recebimento_nome', 'Tp. Recebimento', 'TP. RECEBIMENTO', '0', '0'],
    ['solicitacao_cadastrante_cadastro_id', 'Cadastrante', 'CADASTRANTE', '0', '0'],
    ['solicitacao_cadastrante_cadastro_nome', 'Cadastrante', 'CADASTRANTE', '0', '0'],
    ['solicitacao_aceita_sn', 'Aceita S/N', 'ACEITA S/N', '0', '0'],
    ['solicitacao_orgao', 'Orgão solicitado', 'ORGÃO SOLICITADO', '0', '0'],
    ['solicitacao_descricao', 'Descrição', 'DESCRIÇÃO', '0', '0'],
    ['solicitacao_aceita_recusada', 'ObservaçOes', 'OBSERVAÇÕES', '0', '0'],
    ['solicitacao_carta', 'Carta', 'CARTA', '0', '0']
  ];

  public static solicitacaoObjetoTitulos = {
    solicitacao_id: 'ID',
    solicitacao_posicao: 'POSIÇÃO',
    solicitacao_cadastro_id: 'SOLICITANTE',
    solicitacao_cadastro_nome: 'SOLICITANTE',
    solicitacao_cadastro_tipo_id: 'TIPO DE SOLICITANTE',
    solicitacao_cadastro_tipo_nome: 'TIPO DE SOLICITANTE',
    solicitacao_data: 'DATA',
    solicitacao_assunto_id: 'ASSUNTO',
    solicitacao_assunto_nome: 'ASSUNTO',
    processo_numero: 'NUM. PROCESSO',
    solicitacao_processo_id: 'NUM. PROCESSO',
    cadastro_municipio_id: 'MUNICÍPIO',
    cadastro_municipio_nome: 'MUNICÍPIO',
    cadastro_regiao_id: 'REGIÃO',
    cadastro_regiao_nome: 'REGIÃO',
    solicitacao_area_interesse_id: 'ÁREA DE INTERESSE',
    solicitacao_area_interesse_nome: 'ÁREA DE INTERESSE',
    solicitacao_local_id: 'NÚCLEO',
    solicitacao_local_nome: 'NÚCLEO',
    solicitacao_indicacao_sn: 'INDICAÇÃO S/N',
    solicitacao_indicacao_nome: 'INDICAÇÃO',
    solicitacao_reponsavel_analize_id: 'RESPONSÁVEL',
    solicitacao_reponsavel_analize_nome: 'RESPONSÁVEL',
    solicitacao_atendente_cadastro_id: 'ATENDENTE',
    solicitacao_atendente_cadastro_nome: 'ATENDENTE',
    solicitacao_data_atendimento: 'DT. ATENDIMENTO',
    solicitacao_tipo_recebimento_id: 'TP. RECEBIMENTO',
    solicitacao_tipo_recebimento_nome: 'TP. RECEBIMENTO',
    solicitacao_cadastrante_cadastro_id: 'CADASTRANTE',
    solicitacao_cadastrante_cadastro_nome: 'CADASTRANTE',
    solicitacao_aceita_sn: 'ACEITA S/N',
    solicitacao_orgao: 'ORGÃO SOLICITADO',
    solicitacao_descricao: 'DESCRIÇÃO',
    solicitacao_aceita_recusada: 'OBSERVAÇÕES',
    solicitacao_carta: 'CARTA'
  };

  public static getArrayTitulo() {
    const solicitacaoArrayTitulos: any[] = [];
    solicitacaoArrayTitulos['solicitacao_id'] = 'ID';
    solicitacaoArrayTitulos['solicitacao_posicao'] = 'POSIÇÃO';
    solicitacaoArrayTitulos['solicitacao_cadastro_id'] = 'SOLICITANTE';
    solicitacaoArrayTitulos['solicitacao_cadastro_nome'] = 'SOLICITANTE';
    solicitacaoArrayTitulos['solicitacao_cadastro_tipo_id'] = 'TIPO DE SOLICITANTE';
    solicitacaoArrayTitulos['solicitacao_cadastro_tipo_nome'] = 'TIPO DE SOLICITANTE';
    solicitacaoArrayTitulos['solicitacao_data'] = 'DATA';
    solicitacaoArrayTitulos['solicitacao_assunto_id'] = 'ASSUNTO';
    solicitacaoArrayTitulos['solicitacao_assunto_nome'] = 'ASSUNTO';
    if (V.solicitacao.processo_numero.ativo) {
      solicitacaoArrayTitulos['processo_numero'] = V.solicitacao.processo_numero.titulo;
      solicitacaoArrayTitulos['processo_numero'] = V.solicitacao.processo_numero.titulo;
    }
    solicitacaoArrayTitulos['cadastro_municipio_id'] = 'MUNICÍPIO';
    solicitacaoArrayTitulos['cadastro_municipio_nome'] = 'MUNICÍPIO';
    solicitacaoArrayTitulos['cadastro_regiao_id'] = 'REGIÃO';
    solicitacaoArrayTitulos['cadastro_regiao_nome'] = 'REGIÃO';
    if (V.solicitacao.cadastro_bairro.ativo) {
      solicitacaoArrayTitulos['cadastro_bairro'] = 'BAIRRO';
    }
    solicitacaoArrayTitulos['solicitacao_area_interesse_id'] = 'ÁREA DE INTERESSE';
    solicitacaoArrayTitulos['solicitacao_area_interesse_nome'] = 'ÁREA DE INTERESSE';
    if (V.solicitacao.solicitacao_local_nome.ativo) {
      solicitacaoArrayTitulos['solicitacao_local_id'] = V.solicitacao.solicitacao_local_nome.titulo;
      solicitacaoArrayTitulos['solicitacao_local_nome'] = V.solicitacao.solicitacao_local_nome.titulo;
    }
    solicitacaoArrayTitulos['solicitacao_indicacao_sn'] = 'INDICAÇÃO S/N';
    solicitacaoArrayTitulos['solicitacao_indicacao_nome'] = 'INDICAÇÃO';
    if (V.solicitacao.solicitacao_reponsavel_analize_nome.ativo) {
      solicitacaoArrayTitulos['solicitacao_reponsavel_analize_id'] = V.solicitacao.solicitacao_reponsavel_analize_nome.titulo;
      solicitacaoArrayTitulos['solicitacao_reponsavel_analize_nome'] = V.solicitacao.solicitacao_reponsavel_analize_nome.titulo;
    }
    solicitacaoArrayTitulos['solicitacao_atendente_cadastro_id'] = 'ATENDENTE';
    solicitacaoArrayTitulos['solicitacao_atendente_cadastro_nome'] = 'ATENDENTE';
    solicitacaoArrayTitulos['solicitacao_data_atendimento'] = 'DT. ATENDIMENTO';
    solicitacaoArrayTitulos['solicitacao_tipo_recebimento_id'] = V.solicitacao.solicitacao_tipo_recebimento_nome.titulo;
    solicitacaoArrayTitulos['solicitacao_tipo_recebimento_nome'] = V.solicitacao.solicitacao_tipo_recebimento_nome.titulo;
    solicitacaoArrayTitulos['solicitacao_cadastrante_cadastro_id'] = 'CADASTRANTE';
    solicitacaoArrayTitulos['solicitacao_cadastrante_cadastro_nome'] = 'CADASTRANTE';
    if (V.solicitacao.solicitacao_indicacao_sn.ativo) {
      solicitacaoArrayTitulos['solicitacao_aceita_sn'] = V.solicitacao.solicitacao_indicacao_sn.titulo;
    }
    if (V.solicitacao.solicitacao_orgao.ativo) {
      solicitacaoArrayTitulos['solicitacao_orgao'] = V.solicitacao.solicitacao_orgao.titulo;
    }
    solicitacaoArrayTitulos['solicitacao_descricao'] = 'DESCRIÇÃO';
    solicitacaoArrayTitulos['solicitacao_aceita_recusada'] = 'OBSERVAÇÕES';
    if (V.solicitacao.solicitacao_carta.ativo) {
      solicitacaoArrayTitulos['solicitacao_carta'] = V.solicitacao.solicitacao_carta.titulo;
    }
    if (V.solicitacao.historico_data.ativo) {
      solicitacaoArrayTitulos['historico_data'] = V.solicitacao.historico_data.titulo;
      solicitacaoArrayTitulos['historico_andamento'] = V.solicitacao.historico_andamento.titulo;
    }
    return solicitacaoArrayTitulos;
  }

  public static getCampo(n: number): string {
    return SolicitacaoArray.solicitacao[n][0];
  }

  public static getTituloMinusculo(n: number): string {
    return SolicitacaoArray.solicitacao[n][1];
  }

  public static getTituloMaiusculo(n: number): string {
    return SolicitacaoArray.solicitacao[n][2];
  }

  public static getTp(n: number): string {
    return SolicitacaoArray.solicitacao[n][3];
  }

  public static getTipo(n: number): string {
    return SolicitacaoArray.solicitacao[n][4];
  }

  public static getTamanho(n: number): string {
    return SolicitacaoArray.solicitacao[n][5];
  }

  public static getLinha(n: number) {
    return SolicitacaoArray.solicitacao[n];
  }

  public static getTudo() {
    return SolicitacaoArray.solicitacao;
  }

}
