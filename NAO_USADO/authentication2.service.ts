/*
import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of, pipe, Subject, Subscription } from "rxjs";
import { catchError, map, take } from "rxjs/operators";

import { User } from "../_models";
import { UrlService } from "../_services";
import { Versao } from "./versao";
import { VersaoService } from "./versao.service";
// import { AutenticacaoService } from "./autenticacao.service";
import { DispositivoService } from "./dispositivo.service";
// import { AutorizaService } from "./autoriza.service";
import { ArquivoLoginService } from "../arquivo/_services";
import { AuthService } from "./auth.service";
import { acessoRule, acessoStr } from "../_models/acesso-constantes";


@Injectable({ providedIn: "root" })

export class AuthenticationService2 {
  public a = 0;
  // public _versao = 0; // 1-COMPLETO / 2-SIMPLES / 3-LITE
  public _versao = 0;	// 1-FEDERAL COMPLETO / 2-ESTADUAL COMPLETA / 3-VEREADOR / 4-FEDERAL SIMPLES / 5-ESTADUAL SIMPLES
  public agenda = false;
  public agenda2 = false;
  public agenda2_alterar = false;
  public agenda2_apagar = false;
  public agenda2_incluir = false;
  public agenda2_visualizar = false;
  public agenda_alterar = false;
  public agenda_apagar = false;
  public agenda_incluir = false;
  public agenda_visualizar = false;
  public andamentoproposicao = false;
  public andamentoproposicao_alterar = false;
  public andamentoproposicao_apagar = false;
  public andamentoproposicao_incluir = false;
  public andamentoproposicao_listar = false;
  public arquivos = false;
  public arquivos_anexar = false;
  public arquivos_apagar = false;
  public arquivos_baixar = false;
  public assunto = false;
  public assunto_alterar = false;
  public assunto_apagar = false;
  public assunto_incluir = false;
  public cadastro = false;
  public cadastro_alterar = false;
  public cadastro_apagar = false;
  public cadastro_incluir = false;
  public cadastro_listar = false;
  public cadastrosigilo = false;
  public cadastrosigilo_alterar = false;
  public cadastrosigilo_apagar = false;
  public cadastrosigilo_incluir = false;
  public cadastrosigilo_listar = false;
  public config_arquivo_ativo = false;
  public config_arquivo_cota = 0;
  public config_cota_disponivel = 0;
  public config_cota_utilizada = 0;
  public configuracao = false;
  public configuracao_alterar = false;
  public configuracao_apagar = false;
  public configuracao_incluir = false;
  public contabilidade = false;
  public contabilidade_alterar = false;
  public contabilidade_apagar = false;
  public contabilidade_incluir = false;
  public contabilidade_listar = false;
  public contatos = false;
  public contatos_exibir = false;
  public contatos_gerenciar = false;
  public currentUser: User | null = null;
  public dispositivo: string = null;
  public emenda = false;
  public emenda_alterar = false;
  public emenda_apagar = false;
  public emenda_incluir = false;
  public emenda_listar = false;
  public historico = false;
  public historico_alterar = false;
  public historico_apagar = false;
  public historico_incluir = false;
  public historico_solicitacao = false;
  public historico_solicitacao_alterar = false;
  public historico_solicitacao_apagar = false;
  public historico_solicitacao_incluir = false;
  public historicoemenda = false;
  public historicoemenda_alterar = false;
  public historicoemenda_apagar = false;
  public historicoemenda_incluir = false;
  public historicoemenda_listar = false;
  public mensagem = false;
  public mensagem_enviar = false;
  public municipio = false;
  public municipio_alterar = false;
  public municipio_apagar = false;
  public municipio_incluir = false;
  public oficio = false;
  public oficio_alterar = false;
  public oficio_apagar = false;
  public oficio_deferir = false;
  public oficio_incluir = false;
  public oficio_indeferir = false;
  public oficio_listar = false;
  public oficio_vizualizar = false;
  public parlamentar_arquivo_ativo = false;
  public parlamentar_id = 0;
  public parlamentar_nome = "";
  public passagemaerea = false;
  public passagemaerea_alterar = false;
  public passagemaerea_apagar = false;
  public passagemaerea_incluir = false;
  public passagemaerea_listar = false;
  public permissoes_carregadas = false;
  public processo = false;
  public processo_analisar = false;
  public processo_apagar = false;
  public processo_deferir = false;
  public processo_indeferir = false;
  public processo_listar = false;
  public proposicao = false;
  public proposicao_alterar = false;
  public proposicao_apagar = false;
  public proposicao_incluir = false;
  public proposicao_listar = false;
  public sms = false;
  public sms_incluir = false;
  public solicitacao = false;
  public solicitacaoVersao = 0;
  public solicitacao_alterar = false;
  public solicitacao_analisar = false;
  public solicitacao_apagar = false;
  public solicitacao_incluir = false;
  public solicitacao_listar = false;
  public tarefa = false;
  public telefone = false;
  public telefone_alterar = false;
  public telefone_apagar = false;
  public telefone_incluir = false;
  public telefone_listar = false;
  public userRules: string[];
  public userScops: string[];
  public usuario = false;
  public usuario_alterar = false;
  public usuario_apagar = false;
  public usuario_email = "";
  public usuario_id = 0;
  public usuario_incluir = false;
  public usuario_local_id = 0;
  public usuario_nome = "";
  public usuario_principal_sn = false;
  public usuario_responsavel_sn = false;
  public usuario_uuid = "";
  public versao: any = null;
  public versaoN = 0; // 1-FEDERAL COMPLETO / 2-ESTADUAL COMPLETA / 3-VEREADOR / 4-FEDERAL SIMPLES / 5-ESTADUAL SIMPLES
  public versao_id = 0;

  public sub: Subscription[] = [];
  private mostraMenuSource = new BehaviorSubject<boolean>(false);
  public mostraMenu$ = this.mostraMenuSource.asObservable();

  constructor(
    private ath: AuthService,
    private ds: DispositivoService,
    private versaoService: VersaoService,
    private as: ArquivoLoginService,
    private urlService: UrlService,
    private http: HttpClient,
    private router: Router
  ) {
    console.log('AuthenticationService constructor 0');
    this.sub.push(this.ath.logado$.subscribe((n) => {
      console.log('AuthenticationService constructor 1', n);
      if (n === 1) {
        this.as.verificaPermissoes();
        this.carregaPermissoes(JSON.parse(<string>localStorage.getItem("currentUser")));
      }
      if (n === 2) {
        this.carregaPermissoes(JSON.parse(<string>localStorage.getItem("currentUser")));
      }
      if (n === 3) {
        this.logout();
      }
    }));
  }

  public get currentUserValue() {
    return this.currentUser;
  }

  public get mostraMenu() {
    return this.mostraMenu$;
  }

  public mostraMenuEmiter(valor: boolean) {
    this.mostraMenuSource.next(valor);
  }

  descreveAcesso(valor: string): string[] {
    const n = valor.length;
    const r: string[] = [];
    for (let i = 0; i < n; i++) {
      if (valor[i] === "1") {
        r.push(acessoStr[i]);
      }
    }
    return r;
  }

  descreveRule(valor: string): string[] {
    const n = valor.length;
    const r: string[] = [];
    for (let i = 0; i < n; i++) {
      if (valor[i] === "1") {
        r.push(acessoRule[i]);
      }
    }
    r.push("tf");
    return r;
  }

  carregaPermissoes(user): void {
    const regra = this.descreveRule(user.usuario_regras);
    const acesso = this.descreveAcesso(user.usuario_acesso);
    this.ds.dispositivo = user.dispositivo;

    this._versao = +user.gabinete_id!;
    this.agenda = regra?.indexOf("ag") !== -1;
    this.agenda2 = regra?.indexOf("a2") !== -1;
    this.agenda2_alterar = acesso.indexOf("a2_a") !== -1;
    this.agenda2_apagar = acesso.indexOf("a2_d") !== -1;
    this.agenda2_incluir = acesso.indexOf("a2_i") !== -1;
    this.agenda2_visualizar = acesso.indexOf("a2_v") !== -1;
    this.agenda_alterar = acesso.indexOf("ag_a") !== -1;
    this.agenda_apagar = acesso.indexOf("ag_d") !== -1;
    this.agenda_incluir = acesso.indexOf("ag_i") !== -1;
    this.agenda_visualizar = acesso.indexOf("ag_v") !== -1;
    this.andamentoproposicao = regra?.indexOf("ap") !== -1;
    this.andamentoproposicao_alterar = acesso.indexOf("ap_a") !== -1;
    this.andamentoproposicao_apagar = acesso.indexOf("ap_d") !== -1;
    this.andamentoproposicao_incluir = acesso.indexOf("ap_i") !== -1;
    this.andamentoproposicao_listar = acesso.indexOf("ap_l") !== -1;
    this.assunto = regra?.indexOf("as") !== -1;
    this.assunto_alterar = acesso.indexOf("as_a") !== -1;
    this.assunto_apagar = acesso.indexOf("as_d") !== -1;
    this.assunto_incluir = acesso.indexOf("as_i") !== -1;
    this.cadastro = regra?.indexOf("ca") !== -1;
    this.cadastro_alterar = acesso.indexOf("ca_a") !== -1;
    this.cadastro_apagar = acesso.indexOf("ca_d") !== -1;
    this.cadastro_incluir = acesso.indexOf("ca_i") !== -1;
    this.cadastro_listar = acesso.indexOf("ca_l") !== -1;
    this.cadastrosigilo = regra?.indexOf("cs") !== -1;
    this.cadastrosigilo_alterar = acesso.indexOf("cs_a") !== -1;
    this.cadastrosigilo_apagar = acesso.indexOf("cs_d") !== -1;
    this.cadastrosigilo_incluir = acesso.indexOf("cs_i") !== -1;
    this.cadastrosigilo_listar = acesso.indexOf("cs_l") !== -1;
    if (!sessionStorage.getItem("arquivo-permissoes")) {
      this.config_arquivo_ativo = user.config_arquivo_ativo;
      this.config_arquivo_cota = +user.config_arquivo_cota;
      this.config_cota_disponivel = +user.config_cota_disponivel;
      this.config_cota_utilizada = +user.config_cota_utilizada;
      const arq = {
        "config_arquivo_ativo": this.config_arquivo_ativo,
        "config_arquivo_cota": this.config_arquivo_cota,
        "config_cota_disponivel": this.config_cota_disponivel,
        "config_cota_utilizada": this.config_cota_utilizada
      };
      sessionStorage.setItem("arquivo-permissoes", JSON.stringify(arq));
    } else {
      const arq = JSON.parse(sessionStorage.getItem("arquivo-permissoes"))
      this.config_arquivo_ativo = arq.config_arquivo_ativo;
      this.config_arquivo_cota = +arq.config_arquivo_cota;
      this.config_cota_disponivel = +arq.config_cota_disponivel;
      this.config_cota_utilizada = +arq.config_cota_utilizada;
    }
    this.arquivos = (regra?.indexOf("ar") !== -1 && this.config_arquivo_ativo);
    this.arquivos_anexar = (acesso.indexOf("ar_a") !== -1 && this.config_arquivo_ativo);
    this.arquivos_apagar = (acesso.indexOf("ar_d") !== -1 && this.config_arquivo_ativo);
    this.arquivos_baixar = (acesso.indexOf("ar_b") !== -1 && this.config_arquivo_ativo);
    this.configuracao = regra?.indexOf("cf") !== -1;
    this.configuracao_alterar = acesso.indexOf("cf_a") !== -1;
    this.configuracao_apagar = acesso.indexOf("cf_d") !== -1;
    this.configuracao_incluir = acesso.indexOf("cf_i") !== -1;
    this.contabilidade = regra?.indexOf("co") !== -1;
    this.contabilidade_alterar = acesso.indexOf("co_a") !== -1;
    this.contabilidade_apagar = acesso.indexOf("co_d") !== -1;
    this.contabilidade_incluir = acesso.indexOf("co_i") !== -1;
    this.contabilidade_listar = acesso.indexOf("co_l") !== -1;
    this.contatos = regra?.indexOf("ct") !== -1;
    this.contatos_exibir = acesso.indexOf("ct_e") !== -1;
    this.contatos_gerenciar = acesso.indexOf("ct_g") !== -1;
    this.currentUser = user;
    this.dispositivo = user.dispositivo;
    this.emenda = regra?.indexOf("em") !== -1;
    this.emenda_alterar = acesso.indexOf("em_a") !== -1;
    this.emenda_apagar = acesso.indexOf("em_d") !== -1;
    this.emenda_incluir = acesso.indexOf("em_i") !== -1;
    this.emenda_listar = acesso.indexOf("em_l") !== -1;
    this.historico = regra?.indexOf("hi") !== -1;
    this.historico_alterar = acesso.indexOf("hi_a") !== -1;
    this.historico_apagar = acesso.indexOf("hi_d") !== -1;
    this.historico_incluir = acesso.indexOf("hi_i") !== -1;
    /!*
      this.historico_solicitacao_incluir = acesso.indexOf('hs_i') !== -1;
        this.historico_solicitacao_alterar = acesso.indexOf('hs_a') !== -1;
        this.historico_solicitacao_apagar = acesso.indexOf('hs_d') !== -1;
    *!/
    this.historico_solicitacao = true;
    this.historico_solicitacao_alterar = true;
    this.historico_solicitacao_apagar = true;
    this.historico_solicitacao_incluir = true;
    this.historicoemenda = regra?.indexOf("he") !== -1;
    this.historicoemenda_alterar = acesso.indexOf("he_a") !== -1;
    this.historicoemenda_apagar = acesso.indexOf("he_d") !== -1;
    this.historicoemenda_incluir = acesso.indexOf("he_i") !== -1;
    this.historicoemenda_listar = acesso.indexOf("he_l") !== -1;
    this.mensagem = true;
    this.mensagem_enviar = true;
    this.municipio = regra?.indexOf("mu") !== -1;
    this.municipio_alterar = acesso.indexOf("mu_a") !== -1;
    this.municipio_apagar = acesso.indexOf("mu_d") !== -1;
    this.municipio_incluir = acesso.indexOf("mu_i") !== -1;
    this.oficio = regra?.indexOf("of") !== -1;
    this.oficio_alterar = acesso.indexOf("of_a") !== -1;
    this.oficio_apagar = acesso.indexOf("of_d") !== -1;
    this.oficio_deferir = acesso.indexOf("of_df") !== -1;
    this.oficio_incluir = acesso.indexOf("of_i") !== -1;
    this.oficio_indeferir = acesso.indexOf("of_id") !== -1;
    this.oficio_listar = acesso.indexOf("of_l") !== -1;
    this.oficio_vizualizar = acesso.indexOf("of_l") !== -1;
    this.parlamentar_arquivo_ativo = (user.parlamentar_arquivo_ativo! === 1);
    this.parlamentar_id = +user.parlamentar_id!;
    this.parlamentar_nome = user.parlamentar_nome!;
    this.passagemaerea = regra?.indexOf("pa") !== -1;
    this.passagemaerea_alterar = acesso.indexOf("pa_a") !== -1;
    this.passagemaerea_apagar = acesso.indexOf("pa_d") !== -1;
    this.passagemaerea_incluir = acesso.indexOf("pa_i") !== -1;
    this.passagemaerea_listar = acesso.indexOf("pa_l") !== -1;
    this.permissoes_carregadas = true;
    this.processo = regra?.indexOf("pr") !== -1;
    this.processo_analisar = (acesso.indexOf("pr_df") !== -1 || acesso.indexOf("pr_if") !== -1 || regra?.indexOf("ur") !== -1 || regra?.indexOf("up") !== -1 || acesso.indexOf("us_r") !== -1);
    this.processo_apagar = acesso.indexOf("pr_d") !== -1;
    this.processo_deferir = acesso.indexOf("pr_df") !== -1;
    this.processo_indeferir = acesso.indexOf("pr_if") !== -1;
    this.processo_listar = acesso.indexOf("pr_l") !== -1;
    this.proposicao = regra?.indexOf("pp") !== -1;
    this.proposicao_alterar = acesso.indexOf("pp_a") !== -1;
    this.proposicao_apagar = acesso.indexOf("pp_d") !== -1;
    this.proposicao_incluir = acesso.indexOf("pp_i") !== -1;
    this.proposicao_listar = acesso.indexOf("pp_l") !== -1;
    this.sms = regra?.indexOf("sm") !== -1;
    this.sms_incluir = acesso.indexOf("sm_i") !== -1;
    this.solicitacao = regra?.indexOf("so") !== -1;
    this.solicitacaoVersao = +user.solicitacao_versao!;
    this.solicitacao_alterar = acesso.indexOf("so_a") !== -1;
    this.solicitacao_analisar = (acesso.indexOf("so_an") !== -1 || regra?.indexOf("ur") !== -1 || regra?.indexOf("up") !== -1 || acesso.indexOf("us_r") !== -1);
    this.solicitacao_apagar = (acesso.indexOf("so_d") !== -1 || regra?.indexOf("ur") !== -1 || regra?.indexOf("up") !== -1 || acesso.indexOf("us_r") !== -1);
    this.solicitacao_incluir = acesso.indexOf("so_i") !== -1;
    this.solicitacao_listar = acesso.indexOf("so_l") !== -1;
    this.tarefa = regra?.indexOf("tf") !== -1;
    this.telefone = regra?.indexOf("te") !== -1;
    this.telefone_alterar = acesso.indexOf("te_a") !== -1;
    this.telefone_apagar = acesso.indexOf("te_d") !== -1;
    this.telefone_incluir = acesso.indexOf("te_i") !== -1;
    this.telefone_listar = acesso.indexOf("te_l") !== -1;
    this.userRules = acesso;
    this.userScops = regra;
    this.usuario = regra?.indexOf("us") !== -1;
    this.usuario_alterar = acesso.indexOf("us_a") !== -1;
    this.usuario_apagar = acesso.indexOf("us_d") !== -1;
    this.usuario_email = user.usuario_email!;
    this.usuario_id = +user.usuario_id!;
    this.usuario_incluir = acesso.indexOf("us_i") !== -1;
    this.usuario_local_id = +user.usuario_local_id!;
    this.usuario_nome = user.usuario_nome!;
    this.usuario_principal_sn = regra?.indexOf("up") !== -1;
    this.usuario_responsavel_sn = (regra?.indexOf("ur") !== -1 || acesso.indexOf("us_r") !== -1 || regra?.indexOf("up") !== -1);
    this.usuario_uuid = user.usuario_uuid;
    this.versao = Versao.getVersao(+user.gabinete_id!);
    this.versaoN = +user.gabinete_id!;
    this.versao_id = +user.gabinete_id!;

    /!*this._versao = +user.gabinete_id!;
    this.dispositivo = user.dispositivo;
    this.currentUser = user;
    this.parlamentar_id = +user.parlamentar_id!;
    this.parlamentar_nome = user.parlamentar_nome!;
    this.parlamentar_arquivo_ativo = (user.parlamentar_arquivo_ativo! === 1);
    this.usuario_id = +user.usuario_id!;
    this.usuario_uuid = user.usuario_uuid;
    this.usuario_local_id = +user.usuario_local_id!;
    this.usuario_nome = user.usuario_nome!;
    this.usuario_email = user.usuario_email!;
    this.versao = Versao.getVersao(+user.gabinete_id!);
    this.versaoService.versao = +user.gabinete_id!;
    this.versaoService.powerUser = (regra?.indexOf("ur") !== -1 || regra?.indexOf("up") !== -1 || acesso.indexOf("us_r") !== -1);
    this.solicitacaoVersao = +user.solicitacao_versao!;
    this.versaoService.solicitacaoVersao = +user.solicitacao_versao!;
    this.versao_id = +user.gabinete_id!;
    this.versaoN = +user.gabinete_id!;
    if (!sessionStorage.getItem("arquivo-permissoes")) {
      this.config_arquivo_ativo = user.config_arquivo_ativo;
      this.config_arquivo_cota = +user.config_arquivo_cota;
      this.config_cota_disponivel = +user.config_cota_disponivel;
      this.config_cota_utilizada = +user.config_cota_utilizada;
      const arq = {
        "config_arquivo_ativo": this.config_arquivo_ativo,
        "config_arquivo_cota": this.config_arquivo_cota,
        "config_cota_disponivel": this.config_cota_disponivel,
        "config_cota_utilizada": this.config_cota_utilizada
      };
      sessionStorage.setItem("arquivo-permissoes", JSON.stringify(arq));
    } else {
      const arq = JSON.parse(sessionStorage.getItem("arquivo-permissoes"))
      this.config_arquivo_ativo = arq.config_arquivo_ativo;
      this.config_arquivo_cota = +arq.config_arquivo_cota;
      this.config_cota_disponivel = +arq.config_cota_disponivel;
      this.config_cota_utilizada = +arq.config_cota_utilizada;

    }

    this.agenda2 = regra?.indexOf("a2") !== -1;
    this.agenda = regra?.indexOf("ag") !== -1;
    this.andamentoproposicao = regra?.indexOf("ap") !== -1;
    this.arquivos = (regra?.indexOf("ar") !== -1 && this.config_arquivo_ativo);
    this.assunto = regra?.indexOf("as") !== -1;
    this.cadastro = regra?.indexOf("ca") !== -1;
    this.configuracao = regra?.indexOf("cf") !== -1;
    this.contabilidade = regra?.indexOf("co") !== -1;
    this.cadastrosigilo = regra?.indexOf("cs") !== -1;
    this.contatos = regra?.indexOf("ct") !== -1;
    this.emenda = regra?.indexOf("em") !== -1;
    this.historicoemenda = regra?.indexOf("he") !== -1;
    this.historico = regra?.indexOf("hi") !== -1;
    // this.historico_solicitacao = regra?.indexOf('hs') !== -1;
    this.historico_solicitacao = true;
    this.municipio = regra?.indexOf("mu") !== -1;
    this.oficio = regra?.indexOf("of") !== -1;
    this.passagemaerea = regra?.indexOf("pa") !== -1;
    this.proposicao = regra?.indexOf("pp") !== -1;
    this.processo = regra?.indexOf("pr") !== -1;
    this.solicitacao = regra?.indexOf("so") !== -1;
    this.sms = regra?.indexOf("sm") !== -1;
    this.telefone = regra?.indexOf("te") !== -1;
    this.usuario = regra?.indexOf("us") !== -1;
    this.usuario_principal_sn = regra?.indexOf("up") !== -1;
    this.tarefa = regra?.indexOf("tf") !== -1;
    // this.usuario_responsavel_sn = regra?.indexOf('ur') !== -1;
    this.userScops = regra;

    this.configuracao_incluir = acesso.indexOf("cf_i") !== -1;
    this.configuracao_alterar = acesso.indexOf("cf_a") !== -1;
    this.assunto_incluir = acesso.indexOf("as_i") !== -1;
    this.assunto_alterar = acesso.indexOf("as_a") !== -1;
    this.municipio_incluir = acesso.indexOf("mu_i") !== -1;
    this.municipio_alterar = acesso.indexOf("mu_a") !== -1;
    this.usuario_incluir = acesso.indexOf("us_i") !== -1;
    this.usuario_alterar = acesso.indexOf("us_a") !== -1;
    this.usuario_apagar = acesso.indexOf("us_d") !== -1;
    this.cadastro_incluir = acesso.indexOf("ca_i") !== -1;
    this.cadastro_alterar = acesso.indexOf("ca_a") !== -1;
    this.cadastro_apagar = acesso.indexOf("ca_d") !== -1;
    this.cadastro_listar = acesso.indexOf("ca_l") !== -1;
    this.solicitacao_incluir = acesso.indexOf("so_i") !== -1;
    this.solicitacao_alterar = acesso.indexOf("so_a") !== -1;
    this.solicitacao_apagar = (acesso.indexOf("so_d") !== -1 || regra?.indexOf("ur") !== -1 || regra?.indexOf("up") !== -1 || acesso.indexOf("us_r") !== -1);
    this.solicitacao_listar = acesso.indexOf("so_l") !== -1;
    this.solicitacao_analisar = (acesso.indexOf("so_an") !== -1 || regra?.indexOf("ur") !== -1 || regra?.indexOf("up") !== -1 || acesso.indexOf("us_r") !== -1);
    this.processo_deferir = acesso.indexOf("pr_df") !== -1;
    this.processo_indeferir = acesso.indexOf("pr_if") !== -1;
    this.processo_analisar = (acesso.indexOf("pr_df") !== -1 || acesso.indexOf("pr_if") !== -1 || regra?.indexOf("ur") !== -1 || regra?.indexOf("up") !== -1 || acesso.indexOf("us_r") !== -1);
    this.processo_listar = acesso.indexOf("pr_l") !== -1;
    this.oficio_incluir = acesso.indexOf("of_i") !== -1;
    this.oficio_deferir = acesso.indexOf("of_df") !== -1;
    this.oficio_indeferir = acesso.indexOf("of_id") !== -1;
    this.oficio_vizualizar = acesso.indexOf("of_l") !== -1;
    this.oficio_listar = acesso.indexOf("of_l") !== -1;
    this.oficio_alterar = acesso.indexOf("of_a") !== -1;
    this.historico_incluir = acesso.indexOf("hi_i") !== -1;
    this.historico_alterar = acesso.indexOf("hi_a") !== -1;
    this.historico_apagar = acesso.indexOf("hi_d") !== -1;
    /!*this.historico_solicitacao_incluir = acesso.indexOf('hs_i') !== -1;
    this.historico_solicitacao_alterar = acesso.indexOf('hs_a') !== -1;
    this.historico_solicitacao_apagar = acesso.indexOf('hs_d') !== -1;*!/
    this.historico_solicitacao_incluir = true;
    this.historico_solicitacao_alterar = true;
    this.historico_solicitacao_apagar = true;
    this.agenda_incluir = acesso.indexOf("ag_i") !== -1;
    this.agenda_alterar = acesso.indexOf("ag_a") !== -1;
    this.agenda_apagar = acesso.indexOf("ag_d") !== -1;
    this.processo_apagar = acesso.indexOf("pr_d") !== -1;
    this.oficio_apagar = acesso.indexOf("of_d") !== -1;
    this.assunto_apagar = acesso.indexOf("as_d") !== -1;
    this.municipio_apagar = acesso.indexOf("mu_d") !== -1;
    this.agenda_visualizar = acesso.indexOf("ag_v") !== -1;
    this.agenda2_incluir = acesso.indexOf("a2_i") !== -1;
    this.agenda2_alterar = acesso.indexOf("a2_a") !== -1;
    this.agenda2_apagar = acesso.indexOf("a2_d") !== -1;
    this.agenda2_visualizar = acesso.indexOf("a2_v") !== -1;
    this.telefone_incluir = acesso.indexOf("te_i") !== -1;
    this.telefone_alterar = acesso.indexOf("te_a") !== -1;
    this.telefone_apagar = acesso.indexOf("te_d") !== -1;
    this.telefone_listar = acesso.indexOf("te_l") !== -1;
    this.contabilidade_incluir = acesso.indexOf("co_i") !== -1;
    this.contabilidade_alterar = acesso.indexOf("co_a") !== -1;
    this.contabilidade_apagar = acesso.indexOf("co_d") !== -1;
    this.contabilidade_listar = acesso.indexOf("co_l") !== -1;
    this.contatos_exibir = acesso.indexOf("ct_e") !== -1;
    this.contatos_gerenciar = acesso.indexOf("ct_g") !== -1;
    this.configuracao_apagar = acesso.indexOf("cf_d") !== -1;
    this.emenda_incluir = acesso.indexOf("em_i") !== -1;
    this.emenda_alterar = acesso.indexOf("em_a") !== -1;
    this.emenda_apagar = acesso.indexOf("em_d") !== -1;
    this.emenda_listar = acesso.indexOf("em_l") !== -1;
    this.historicoemenda_incluir = acesso.indexOf("he_i") !== -1;
    this.historicoemenda_alterar = acesso.indexOf("he_a") !== -1;
    this.historicoemenda_apagar = acesso.indexOf("he_d") !== -1;
    this.historicoemenda_listar = acesso.indexOf("he_l") !== -1;
    this.cadastrosigilo_incluir = acesso.indexOf("cs_i") !== -1;
    this.cadastrosigilo_alterar = acesso.indexOf("cs_a") !== -1;
    this.cadastrosigilo_apagar = acesso.indexOf("cs_d") !== -1;
    this.cadastrosigilo_listar = acesso.indexOf("cs_l") !== -1;
    this.proposicao_incluir = acesso.indexOf("pp_i") !== -1;
    this.proposicao_alterar = acesso.indexOf("pp_a") !== -1;
    this.proposicao_apagar = acesso.indexOf("pp_d") !== -1;
    this.proposicao_listar = acesso.indexOf("pp_l") !== -1;
    this.andamentoproposicao_incluir = acesso.indexOf("ap_i") !== -1;
    this.andamentoproposicao_alterar = acesso.indexOf("ap_a") !== -1;
    this.andamentoproposicao_apagar = acesso.indexOf("ap_d") !== -1;
    this.andamentoproposicao_listar = acesso.indexOf("ap_l") !== -1;
    this.passagemaerea_incluir = acesso.indexOf("pa_i") !== -1;
    this.passagemaerea_alterar = acesso.indexOf("pa_a") !== -1;
    this.passagemaerea_apagar = acesso.indexOf("pa_d") !== -1;
    this.passagemaerea_listar = acesso.indexOf("pa_l") !== -1;
    this.sms_incluir = acesso.indexOf("sm_i") !== -1;
    this.arquivos_anexar = (acesso.indexOf("ar_a") !== -1 && this.config_arquivo_ativo);
    this.arquivos_baixar = (acesso.indexOf("ar_b") !== -1 && this.config_arquivo_ativo);
    this.arquivos_apagar = (acesso.indexOf("ar_d") !== -1 && this.config_arquivo_ativo);
    // this.solicitacao_analisar = acesso.indexOf('so_an') !== -1;
    this.usuario_responsavel_sn = (regra?.indexOf("ur") !== -1 || acesso.indexOf("us_r") !== -1 || regra?.indexOf("up") !== -1);
    this.userRules = acesso;
    this.mensagem = true;
    this.mensagem_enviar = true;
    this.permissoes_carregadas = true;*!/

    this.mostraMenuEmiter(true);
  }

  cancelaPermissoes() {
    this._versao = 0;
    this.agenda = false;
    this.agenda2 = false;
    this.agenda2_alterar = false;
    this.agenda2_apagar = false;
    this.agenda2_incluir = false;
    this.agenda2_visualizar = false;
    this.agenda_alterar = false;
    this.agenda_apagar = false;
    this.agenda_incluir = false;
    this.agenda_visualizar = false;
    this.andamentoproposicao = false;
    this.andamentoproposicao_alterar = false;
    this.andamentoproposicao_apagar = false;
    this.andamentoproposicao_incluir = false;
    this.andamentoproposicao_listar = false;
    this.arquivos = false;
    this.arquivos_anexar = false;
    this.arquivos_apagar = false;
    this.arquivos_baixar = false;
    this.assunto = false;
    this.assunto_alterar = false;
    this.assunto_apagar = false;
    this.assunto_incluir = false;
    this.cadastro = false;
    this.cadastro_alterar = false;
    this.cadastro_apagar = false;
    this.cadastro_incluir = false;
    this.cadastro_listar = false;
    this.cadastrosigilo = false;
    this.cadastrosigilo_alterar = false;
    this.cadastrosigilo_apagar = false;
    this.cadastrosigilo_incluir = false;
    this.cadastrosigilo_listar = false;
    this.config_arquivo_ativo = false;
    this.config_arquivo_cota = 0;
    this.config_cota_disponivel = 0;
    this.config_cota_utilizada = 0;
    this.configuracao = false;
    this.configuracao_alterar = false;
    this.configuracao_apagar = false;
    this.configuracao_incluir = false;
    this.contabilidade = false;
    this.contabilidade_alterar = false;
    this.contabilidade_apagar = false;
    this.contabilidade_incluir = false;
    this.contabilidade_listar = false;
    this.contatos = false;
    this.contatos_exibir = false;
    this.contatos_gerenciar = false;
    this.currentUser = null;
    this.dispositivo = null;
    this.emenda = false;
    this.emenda_alterar = false;
    this.emenda_apagar = false;
    this.emenda_incluir = false;
    this.emenda_listar = false;
    this.historico = false;
    this.historico_alterar = false;
    this.historico_apagar = false;
    this.historico_incluir = false;
    this.historico_solicitacao = false;
    this.historico_solicitacao_alterar = false;
    this.historico_solicitacao_apagar = false;
    this.historico_solicitacao_incluir = false;
    this.historicoemenda = false;
    this.historicoemenda_alterar = false;
    this.historicoemenda_apagar = false;
    this.historicoemenda_incluir = false;
    this.historicoemenda_listar = false;
    this.mensagem = false;
    this.mensagem_enviar = false;
    this.municipio = false;
    this.municipio_alterar = false;
    this.municipio_apagar = false;
    this.municipio_incluir = false;
    this.oficio = false;
    this.oficio_alterar = false;
    this.oficio_apagar = false;
    this.oficio_deferir = false;
    this.oficio_incluir = false;
    this.oficio_indeferir = false;
    this.oficio_listar = false;
    this.oficio_vizualizar = false;
    this.parlamentar_arquivo_ativo = false;
    this.parlamentar_id = 0;
    this.parlamentar_nome = "";
    this.passagemaerea = false;
    this.passagemaerea_alterar = false;
    this.passagemaerea_apagar = false;
    this.passagemaerea_incluir = false;
    this.passagemaerea_listar = false;
    this.permissoes_carregadas = false;
    this.processo = false;
    this.processo_analisar = false;
    this.processo_apagar = false;
    this.processo_deferir = false;
    this.processo_indeferir = false;
    this.processo_listar = false;
    this.proposicao = false;
    this.proposicao_alterar = false;
    this.proposicao_apagar = false;
    this.proposicao_incluir = false;
    this.proposicao_listar = false;
    this.sms = false;
    this.sms_incluir = false;
    this.solicitacao = false;
    this.solicitacaoVersao = 0;
    this.solicitacao_alterar = false;
    this.solicitacao_analisar = false;
    this.solicitacao_apagar = false;
    this.solicitacao_incluir = false;
    this.solicitacao_listar = false;
    this.tarefa = false;
    this.telefone = false;
    this.telefone_alterar = false;
    this.telefone_apagar = false;
    this.telefone_incluir = false;
    this.telefone_listar = false;
    this.userRules = [];
    this.userScops  = [];
    this.usuario = false;
    this.usuario_alterar = false;
    this.usuario_apagar = false;
    this.usuario_email = "";
    this.usuario_id = 0;
    this.usuario_incluir = false;
    this.usuario_local_id = 0;
    this.usuario_nome = "";
    this.usuario_principal_sn = false;
    this.usuario_responsavel_sn = false;
    this.usuario_uuid = "";
    this.versao = null;
    this.versaoN = 0;
    this.versao_id = 0;
    this.mostraMenuEmiter(false);
  }

  checaPermissao(str: string): any {
    return this.currentUser!.scope!.indexOf(str) !== -1;
  }

  logout() {
    this.sub.forEach(s => s.unsubscribe());
    sessionStorage.clear();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");
    localStorage.removeItem("reflesh_token");
    localStorage.removeItem("expiresRef");
    localStorage.removeItem("expires");
    localStorage.removeItem("usuario_uuid");
    this.currentUser = null;
    this.cancelaPermissoes();
    this.ath.logado = false;
  }

}
*/
