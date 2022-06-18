import {SolicFormI} from "./solic-form-i";

export class SolicForm implements SolicFormI{
  solicitacao_id?: number;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_id?: number;
  solicitacao_data?: string;
  solicitacao_assunto_id?: number;
  solicitacao_indicacao_sn?: number;
  solicitacao_indicacao_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_data_atendimento?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_local_id?: number;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_numero_oficio?: string;
  solicitacao_area_interesse_id?: number;
  solicitacao_descricao?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_aceita_sn?: number;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  solicitacao_tipo_analize?: number;
  solicitacao_processo_id?: number;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  processo_numero?: string;
}
