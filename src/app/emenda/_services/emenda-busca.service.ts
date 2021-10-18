import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {EmendaBusca, EmendaBuscaInterface} from "../_models";


@Injectable({
  providedIn: 'root'
})
export class EmendaBuscaService {

  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  stateSN: boolean;
  state: any;

  emendaBusca = new EmendaBusca();

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

  criarEmendaBusca() {
    if (!this.emendaBusca) {
      this.emendaBusca = new EmendaBusca();
    }
  }

  resetEmendaBusca() {
    this.emendaBusca = new EmendaBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('emenda-busca');
  }
}
