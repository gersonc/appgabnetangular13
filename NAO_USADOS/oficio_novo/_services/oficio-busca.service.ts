import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {OficioBuscaI} from "../_models/oficio-busca-i";


@Injectable({
  providedIn: 'root'
})

export class OficioBuscaService {

  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  stateSN: boolean;
  state: any;


  oficioBusca: OficioBuscaI;

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

  criarOficioBusca() {
    if (!this.oficioBusca) {
      this.oficioBusca = {};
    }
  }

  resetOficioBusca() {
    this.oficioBusca = {};
    this.buscaStateSN = false;
    sessionStorage.removeItem('oficio-busca');
  }


}
