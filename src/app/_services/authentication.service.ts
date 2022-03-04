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
  private acessoStr = [
    'cf_i',
    'cf_a',
    'as_i',
    'as_a',
    'mu_i',
    'mu_a',
    'us_i',
    'us_a',
    'us_d',
    'ca_i',
    'ca_a',
    'ca_d',
    'ca_l',
    'so_i',
    'so_a',
    'so_d',
    'so_l',
    'pr_df',
    'pr_if',
    'pr_l',
    'of_i',
    'of_df',
    'of_id',
    'of_l',
    'of_a',
    'hi_i',
    'hi_a',
    'hi_d',
    'ag_i',
    'ag_a',
    'ag_d',
    'pr_d',
    'of_d',
    'as_d',
    'mu_d',
    'ag_v',
    'a2_i',
    'a2_a',
    'a2_d',
    'a2_v',
    'te_i',
    'te_a',
    'te_d',
    'te_l',
    'co_i',
    'co_a',
    'co_d',
    'co_l',
    'ct_e',
    'ct_g',
    'cf_d',
    'em_i',
    'em_a',
    'em_d',
    'em_l',
    'he_i',
    'he_a',
    'he_d',
    'he_l',
    'cs_i',
    'cs_a',
    'cs_d',
    'cs_l',
    'pp_i',
    'pp_a',
    'pp_d',
    'pp_l',
    'ap_i',
    'ap_a',
    'ap_d',
    'ap_l',
    'pa_i',
    'pa_a',
    'pa_d',
    'pa_l',
    'sm_i',
    'ar_a',
    'ar_b',
    'ar_d',
    'ur_s',
    'so_an'
  ];
  private acessoRule = [
    "a2",
    "ag",
    "ap",
    "ar",
    "as",
    "ca",
    "cf",
    "co",
    "cs",
    "ct",
    "em",
    "he",
    "hi",
    "mu",
    "of",
    "pa",
    "pp",
    "pr",
    "so",
    "sm",
    "te",
    "us",
    "up",
    "ur"
  ];
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
  public userRules: any[];
  public userScops: any[];


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
      // this.carregaPermissoes1(this.currentUserSubject.value.usuario_regras);
      this.carregaPermissoes2(this.currentUserSubject.value);
      // this.carregaPermissoes3(this.currentUserSubject.value.usuario_acesso);
      this.currentUserSubject!.next(this.currentUserSubject.value);
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

  descreveAcesso(valor: string): string[] {
    const n = valor.length;
    let r: string[] = [];
    for (let i = 0; i < n; i++) {
      if (valor[i] === '1') {
        r.push(this.acessoStr[i]);
      }
    }
    return r;
  }

  descreveRule(valor: string): string[] {
    const n = valor.length;
    let r: string[] = [];
    for (let i = 0; i < n; i++) {
      if (valor[i] === '1') {
        r.push(this.acessoRule[i]);
      }
    }
    return r;
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
    //return this.http.post<User>(this.urlService.login, {username, password}, httpOptions)
    return this.http.get<any>(this.urlService.login, httpOptions)
      .pipe(
        take(1),
        map(user => {
          if (user && user.token) {
            const arq = {
              'config_arquivo_ativo': user.config_arquivo_ativo,
              'config_arquivo_cota': user.config_arquivo_cota,
              'config_cota_disponivel': user.config_cota_disponivel,
              'config_cota_utilizada': user.config_cota_utilizada
            };
            sessionStorage.setItem('arquivo-permissoes', JSON.stringify(arq));
            delete user.config_arquivo_ativo;
            delete user.config_arquivo_cota;
            delete user.config_cota_disponivel;
            delete user.config_cota_utilizada;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('access_token', user.token);
            // this.carregaPermissoes(user);
            // this.carregaPermissoes1(user.usuario_regras);
            this.carregaPermissoes2(user);
            // this.carregaPermissoes3(user.usuario_acesso);
            // this.currentUserSubject!.next(user);
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
    this.solicitacao_analisar = user.scope?.indexOf('so_an') !== -1;
    this.parlamentar_sms_ativo = user.parlamentar_sms_ativo === 1;
    this.parlamentar_arquivo_ativo = user.parlamentar_arquivo_ativo === 1;
    this._versao = +user.parlamentar_versao!;
    this.parlamentar_id = user.parlamentar_id!;
    this.parlamentar_nome = user.parlamentar_nome!;
    this.usuario_email = user.usuario_email!;
    this.usuario_id = user.usuario_id!;
    this.usuario_local_id = user.usuario_local_id!;
    this.usuario_nome = user.usuario_nome!;
    this.usuario_principal_sn = +user.usuario_principal_sn === 1;
    this.usuario_responsavel_sn = (+user.usuario_responsavel_sn === 1 ||  user.scope?.indexOf('us_r') !== -1);
    // this.usuario_responsavel_sn = user.scope?.indexOf('us_r') !== -1; // teste

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

  carregaPermissoes1(rule: string, user: User): void {
    const regra = this.descreveRule(rule);
    // console.log('carregaPermissoes1', regra);
    this.agenda2 = regra?.indexOf('a2') !== -1;
    this.agenda = regra?.indexOf('ag') !== -1;
    this.andamentoproposicao = regra?.indexOf('ap') !== -1;
    this.arquivos = regra?.indexOf('ar') !== -1;
    this.assunto = regra?.indexOf('as') !== -1;
    this.cadastro = regra?.indexOf('ca') !== -1;
    this.configuracao = regra?.indexOf('cf') !== -1;
    this.contabilidade = regra?.indexOf('co') !== -1;
    this.cadastrosigilo = regra?.indexOf('cs') !== -1;
    this.contatos = regra?.indexOf('ct') !== -1;
    this.emenda = regra?.indexOf('em') !== -1;
    this.historicoemenda = regra?.indexOf('he') !== -1;
    this.historico = regra?.indexOf('hi') !== -1;
    this.municipio = regra?.indexOf('mu') !== -1;
    this.oficio = regra?.indexOf('of') !== -1;
    this.passagemaerea = regra?.indexOf('pa') !== -1;
    this.proposicao = regra?.indexOf('pp') !== -1;
    this.processo = regra?.indexOf('pr') !== -1;
    this.solicitacao = regra?.indexOf('so') !== -1;
    this.sms = regra?.indexOf('sm') !== -1;
    this.telefone = regra?.indexOf('te') !== -1;
    this.usuario = regra?.indexOf('us') !== -1;
    this.usuario_principal_sn = regra?.indexOf('up') !== -1;
    this.usuario_responsavel_sn = regra?.indexOf('ur') !== -1;
    this.userScops = regra;
    this.carregaPermissoes3(user.usuario_acesso);
  }

  carregaPermissoes2(user): void {
    // console.log('carregaPermissoes2');
/*    this.agenda2 = user.rule?.indexOf('a2') !== -1;
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
    this.usuario_principal_sn = user.rule?.indexOf('up') !== -1;
    this.usuario_responsavel_sn = user.rule?.indexOf('ur') !== -1;*/

  // this.parlamentar_sms_ativo = user.parlamentar_sms_ativo === 1;
  // this.parlamentar_arquivo_ativo = user.parlamentar_arquivo_ativo === 1;
  this._versao = +user.parlamentar_versao!;
  this.parlamentar_id = user.parlamentar_id!;
  this.parlamentar_nome = user.parlamentar_nome!;
  // this.usuario_email = user.usuario_email!;
  this.usuario_id = user.usuario_id!;
  this.usuario_local_id = user.usuario_local_id!;
  this.usuario_nome = user.usuario_nome!;
  // this.usuario_principal_sn = +user.usuario_principal_sn === 1;
  // this.usuario_responsavel_sn = +user.usuario_responsavel_sn === 1;
    this.versao = Versao.getVersao(+user.parlamentar_versao!);
    this.versao_id = +user.parlamentar_versao!;
    this.carregaPermissoes1(user.usuario_regras, user);
  }

  carregaPermissoes3(scope: string) {
    const acesso = this.descreveAcesso(scope);
    console.log('carregaPermissoes3', acesso);
    this.configuracao_incluir = acesso.indexOf('cf_i') !== -1;
    this.configuracao_alterar = acesso.indexOf('cf_a') !== -1;
    this.assunto_incluir = acesso.indexOf('as_i') !== -1;
    this.assunto_alterar = acesso.indexOf('as_a') !== -1;
    this.municipio_incluir = acesso.indexOf('mu_i') !== -1;
    this.municipio_alterar = acesso.indexOf('mu_a') !== -1;
    this.usuario_incluir = acesso.indexOf('us_i') !== -1;
    this.usuario_alterar = acesso.indexOf('us_a') !== -1;
    this.usuario_apagar = acesso.indexOf('us_d') !== -1;
    this.cadastro_incluir = acesso.indexOf('ca_i') !== -1;
    this.cadastro_alterar = acesso.indexOf('ca_a') !== -1;
    this.cadastro_apagar = acesso.indexOf('ca_d') !== -1;
    this.cadastro_listar = acesso.indexOf('ca_l') !== -1;
    this.solicitacao_incluir = acesso.indexOf('so_i') !== -1;
    this.solicitacao_alterar = acesso.indexOf('so_a') !== -1;
    this.solicitacao_apagar = acesso.indexOf('so_d') !== -1;
    this.solicitacao_listar = acesso.indexOf('so_l') !== -1;
    this.solicitacao_analisar = acesso.indexOf('so_n') !== -1;
    this.processo_deferir = acesso.indexOf('pr_df') !== -1;
    this.processo_indeferir = acesso.indexOf('pr_if') !== -1;
    this.processo_listar = acesso.indexOf('pr_l') !== -1;
    this.oficio_incluir = acesso.indexOf('of_i') !== -1;
    this.oficio_deferir = acesso.indexOf('of_df') !== -1;
    this.oficio_indeferir = acesso.indexOf('of_id') !== -1;
    this.oficio_vizualizar = acesso.indexOf('of_l') !== -1;
    this.oficio_listar = acesso.indexOf('of_l') !== -1;
    this.oficio_alterar = acesso.indexOf('of_a') !== -1;
    this.historico_incluir = acesso.indexOf('hi_i') !== -1;
    this.historico_alterar = acesso.indexOf('hi_a') !== -1;
    this.historico_apagar = acesso.indexOf('hi_d') !== -1;
    this.agenda_incluir = acesso.indexOf('ag_i') !== -1;
    this.agenda_alterar = acesso.indexOf('ag_a') !== -1;
    this.agenda_apagar = acesso.indexOf('ag_d') !== -1;
    this.processo_apagar = acesso.indexOf('pr_d') !== -1;
    this.oficio_apagar = acesso.indexOf('of_d') !== -1;
    this.assunto_apagar = acesso.indexOf('as_d') !== -1;
    this.municipio_apagar = acesso.indexOf('mu_d') !== -1;
    this.agenda_visualizar = acesso.indexOf('ag_v') !== -1;
    this.agenda2_incluir = acesso.indexOf('a2_i') !== -1;
    this.agenda2_alterar = acesso.indexOf('a2_a') !== -1;
    this.agenda2_apagar = acesso.indexOf('a2_d') !== -1;
    this.agenda2_visualizar = acesso.indexOf('a2_v') !== -1;
    this.telefone_incluir = acesso.indexOf('te_i') !== -1;
    this.telefone_alterar = acesso.indexOf('te_a') !== -1;
    this.telefone_apagar = acesso.indexOf('te_d') !== -1;
    this.telefone_listar = acesso.indexOf('te_l') !== -1;
    this.contabilidade_incluir = acesso.indexOf('co_i') !== -1;
    this.contabilidade_alterar = acesso.indexOf('co_a') !== -1;
    this.contabilidade_apagar = acesso.indexOf('co_d') !== -1;
    this.contabilidade_listar = acesso.indexOf('co_l') !== -1;
    this.contatos_exibir = acesso.indexOf('ct_e') !== -1;
    this.contatos_gerenciar = acesso.indexOf('ct_g') !== -1;
    this.configuracao_apagar = acesso.indexOf('cf_d') !== -1;
    this.emenda_incluir = acesso.indexOf('em_i') !== -1;
    this.emenda_alterar = acesso.indexOf('em_a') !== -1;
    this.emenda_apagar = acesso.indexOf('em_d') !== -1;
    this.emenda_listar = acesso.indexOf('em_l') !== -1;
    this.historicoemenda_incluir = acesso.indexOf('he_i') !== -1;
    this.historicoemenda_alterar = acesso.indexOf('he_a') !== -1;
    this.historicoemenda_apagar = acesso.indexOf('he_d') !== -1;
    this.historicoemenda_listar = acesso.indexOf('he_l') !== -1;
    this.cadastrosigilo_incluir = acesso.indexOf('cs_i') !== -1;
    this.cadastrosigilo_alterar = acesso.indexOf('cs_a') !== -1;
    this.cadastrosigilo_apagar = acesso.indexOf('cs_d') !== -1;
    this.cadastrosigilo_listar = acesso.indexOf('cs_l') !== -1;
    this.proposicao_incluir = acesso.indexOf('pp_i') !== -1;
    this.proposicao_alterar = acesso.indexOf('pp_a') !== -1;
    this.proposicao_apagar = acesso.indexOf('pp_d') !== -1;
    this.proposicao_listar = acesso.indexOf('pp_l') !== -1;
    this.andamentoproposicao_incluir = acesso.indexOf('ap_i') !== -1;
    this.andamentoproposicao_alterar = acesso.indexOf('ap_a') !== -1;
    this.andamentoproposicao_apagar = acesso.indexOf('ap_d') !== -1;
    this.andamentoproposicao_listar = acesso.indexOf('ap_l') !== -1;
    this.passagemaerea_incluir = acesso.indexOf('pa_i') !== -1;
    this.passagemaerea_alterar = acesso.indexOf('pa_a') !== -1;
    this.passagemaerea_apagar = acesso.indexOf('pa_d') !== -1;
    this.passagemaerea_listar = acesso.indexOf('pa_l') !== -1;
    this.sms_incluir = acesso.indexOf('sm_i') !== -1;
    this.arquivos_anexar = acesso.indexOf('ar_a') !== -1;
    this.arquivos_baixar = acesso.indexOf('ar_b') !== -1;
    this.arquivos_apagar = acesso.indexOf('ar_d') !== -1;
    this.solicitacao_analisar = acesso.indexOf('so_an') !== -1;
    this.usuario_responsavel_sn = (this.usuario_responsavel_sn ||  acesso.indexOf('us_r') !== -1);
    this.userRules = acesso;
    // JSON.parse(<string>localStorage.getItem('currentUser'))
    this.currentUserSubject!.next(JSON.parse(<string>localStorage.getItem('currentUser')));
    this.mostraMenuEmiter(true);
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
    this.versao_id = 0;
    this.userRules = [];
    this.userScops = [];
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
              'config_arquivo_ativo': user.config_arquivo_ativo,
              'config_arquivo_cota': user.config_arquivo_cota,
              'config_cota_disponivel': user.config_cota_disponivel,
              'config_cota_utilizada': user.config_cota_utilizada
            };
            sessionStorage.setItem('arquivo-permissoes', JSON.stringify(arq));
            delete user.config_arquivo_ativo;
            delete user.config_arquivo_cota;
            delete user.config_cota_disponivel;
            delete user.config_cota_utilizada;
            localStorage.removeItem('access_token');
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('access_token', user.token);
            // this.carregaPermissoes(user);
            // this.carregaPermissoes1(user.usuario_regras);
            this.carregaPermissoes2(user);
            // this.carregaPermissoes3(user.usuario_acesso);
            console.log('autologin', user);
            this.currentUserSubject?.next(user);
            return true;
          } else {
          this.cancelaPermissoes();
          return false;
        }
      }));
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    localStorage.clear();
    sessionStorage.clear();
    // @ts-ignore
    this.currentUserSubject!.next(null);
    this.cancelaPermissoes();
  }
}
