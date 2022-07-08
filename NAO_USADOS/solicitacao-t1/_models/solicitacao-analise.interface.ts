import { SolicitacaoInterface } from './solicitacao.interface';
import { SolicitacaoCadastroInterface } from './solicitacao-detalhe.interface';

export interface SolicitacaoAnaliseInterface {
  solicitacao_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_cadastro_id?: number;
  solicitacao_cadastro_nome?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn?: number;
  solicitacao_orgao?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_posicao?: string;
  solicitacao_carta?: string;
}

export interface SolicitacaoCadastroAnalise {
  solicitacao: SolicitacaoAnaliseInterface;
  cadastro: SolicitacaoCadastroInterface;
}



