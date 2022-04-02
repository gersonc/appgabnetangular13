import {SolicSolicitacaoI} from "./solic-solicitacao-i";
import {SolicCadastro} from "./solic-cadastro";
import {SolicProcessoI} from "./solic-processo-i";
import {SolicHistoricoSolicitacao} from "./solic-historico-solicitacao";
import {SolicHistoricoProcesso} from "./solic-historico-processo";
import {SolicOficioI} from "./solic-oficio-i";


export interface SolicDetalheI {
  solicitacao: SolicSolicitacaoI;
  cadastro: SolicCadastro;
  processo?: SolicProcessoI;
  oficio?: SolicOficioI;
  historico_solicitcao?: SolicHistoricoSolicitacao[];
  historico_processo?: SolicHistoricoProcesso[];
}

