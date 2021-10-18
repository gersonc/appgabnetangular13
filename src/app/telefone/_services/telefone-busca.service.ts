import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TelefoneBusca, TelefoneBuscaInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class TelefoneBuscaService {

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


  tb: TelefoneBuscaInterface;

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

  criarTelefoneBusca() {
    if (!this.tb) {
      this.tb = new TelefoneBusca();
    }
  }

  resetTelefoneBusca() {
    this.tb = new TelefoneBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('telefone-busca');
  }


}
