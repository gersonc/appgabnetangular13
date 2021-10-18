import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContaBusca, ContaBuscaInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class ContaBuscaService {

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

  cb: ContaBuscaInterface;

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

  criarContaBusca() {
    if (!this.cb) {
      this.cb = new ContaBusca();
    }
  }

  resetContaBusca() {
    this.cb = new ContaBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('conta-busca');
  }


}
