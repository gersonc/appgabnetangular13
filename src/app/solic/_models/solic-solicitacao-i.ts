import {SolicCadastro} from "./solic-cadastro";
import {SolicOficioI} from "./solic-oficio-i";

export interface SolicSolicitacaoI {
  solicitacao_id?: number;
  solicitacao_situacao?: string;
  solicitacao_status_id?: number;
  solicitacao_status_nome?: string;
  solicitacao_data?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_cadastro_id?: number;
  solicitacao_cadastro_nome?: string;
  solicitacao_data2?: string;
  solicitacao_assunto_id?: number;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn2?: number;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_data_atendimento2?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_orgao?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  solicitacao_local_id?: number;
  solicitacao_local_nome2?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_tipo_recebimento_nome2?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_numero_oficio?: string;
  solicitacao_numero_oficio2?: string;
  solicitacao_area_interesse_id?: number;
  solicitacao_area_interesse_nome?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_aceita_sn?: number;
  solicitacao_processo_id?: number;
}
