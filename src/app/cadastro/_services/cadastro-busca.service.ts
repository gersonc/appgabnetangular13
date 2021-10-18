import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CadastroBusca, CadastroBuscaInterface} from '../_models';

@Injectable({
  providedIn: 'root'
})

export class CadastroBuscaService {

  buscaSubject = new Subject();
  busca$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  smsSNSubject = new BehaviorSubject<boolean>(false);
  smsSN$ = this.smsSNSubject.asObservable();
  stateSN: boolean;
  sms: boolean;
  state: any;

  cadastroBusca: CadastroBuscaInterface;

  constructor() {
    this.buscaStateSN$.subscribe( vf => { this.stateSN = vf; });
    this.buscaState$.subscribe( dados => {this.state = dados; });
    this.smsSN$.subscribe( dados => {this.sms = dados; });
  }

  buscaMenu() {
    this.buscaSubject.next();
  }

  set buscaStateSN(vf: boolean) {
    this.buscaStateSNSubject.next(vf);
  }

  get buscaStateSN() {
    return this.stateSN;
  }

  set smsSN(vf: boolean) {
    this.smsSNSubject.next(vf);
  }

  get smsSN(): boolean {
    return this.sms;
  }

  set buscaState(dados: any) {
    this.buscaStateSubject.next(dados);
  }

  get buscaState() {
    return this.state;
  }

  criarCadastroBusca() {
    if (!this.cadastroBusca) {
      this.cadastroBusca = new CadastroBusca();
    }
  }

  resetCadastroBusca() {
    delete this.cadastroBusca;
    this.cadastroBusca = new CadastroBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('cadastro-busca');
  }

}
