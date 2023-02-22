import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PassagemBusca, PassagemBuscaInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class PassagemBuscaService {

  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  atualisaMenuSubject = new BehaviorSubject<boolean>(false);
  atualisaMenu$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  stateSN: boolean;
  state: any;

  ps: PassagemBuscaInterface;

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

  criarPassagemBusca() {
    if (!this.ps) {
      this.ps = new PassagemBusca();
    }
  }

  resetPassagemBusca() {
    this.ps = new PassagemBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('passagem-busca');
  }
}
