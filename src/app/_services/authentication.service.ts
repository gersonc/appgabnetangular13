import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, pipe, Subject } from 'rxjs';
import { catchError, map, take} from 'rxjs/operators';

import { User } from '../_models';
import { UrlService} from '../_services';
import {Versao} from './versao';

@Injectable({providedIn: 'root'})

export class AuthenticationService {
  public permissoes_carregadas = false;

  public agenda2 = false;
  public agenda = false;
  public andamentoproposicao = false;
  public arquivos = false;
  public assunto = false;
  public cadastro = false;
  public configuracao = false;
  public contabilidade = false;
  public cadastrosigilo = false;
  public contatos = false;
  public emenda = false;
  public historicoemenda = false;
  public historico = false;
  public municipio = false;
  public oficio = false;
  public passagemaerea = false;
  public proposicao = false;
  public processo = false;
  public solicitacao = false;
  public sms = false;
  public telefone = false;
  public usuario = false;
  public configuracao_incluir = false;
  public configuracao_alterar = false;
  public assunto_incluir = false;
  public assunto_alterar = false;
  public municipio_incluir = false;
  public municipio_alterar = false;
  public usuario_incluir = false;
  public usuario_alterar = false;
  public usuario_apagar = false;
  public cadastro_incluir = false;
  public cadastro_alterar = false;
  public cadastro_apagar = false;
  public cadastro_listar = false;
  public solicitacao_incluir = false;
  public solicitacao_alterar = false;
  public solicitacao_apagar = false;
  public solicitacao_listar = false;
  public solicitacao_analisar = false;
  public processo_deferir = false;
  public processo_indeferir = false;
  public processo_listar = false;
  public oficio_incluir = false;
  public oficio_deferir = false;
  public oficio_indeferir = false;
  public oficio_vizualizar = false;
  public oficio_listar = false;
  public oficio_alterar = false;
  public historico_incluir = false;
  public historico_alterar = false;
  public historico_apagar = false;
  public agenda_incluir = false;
  public agenda_alterar = false;
  public agenda_apagar = false;
  public processo_apagar = false;
  public oficio_apagar = false;
  public assunto_apagar = false;
  public municipio_apagar = false;
  public agenda_visualizar = false;
  public agenda2_incluir = false;
  public agenda2_alterar = false;
  public agenda2_apagar = false;
  public agenda2_visualizar = false;
  public telefone_incluir = false;
  public telefone_alterar = false;
  public telefone_apagar = false;
  public telefone_listar = false;
  public contabilidade_incluir = false;
  public contabilidade_alterar = false;
  public contabilidade_apagar = false;
  public contabilidade_listar = false;
  public contatos_exibir = false;
  public contatos_gerenciar = false;
  public configuracao_apagar = false;
  public emenda_incluir = false;
  public emenda_alterar = false;
  public emenda_apagar = false;
  public emenda_listar = false;
  public historicoemenda_incluir = false;
  public historicoemenda_alterar = false;
  public historicoemenda_apagar = false;
  public historicoemenda_listar = false;
  public cadastrosigilo_incluir = false;
  public cadastrosigilo_alterar = false;
  public cadastrosigilo_apagar = false;
  public cadastrosigilo_listar = false;
  public proposicao_incluir = false;
  public proposicao_alterar = false;
  public proposicao_apagar = false;
  public proposicao_listar = false;
  public andamentoproposicao_incluir = false;
  public andamentoproposicao_alterar = false;
  public andamentoproposicao_apagar = false;
  public andamentoproposicao_listar = false;
  public passagemaerea_incluir = false;
  public passagemaerea_alterar = false;
  public passagemaerea_apagar = false;
  public passagemaerea_listar = false;
  public sms_incluir = false;
  public arquivos_anexar = false;
  public arquivos_baixar = false;
  public arquivos_apagar = false;
  // tslint:disable-next-line:no-trailing-whitespace
  public _versao = 0; // 1-FEDERAL COMPLETO / 2-ESTADUAL COMPLETA / 3-VEREADOR / 4-FEDERAL SIMPLES / 5-ESTADUAL SIMPLES
  public usuario_id = 0;
  public parlamentar_id = 0;
  public parlamentar_nome = '';
  public usuario_email = '';
  public usuario_local_id = 0;
  public usuario_nome = '';
  public usuario_principal_sn = false;
  public usuario_responsavel_sn = false;
  public parlamentar_sms_ativo = false;
  public parlamentar_arquivo_ativo = false;
  public versao: any = null;
  public versao_id = 0;


