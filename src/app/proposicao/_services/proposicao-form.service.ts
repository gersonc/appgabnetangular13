import {Injectable} from '@angular/core';
import {ProposicaoListarI} from "../_models/proposicao-listar-i";
import {ProposicaoForm, ProposicaoFormI} from "../_models/proposicao-form";

@Injectable({
  providedIn: 'root'
})
export class ProposicaoFormService {

  proposicaoListar: ProposicaoListarI;
  proposicao: ProposicaoFormI;
  url = '';
  public acao?: string | null = null;
  public btnEnviar = true;

  constructor() {
  }

  criaProposicao() {
    this.proposicao = new ProposicaoForm();
  }

  resetProposicao() {
    delete this.proposicao;
    this.proposicao = new ProposicaoForm();
  }

  parceProposicaoFormulario(l: ProposicaoListarI): ProposicaoFormI {
    this.proposicao = new ProposicaoForm();
    this.proposicaoListar = l;
    const r = new ProposicaoForm();
    r.proposicao_id = +l.proposicao_id;
    r.proposicao_numero = l.proposicao_numero;
    r.proposicao_tipo_id = +l.proposicao_tipo_id;
    r.proposicao_relator = l.proposicao_relator;
    r.proposicao_relator_atual = l.proposicao_relator_atual;
    r.proposicao_data_apresentacao = l.proposicao_data_apresentacao;
    r.proposicao_area_interesse_id = +l.proposicao_area_interesse_id;
    r.proposicao_ementa = l.proposicao_ementa;
    r.proposicao_ementa_delta = l.proposicao_ementa_delta;
    r.proposicao_ementa_texto = l.proposicao_ementa_texto;
    r.proposicao_texto = l.proposicao_texto;
    r.proposicao_texto_delta = l.proposicao_texto_delta;
    r.proposicao_texto_texto = l.proposicao_texto_texto;
    r.proposicao_situacao_id = +l.proposicao_situacao_id;
    r.proposicao_parecer = l.proposicao_parecer;
    r.proposicao_origem_id = +l.proposicao_origem_id;
    r.proposicao_orgao_id = +l.proposicao_orgao_id;
    r.proposicao_emenda_tipo_id = +l.proposicao_emenda_tipo_id;
    r.proposicao_autor = l.proposicao_autor;
    r.andamento_proposicao_id = +l.andamento_proposicao_id;
    r.andamento_proposicao_data = l.andamento_proposicao_data;
    r.andamento_proposicao_texto = l.andamento_proposicao_texto;
    r.andamento_proposicao_texto_delta = l.andamento_proposicao_texto_delta;
    r.andamento_proposicao_texto_texto = l.andamento_proposicao_texto_texto;
    r.andamento_proposicao_relator_atual = l.andamento_proposicao_relator_atual;
    r.andamento_proposicao_orgao_id = +l.andamento_proposicao_orgao_id;
    r.andamento_proposicao_situacao_id = +l.andamento_proposicao_situacao_id;
    this.proposicao = r;
    return r;
  }

  /*filtraProposicao(): ProposicaoListagemInterface {
    const prop = new ProposicaoFormulario();
    for (const key in prop) {
      if (this.proposicao[key]) {
        if (this.proposicao[key] === null) {
          delete this.proposicao[key];
          delete prop[key];
        } else {
          prop[key] = this.proposicao[key];
        }
      } else {
        delete prop[key];
      }
    }
    return prop;
  }*/
}
