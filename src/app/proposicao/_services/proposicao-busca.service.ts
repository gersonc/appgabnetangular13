import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProposicaoBusca, ProposicaoBuscaInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class ProposicaoBuscaService {

  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  stateSN: boolean;
  state: any;


  proposicaoBusca: ProposicaoBuscaInterface;

  constructor() {
    this.buscaStateSN$.subscribe( vf => { this.stateSN = vf; });
    this.buscaState$.subscribe( dados => {this.state = dados; });
  }

  buscaMenu() {
    this.buscaSubject.next(true);
  }

  set buscaStateSN(dados: boolean) {
    this.buscaStateSNSubject.next(dados);
  }

  get buscaStateSN() {
    return this.stateSN;
  }

  set buscaState(dados: any) {
    this.buscaStateSubject.next(dados);
  }

  get buscaState() {
    return this.state;
  }

  criarProposicaoBusca() {
    if (!this.proposicaoBusca) {
      this.proposicaoBusca = new ProposicaoBusca();
    }
  }

  resetProposicaoBusca() {
    this.proposicaoBusca = new ProposicaoBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('proposicao-busca');
  }


}
