import {SolicListarI} from "./solic-listar-i";
import {SolicHistoricoSolicitacao} from "./solic-historico-solicitacao";
import {SolicCadastro} from "./solic-cadastro";
import {TotalI} from "../../shared-datatables/models/total-i";
import {SolicProcessoI} from "./solic-processo-i";
import {SolicOficioI} from "./solic-oficio-i";

export interface SolicDetalheI {
  solicitacao: SolicListarI | SolicListarI[];
  solicitacao_titulo?: any[];
  solicitacao_historico?: SolicHistoricoSolicitacao[];
  solicitacao_historico_titulo?: any[];
  cadastro: SolicCadastro;
  cadastro_titulo?: any[];
  processo_num?: TotalI;
  processo?: SolicProcessoI;
  processo_titulo?: any[];
  oficio_num?: TotalI;
  oficio?: SolicOficioI[];
  oficio_titulo?: any[];
  erro?: any[];
}

