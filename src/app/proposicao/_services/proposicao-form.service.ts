import { Injectable } from '@angular/core';
import { ProposicaoFormulario, ProposicaoListagemInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ProposicaoFormService {

  proposicao: ProposicaoListagemInterface;

  constructor() { }

  criaProposicao() {
    this.proposicao = new ProposicaoFormulario();
  }

  resetProposicao() {
    delete  this.proposicao;
    this.proposicao = new ProposicaoFormulario();
  }

  filtraProposicao(): ProposicaoListagemInterface {
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
  }
}
