import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {SolicHistoricoSolicitacao} from "./solic-historico-solicitacao";
import {SolicHistoricoProcesso} from "./solic-historico-processo";

export interface SolicFormAnalisarI {
  solicitacao_id?: number;
  solicitacao_cadastro_id?: number;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  solicitacao_tipo_analize?: number;
}

export class SolicFormAnalisar implements SolicFormAnalisarI {
  solicitacao_id?: number;
  solicitacao_cadastro_id?: number;
  solicitacao_tipo_analize?: number;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
}