  private currentUserSubject?: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private user$?: Observable<User>;
  private mostraMenuSource =  new BehaviorSubject<boolean>(false);
  public mostraMenu$ = this.mostraMenuSource.asObservable();


  constructor(
    private urlService: UrlService,
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(<string>localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    if (this.currentUserSubject.value) {
      this.carregaPermissoes(this.currentUserSubject.value);
    }
  }

  public get currentUserValue() {
    return this.currentUserSubject!.value;
  }

  public get mostraMenu () {
    return this.mostraMenu$;
  }

  public mostraMenuEmiter(valor: boolean) {
    this.mostraMenuSource.next(valor);
  }

  login(username: string, password: string) {
    const bt = username + ':' + password;
    const hvalue = 'Basic ' + btoa(bt);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': hvalue
      })
    };
    return this.http.post<any>(this.urlService.login, {username, password}, httpOptions)
      .pipe(
        take(1),
        map(user => {
          if (user && user.token) {
            const arq = {
              'arquivo_ativo': user.arquivo_ativo,
              'arquivo_cota': user.arquivo_cota,
              'cota_disponivel': user.cota_disponivel,
              'cota_utilizada': user.cota_utilizada
            };
            sessionStorage.setItem('arquivo-permissoes', JSON.stringify(arq));
            delete user.arquivo_ativo;
            delete user.arquivo_cota;
            delete user.cota_disponivel;
            delete user.cota_utilizada;
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.carregaPermissoes(user);
            this.currentUserSubject!.next(user);
            }
          return user;
        }),
        catchError(err => of(err))
      );
  }

  carregaPermissoes(user: User): void {
    this.agenda2 = user.rule?.indexOf('a2') !== -1;
    this.agenda = user.rule?.indexOf('ag') !== -1;
    this.andamentoproposicao = user.rule?.indexOf('ap') !== -1;
    this.arquivos = user.rule?.indexOf('ar') !== -1;
    this.assunto = user.rule?.indexOf('as') !== -1;
    this.cadastro = user.rule?.indexOf('ca') !== -1;
    this.configuracao = user.rule?.indexOf('cf') !== -1;
    this.contabilidade = user.rule?.indexOf('co') !== -1;
    this.cadastrosigilo = user.rule?.indexOf('cs') !== -1;
    this.contatos = user.rule?.indexOf('ct') !== -1;
    this.emenda = user.rule?.indexOf('em') !== -1;
    this.historicoemenda = user.rule?.indexOf('he') !== -1;
    this.historico = user.rule?.indexOf('hi') !== -1;
    this.municipio = user.rule?.indexOf('mu') !== -1;
    this.oficio = user.rule?.indexOf('of') !== -1;
    this.passagemaerea = user.rule?.indexOf('pa') !== -1;
    this.proposicao = user.rule?.indexOf('pp') !== -1;
    this.processo = user.rule?.indexOf('pr') !== -1;
    this.solicitacao = user.rule?.indexOf('so') !== -1;
    this.sms = user.rule?.indexOf('sm') !== -1;
    this.telefone = user.rule?.indexOf('te') !== -1;
    this.usuario = user.rule?.indexOf('us') !== -1;
    // this.usuario = user.rule?.indexOf('up') !== -1;
    this.configuracao_incluir = user.scope?.indexOf('cf_i') !== -1;
    this.configuracao_alterar = user.scope?.indexOf('cf_a') !== -1;
    this.assunto_incluir = user.scope?.indexOf('as_i') !== -1;
    this.assunto_alterar = user.scope?.indexOf('as_a') !== -1;
    this.municipio_incluir = user.scope?.indexOf('mu_i') !== -1;
    this.municipio_alterar = user.scope?.indexOf('mu_a') !== -1;
    this.usuario_incluir = user.scope?.indexOf('us_i') !== -1;
    this.usuario_alterar = user.scope?.indexOf('us_a') !== -1;
    this.usuario_apagar = user.scope?.indexOf('us_d') !== -1;
    this.cadastro_incluir = user.scope?.indexOf('ca_i') !== -1;
    this.cadastro_alterar = user.scope?.indexOf('ca_a') !== -1;
    this.cadastro_apagar = user.scope?.indexOf('ca_d') !== -1;
    this.cadastro_listar = user.scope?.indexOf('ca_l') !== -1;
    this.solicitacao_incluir = user.scope?.indexOf('so_i') !== -1;
    this.solicitacao_alterar = user.scope?.indexOf('so_a') !== -1;
    this.solicitacao_apagar = user.scope?.indexOf('so_d') !== -1;
    this.solicitacao_listar = user.scope?.indexOf('so_l') !== -1;
    this.solicitacao_analisar = user.scope?.indexOf('so_n') !== -1;
    this.processo_deferir = user.scope?.indexOf('pr_df') !== -1;
    this.processo_indeferir = user.scope?.indexOf('pr_if') !== -1;
    this.processo_listar = user.scope?.indexOf('pr_l') !== -1;
    this.oficio_incluir = user.scope?.indexOf('of_i') !== -1;
    this.oficio_deferir = user.scope?.indexOf('of_df') !== -1;
    this.oficio_indeferir = user.scope?.indexOf('of_id') !== -1;
    this.oficio_vizualizar = user.scope?.indexOf('of_l') !== -1;
    this.oficio_listar = user.scope?.indexOf('of_l') !== -1;
    this.oficio_alterar = user.scope?.indexOf('of_a') !== -1;
    this.historico_incluir = user.scope?.indexOf('hi_i') !== -1;
    this.historico_alterar = user.scope?.indexOf('hi_a') !== -1;
    this.historico_apagar = user.scope?.indexOf('hi_d') !== -1;
    this.agenda_incluir = user.scope?.indexOf('ag_i') !== -1;
    this.agenda_alterar = user.scope?.indexOf('ag_a') !== -1;
    this.agenda_apagar = user.scope?.indexOf('ag_d') !== -1;
    this.processo_apagar = user.scope?.indexOf('pr_d') !== -1;
    this.oficio_apagar = user.scope?.indexOf('of_d') !== -1;
    this.assunto_apagar = user.scope?.indexOf('as_d') !== -1;
    this.municipio_apagar = user.scope?.indexOf('mu_d') !== -1;
    this.agenda_visualizar = user.scope?.indexOf('ag_v') !== -1;
    this.agenda2_incluir = user.scope?.indexOf('a2_i') !== -1;
    this.agenda2_alterar = user.scope?.indexOf('a2_a') !== -1;
    this.agenda2_apagar = user.scope?.indexOf('a2_d') !== -1;
    this.agenda2_visualizar = user.scope?.indexOf('a2_v') !== -1;
    this.telefone_incluir = user.scope?.indexOf('te_i') !== -1;
    this.telefone_alterar = user.scope?.indexOf('te_a') !== -1;
    this.telefone_apagar = user.scope?.indexOf('te_d') !== -1;
    this.telefone_listar = user.scope?.indexOf('te_l') !== -1;
    this.contabilidade_incluir = user.scope?.indexOf('co_i') !== -1;
    this.contabilidade_alterar = user.scope?.indexOf('co_a') !== -1;
    this.contabilidade_apagar = user.scope?.indexOf('co_d') !== -1;
    this.contabilidade_listar = user.scope?.indexOf('co_l') !== -1;
    this.contatos_exibir = user.scope?.indexOf('ct_e') !== -1;
    this.contatos_gerenciar = user.scope?.indexOf('ct_g') !== -1;
    this.configuracao_apagar = user.scope?.indexOf('cf_d') !== -1;
    this.emenda_incluir = user.scope?.indexOf('em_i') !== -1;
    this.emenda_alterar = user.scope?.indexOf('em_a') !== -1;
    this.emenda_apagar = user.scope?.indexOf('em_d') !== -1;
    this.emenda_listar = user.scope?.indexOf('em_l') !== -1;
    this.historicoemenda_incluir = user.scope?.indexOf('he_i') !== -1;
    this.historicoemenda_alterar = user.scope?.indexOf('he_a') !== -1;
    this.historicoemenda_apagar = user.scope?.indexOf('he_d') !== -1;
    this.historicoemenda_listar = user.scope?.indexOf('he_l') !== -1;
    this.cadastrosigilo_incluir = user.scope?.indexOf('cs_i') !== -1;
    this.cadastrosigilo_alterar = user.scope?.indexOf('cs_a') !== -1;
    this.cadastrosigilo_apagar = user.scope?.indexOf('cs_d') !== -1;
    this.cadastrosigilo_listar = user.scope?.indexOf('cs_l') !== -1;
    this.proposicao_incluir = user.scope?.indexOf('pp_i') !== -1;
    this.proposicao_alterar = user.scope?.indexOf('pp_a') !== -1;
    this.proposicao_apagar = user.scope?.indexOf('pp_d') !== -1;
    this.proposicao_listar = user.scope?.indexOf('pp_l') !== -1;
    this.andamentoproposicao_incluir = user.scope?.indexOf('ap_i') !== -1;
    this.andamentoproposicao_alterar = user.scope?.indexOf('ap_a') !== -1;
    this.andamentoproposicao_apagar = user.scope?.indexOf('ap_d') !== -1;
    this.andamentoproposicao_listar = user.scope?.indexOf('ap_l') !== -1;
    this.passagemaerea_incluir = user.scope?.indexOf('pa_i') !== -1;
    this.passagemaerea_alterar = user.scope?.indexOf('pa_a') !== -1;
    this.passagemaerea_apagar = user.scope?.indexOf('pa_d') !== -1;
    this.passagemaerea_listar = user.scope?.indexOf('pa_l') !== -1;
    this.sms_incluir = user.scope?.indexOf('sm_i') !== -1;
    this.arquivos_anexar = user.scope?.indexOf('ar_a') !== -1;
    this.arquivos_baixar = user.scope?.indexOf('ar_b') !== -1;
    this.arquivos_apagar = user.scope?.indexOf('ar_d') !== -1;
    this.parlamentar_sms_ativo = user.parlamentar_sms_ativo === 1;
    this.parlamentar_arquivo_ativo = user.parlamentar_arquivo_ativo === 1;
    this._versao = +user.parlamentar_versao!;
    this.parlamentar_id = user.parlamentar_id!;
    this.parlamentar_nome = user.parlamentar_nome!;
    this.usuario_email = user.usuario_email!;
    this.usuario_id = user.usuario_id!;
    this.usuario_local_id = user.usuario_local_id!;
    this.usuario_nome = user.usuario_nome!;
    this.usuario_principal_sn = user.usuario_principal_sn === 1;
    this.usuario_responsavel_sn = user.usuario_responsavel_sn === 1;
    this.permissoes_carregadas = true;
    this.mostraMenuEmiter(true);
    if (!this.parlamentar_arquivo_ativo) {
      this.arquivos_anexar = false;
      this.arquivos_baixar = false;
      this.arquivos_apagar = false;
    }
    this.versao = Versao.getVersao(+user.parlamentar_versao!);
    this.versao_id = +user.parlamentar_versao!;
  }

  cancelaPermissoes() {
    this.agenda2 = false;
    this.agenda = false;
    this.andamentoproposicao = false;
    this.arquivos = false;
    this.assunto = false;
    this.cadastro = false;
    this.configuracao = false;
    this.contabilidade = false;
    this.cadastrosigilo = false;
    this.contatos = false;
    this.emenda = false;
    this.historicoemenda = false;
    this.historico = false;
    this.municipio = false;
    this.oficio = false;
    this.passagemaerea = false;
    this.proposicao = false;
    this.processo = false;
    this.solicitacao = false;
    this.sms = false;
    this.telefone = false;
    this.usuario = false;
    this.configuracao_incluir = false;
    this.configuracao_alterar = false;
    this.assunto_incluir = false;
    this.assunto_alterar = false;
    this.municipio_incluir = false;
    this.municipio_alterar = false;
    this.usuario_incluir = false;
    this.usuario_alterar = false;
    this.usuario_apagar = false;
    this.cadastro_incluir = false;
    this.cadastro_alterar = false;
    this.cadastro_apagar = false;
    this.cadastro_listar = false;
    this.solicitacao_incluir = false;
    this.solicitacao_alterar = false;
    this.solicitacao_apagar = false;
    this.solicitacao_listar = false;
    this.solicitacao_analisar = false;
    this.processo_deferir = false;
    this.processo_indeferir = false;
    this.processo_listar = false;
    this.oficio_incluir = false;
    this.oficio_deferir = false;
    this.oficio_indeferir = false;
    this.oficio_vizualizar = false;
    this.oficio_listar = false;
    this.oficio_alterar = false;
    this.historico_incluir = false;
    this.historico_alterar = false;
    this.historico_apagar = false;
    this.agenda_incluir = false;
    this.agenda_alterar = false;
    this.agenda_apagar = false;
    this.processo_apagar = false;
    this.oficio_apagar = false;
    this.assunto_apagar = false;
    this.municipio_apagar = false;
    this.agenda_visualizar = false;
    this.agenda2_incluir = false;
    this.agenda2_alterar = false;
    this.agenda2_apagar = false;
    this.agenda2_visualizar = false;
    this.telefone_incluir = false;
    this.telefone_alterar = false;
    this.telefone_apagar = false;
    this.telefone_listar = false;
    this.contabilidade_incluir = false;
    this.contabilidade_alterar = false;
    this.contabilidade_apagar = false;
    this.contabilidade_listar = false;
    this.contatos_exibir = false;
    this.contatos_gerenciar = false;
    this.configuracao_apagar = false;
    this.emenda_incluir = false;
    this.emenda_alterar = false;
    this.emenda_apagar = false;
    this.emenda_listar = false;
    this.historicoemenda_incluir = false;
    this.historicoemenda_alterar = false;
    this.historicoemenda_apagar = false;
    this.historicoemenda_listar = false;
    this.cadastrosigilo_incluir = false;
    this.cadastrosigilo_alterar = false;
    this.cadastrosigilo_apagar = false;
    this.cadastrosigilo_listar = false;
    this.proposicao_incluir = false;
    this.proposicao_alterar = false;
    this.proposicao_apagar = false;
    this.proposicao_listar = false;
    this.andamentoproposicao_incluir = false;
    this.andamentoproposicao_alterar = false;
    this.andamentoproposicao_apagar = false;
    this.andamentoproposicao_listar = false;
    this.passagemaerea_incluir = false;
    this.passagemaerea_alterar = false;
    this.passagemaerea_apagar = false;
    this.passagemaerea_listar = false;
    this.sms_incluir = false;
    this.arquivos_anexar = false;
    this.arquivos_baixar = false;
    this.arquivos_apagar = false;
    this.versao = 0;
    this.permissoes_carregadas = false;
    this.mostraMenuEmiter(false);
  }

  checaPermissao(str: string): any {
    return this.currentUserSubject!.value.scope!.indexOf(str) !== -1;
  }

  autologin(): Observable<boolean> {
    return this.http.get<any>(this.urlService.autologin)
      .pipe(
        take(1),
        map(user => {
          if (user && user.token) {
            const arq = {
              'arquivo_ativo': user.arquivo_ativo,
              'arquivo_cota': user.arquivo_cota,
              'cota_disponivel': user.cota_disponivel,
              'cota_utilizada': user.cota_utilizada
            };
            sessionStorage.setItem('arquivo-permissoes', JSON.stringify(arq));
            delete user.arquivo_ativo;
            delete user.arquivo_cota;
            delete user.cota_disponivel;
            delete user.cota_utilizada;
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.carregaPermissoes(user);
            this.currentUserSubject?.next(user);
            return true;
          } else {
          this.cancelaPermissoes();
          return false;
        }
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.clear();
    sessionStorage.clear();
    // @ts-ignore
    this.currentUserSubject!.next(null);
    this.cancelaPermissoes();
  }
}
