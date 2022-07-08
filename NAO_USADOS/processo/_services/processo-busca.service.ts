import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProcessoBusca, ProcessoBuscaInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class ProcessoBuscaService {

  buscaSubject = new Subject();
  busca$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  stateSN: boolean;
  state: any;

  processoBusca: ProcessoBuscaInterface;

  constructor() {
    this.buscaStateSN$.subscribe( vf => { this.stateSN = vf; });
    this.buscaState$.subscribe( dados => {this.state = dados; });
  }

  buscaMenu() {
    this.buscaSubject.next();
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

  criarProcessoBusca() {
    if (!this.processoBusca) {
      this.processoBusca = new ProcessoBusca();
    }
  }

  resetProcessoBusca() {
    delete this.processoBusca;
    this.processoBusca = new ProcessoBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('processo-busca');
  }

  destroiProcessoBusca() {
    delete this.processoBusca;
  }

  destroiBuscaStateSN() {
    delete this.buscaStateSNSubject;
    delete this.buscaStateSN$;
  }

  destroiBuscaState() {
    delete this.buscaStateSubject;
    delete this.buscaState$;
  }

}
