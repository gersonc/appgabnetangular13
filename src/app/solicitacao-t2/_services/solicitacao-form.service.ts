import { Injectable } from '@angular/core';

import {
  SolicitacaoAlterarFormulario, SolicitacaoAlterarInterface,
  SolicitacaoAnalisarFormInterface,
  SolicitacaoAnalisarFormulario, SolicitacaoAnaliseInterface,
  SolicitacaoFormulario
} from '../_models';


@Injectable({
  providedIn: 'root'
})

export class SolicitacaoFormService {

  public solicitacao = new SolicitacaoFormulario();
  public alterar: SolicitacaoAlterarInterface;
  public analise: SolicitacaoAnalisarFormulario;

  constructor ( ) { }

  resetSolicitacao() {
    this.solicitacao = null;
    this.solicitacao = new SolicitacaoFormulario();
  }

  resetAnalisar() {
    this.analise = null;
    this.analise = new SolicitacaoAnalisarFormulario();
  }

  criarAnalisar() {
    this.analise = new SolicitacaoAnalisarFormulario();
  }

  criarAlterar() {
    this.alterar = new SolicitacaoAlterarFormulario();
  }

  resetAlterar() {
    delete this.alterar;
  }

}
