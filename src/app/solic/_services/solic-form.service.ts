import {Injectable} from '@angular/core';
import {SolicForm} from "../_models/solic-form";
import {SolicListarI} from "../_models/solic-listar-i";
import {SolicFormAnalisar, SolicFormAnalisarI} from "../_models/solic-form-analisar-i";
import {SolicHistoricoSolicitacao} from "../_models/solic-historico-solicitacao";
import {SolicHistoricoProcesso} from "../_models/solic-historico-processo";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {SolicFormI} from "../_models/solic-form-i";

@Injectable({
  providedIn: 'root'
})
export class SolicFormService {
  public solicitacao?: SolicFormI;
  public solA?: SolicFormAnalisarI;
  public solicListar?: SolicListarI;
  public acao?: string = null;

  constructor() {
  }

  resetSolicitacao() {
    this.solicitacao = new SolicForm();
  }

  resetSolicitacaoAnalise() {
    this.solA = new SolicFormAnalisar();
  }

  criarAnalisar() {
    if (this.solA === undefined) {
      this.solA = new SolicFormAnalisar();
    }
  }

  parseListagemForm(s: SolicListarI): SolicForm {
    this.solicitacao = new SolicForm();
    this.solicListar = s;
    this.resetSolicitacao();
    const r = new SolicForm();
    r.solicitacao_id = s.solicitacao_id;
    r.solicitacao_cadastro_tipo_id = s.solicitacao_cadastro_tipo_id;
    r.solicitacao_cadastro_id = s.solicitacao_cadastro_id;
    r.solicitacao_data = s.solicitacao_data;
    r.solicitacao_assunto_id = s.solicitacao_assunto_id;
    r.solicitacao_indicacao_sn = s.solicitacao_indicacao_sn2;
    r.solicitacao_indicacao_nome = s.solicitacao_indicacao_nome;
    r.solicitacao_orgao = s.solicitacao_orgao;
    r.solicitacao_atendente_cadastro_id = s.solicitacao_atendente_cadastro_id;
    r.solicitacao_data_atendimento = s.solicitacao_data_atendimento;
    r.solicitacao_cadastrante_cadastro_id = s.solicitacao_cadastrante_cadastro_id;
    r.solicitacao_local_id = s.solicitacao_local_id;
    r.solicitacao_tipo_recebimento_id = s.solicitacao_tipo_recebimento_id;
    r.solicitacao_numero_oficio = s.solicitacao_numero_oficio;
    r.solicitacao_area_interesse_id = s.solicitacao_area_interesse_id;
    r.solicitacao_descricao = s.solicitacao_descricao;
    r.solicitacao_descricao_delta = s.solicitacao_descricao_delta;
    r.solicitacao_descricao_texto = s.solicitacao_descricao_texto;
    r.solicitacao_reponsavel_analize_id = s.solicitacao_reponsavel_analize_id;
    r.solicitacao_aceita_sn = s.solicitacao_aceita_sn2;
    r.solicitacao_aceita_recusada = s.solicitacao_aceita_recusada;
    r.solicitacao_aceita_recusada_delta = s.solicitacao_aceita_recusada_delta;
    r.solicitacao_aceita_recusada_texto = s.solicitacao_aceita_recusada_texto;
    r.solicitacao_carta = s.solicitacao_carta;
    r.solicitacao_carta_delta = s.solicitacao_carta_delta;
    r.solicitacao_carta_texto = s.solicitacao_carta_texto;
    this.solicitacao = r;
    return r;
  }

  parseListagemAnalisarForm(s: SolicListarI): SolicFormAnalisar {
    this.resetSolicitacaoAnalise();
    this.solicListar = s;
    const r = new SolicFormAnalisar();
    r.solicitacao_id = s.solicitacao_id;
    r.solicitacao_cadastro_id = s.solicitacao_cadastro_id;
    r.solicitacao_aceita_recusada = s.solicitacao_aceita_recusada;
    r.solicitacao_aceita_recusada_delta = s.solicitacao_aceita_recusada_delta;
    r.solicitacao_aceita_recusada_texto = s.solicitacao_aceita_recusada_texto;
    r.solicitacao_carta = s.solicitacao_carta;
    r.solicitacao_carta_delta = s.solicitacao_carta_delta;
    r.solicitacao_carta_texto = s.solicitacao_carta_texto;
    this.solA = r;
    return r;
  }
}
