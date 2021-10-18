import {SolicitacaoFormularioInterface } from './solicitacao.interface';

export class SolicitacaoFormulario implements SolicitacaoFormularioInterface {
  solicitacao_id = null;
  solicitacao_cadastro_tipo_id = null;
  solicitacao_cadastro_tipo_nome = null;
  solicitacao_cadastro_id = null;
  solicitacao_cadastro_nome = null;
  solicitacao_data = null;
  solicitacao_assunto_id = null;
  solicitacao_assunto_nome = null;
  solicitacao_indicacao_sn = null;
  solicitacao_orgao = null;
  solicitacao_indicacao_nome = null;
  solicitacao_atendente_cadastro_id = null;
  solicitacao_atendente_cadastro_nome = null;
  solicitacao_data_atendimento = null;
  solicitacao_cadastrante_cadastro_id = null;
  solicitacao_cadastrante_cadastro_nome = null;
  solicitacao_local_id = null;
  solicitacao_local_nome = null;
  solicitacao_tipo_recebimento_id = null;
  solicitacao_tipo_recebimento_nome = null;
  solicitacao_area_interesse_id = null;
  solicitacao_area_interesse_nome = null;
  solicitacao_descricao = null;
  solicitacao_descricao_texto = null;
  solicitacao_descricao_delta = null;
  solicitacao_reponsavel_analize_id = null;
  solicitacao_reponsavel_analize_nome = null;
  solicitacao_aceita_sn = null;
  solicitacao_aceita_recusada = null;
  solicitacao_posicao = null;
  solicitacao_processo_id = null;
  solicitacao_carta = null;
  solicitacao_tipo_analize = null;
 /* processo_numero = null;*/
  // historico_andamento = null;
}

export interface SolicitacaoAnalisarFormInterface {
  solicitacao_id?: number;
  solicitacao_cadastro_id?: number;
  acao?: number;
  solicitacao_aceita_recusada?: string;
  solicitacao_carta?: string;
  arquivo?: any;
}

export class SolicitacaoAnalisarFormulario implements SolicitacaoAnalisarFormInterface {
  solicitacao_id = null;
  solicitacao_cadastro_id = null;
  acao = null;
  solicitacao_aceita_recusada = null;
  solicitacao_carta = null;
  arquivo = null;
}

export interface SolicitacaoAlterarInterface {
  solicitacao_id?: number;
  solicitacao_data?: string;
  solicitacao_assunto_id?: number;
  solicitacao_indicacao_sn?: number;
  solicitacao_indicacao_nome?: string;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_data_atendimento?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_local_id?: number;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_area_interesse_id?: number;
  solicitacao_descricao?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_descricao_descricao?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_aceita_recusada?: string;
  solicitacao_carta?: string;
  solicitacao_cadastro_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
}

export class SolicitacaoAlterarFormulario implements SolicitacaoAlterarInterface {
  solicitacao_id = null;
  solicitacao_data = null;
  solicitacao_assunto_id = null;
  solicitacao_indicacao_sn = null;
  solicitacao_indicacao_nome = null;
  solicitacao_atendente_cadastro_id = null;
  solicitacao_data_atendimento = null;
  solicitacao_cadastrante_cadastro_id = null;
  solicitacao_local_id = null;
  solicitacao_tipo_recebimento_id = null;
  solicitacao_area_interesse_id = null;
  solicitacao_descricao = null;
  solicitacao_descricao_delta = null;
  solicitacao_descricao_texto = null;
  solicitacao_reponsavel_analize_id = null;
  solicitacao_aceita_recusada = null;
  solicitacao_carta = null;
  solicitacao_cadastro_nome = null;
  solicitacao_orgao = null;
  solicitacao_cadastro_tipo_id = null;
  solicitacao_cadastro_tipo_nome = null;
}
