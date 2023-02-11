import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { User } from "../_models";
import { Versao } from "./versao";
import { VersaoService } from "./versao.service";
import { DispositivoService } from "./dispositivo.service";
import { ArquivoLoginService } from "../arquivo/_services";
import { AuthService } from "./auth.service";
import { acessoRule, acessoStr, varAcesso, varBool, varNum, varRegra } from "../_models/acesso-constantes";

@Injectable({ providedIn: "root" })

export class AuthenticationService {
  [index: string]: string | string[] | boolean | number | any | null ;

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
  ) {
    console.log('AuthenticationService constructor 0');
    this.sub.push(this.ath.logado$.subscribe((n) => {
      console.log('AuthenticationService constructor 1', n);
      if (n === 1) {
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
    this.userScops = [];
    for (let i = 0; i < n; i++) {
      if (valor[i] === "1") {
        this.userScops.push(acessoStr[i]);
      }
    }
    return this.userScops;
  }

  descreveRule(valor: string): string[] {
    const n = valor.length;
    this.userRules = [];
    for (let i = 0; i < n; i++) {
      if (valor[i] === "1") {
        this.userRules.push(acessoRule[i]);
      }
    }
    this.userRules.push("tf");
    return this.userRules;
  }

  carregaPermissoes(user): void {
    this.descreveRule(user.usuario_regras);
    this.descreveAcesso(user.usuario_acesso);
    this.ds.dispositivo = user.dispositivo;

    this._versao = +user.gabinete_id!;
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
    this.currentUser = user;
    this.dispositivo = user.dispositivo;
    this.parlamentar_arquivo_ativo = (user.parlamentar_arquivo_ativo! === 1);
    this.parlamentar_id = +user.parlamentar_id!;
    this.parlamentar_nome = user.parlamentar_nome!;
    this.solicitacaoVersao = +user.solicitacao_versao!;
    this.usuario_email = user.usuario_email!;
    this.usuario_id = +user.usuario_id!;
    this.usuario_local_id = +user.usuario_local_id!;
    this.usuario_nome = user.usuario_nome!;
    this.usuario_uuid = user.usuario_uuid;
    this.versao = Versao.getVersao(+user.gabinete_id!);
    this.versaoN = +user.gabinete_id!;
    this.versao_id = +user.gabinete_id!;

    // this.userRules = acesso;
    // this.userScops = regra;

    this.historico_solicitacao = true;
    this.mensagem = true;
    /*
      this.historico_solicitacao_incluir = this.userScops.indexOf('hs_i') !== -1;
        this.historico_solicitacao_alterar = this.userScops.indexOf('hs_a') !== -1;
        this.historico_solicitacao_apagar = this.userScops.indexOf('hs_d') !== -1;
    */
    this.historico_solicitacao_alterar = true;
    this.historico_solicitacao_apagar = true;
    this.historico_solicitacao_incluir = true;
    this.mensagem_enviar = true;

    this.agenda = this.userRules?.indexOf("ag") !== -1;
    this.agenda2 = this.userRules?.indexOf("a2") !== -1;
    this.andamentoproposicao = this.userRules?.indexOf("ap") !== -1;
    this.assunto = this.userRules?.indexOf("as") !== -1;
    this.cadastro = this.userRules?.indexOf("ca") !== -1;
    this.cadastrosigilo = this.userRules?.indexOf("cs") !== -1;
    this.configuracao = this.userRules?.indexOf("cf") !== -1;
    this.contabilidade = this.userRules?.indexOf("co") !== -1;
    this.contatos = this.userRules?.indexOf("ct") !== -1;
    this.emenda = this.userRules?.indexOf("em") !== -1;
    this.historico = this.userRules?.indexOf("hi") !== -1;
    this.historicoemenda = this.userRules?.indexOf("he") !== -1;
    this.municipio = this.userRules?.indexOf("mu") !== -1
    this.oficio = this.userRules?.indexOf("of") !== -1;
    this.passagemaerea = this.userRules?.indexOf("pa") !== -1;
    this.processo = this.userRules?.indexOf("pr") !== -1;
    this.proposicao = this.userRules?.indexOf("pp") !== -1;
    this.sms = this.userRules?.indexOf("sm") !== -1;
    this.solicitacao = this.userRules?.indexOf("so") !== -1;
    this.tarefa = this.userRules?.indexOf("tf") !== -1;
    this.telefone = this.userRules?.indexOf("te") !== -1;
    this.usuario = this.userRules?.indexOf("us") !== -1;
    this.usuario_principal_sn = this.userRules?.indexOf("up") !== -1;

    this.agenda2_alterar = this.userScops.indexOf("a2_a") !== -1;
    this.agenda2_apagar = this.userScops.indexOf("a2_d") !== -1;
    this.agenda2_incluir = this.userScops.indexOf("a2_i") !== -1;
    this.agenda2_visualizar = this.userScops.indexOf("a2_v") !== -1;
    this.agenda_alterar = this.userScops.indexOf("ag_a") !== -1;
    this.agenda_apagar = this.userScops.indexOf("ag_d") !== -1;
    this.agenda_incluir = this.userScops.indexOf("ag_i") !== -1;
    this.agenda_visualizar = this.userScops.indexOf("ag_v") !== -1;
    this.andamentoproposicao_alterar = this.userScops.indexOf("ap_a") !== -1;
    this.andamentoproposicao_apagar = this.userScops.indexOf("ap_d") !== -1;
    this.andamentoproposicao_incluir = this.userScops.indexOf("ap_i") !== -1;
    this.andamentoproposicao_listar = this.userScops.indexOf("ap_l") !== -1;
    this.assunto_alterar = this.userScops.indexOf("as_a") !== -1;
    this.assunto_apagar = this.userScops.indexOf("as_d") !== -1;
    this.assunto_incluir = this.userScops.indexOf("as_i") !== -1;
    this.cadastro_alterar = this.userScops.indexOf("ca_a") !== -1;
    this.cadastro_apagar = this.userScops.indexOf("ca_d") !== -1;
    this.cadastro_incluir = this.userScops.indexOf("ca_i") !== -1;
    this.cadastro_listar = this.userScops.indexOf("ca_l") !== -1;
    this.cadastrosigilo_alterar = this.userScops.indexOf("cs_a") !== -1;
    this.cadastrosigilo_apagar = this.userScops.indexOf("cs_d") !== -1;
    this.cadastrosigilo_incluir = this.userScops.indexOf("cs_i") !== -1;
    this.cadastrosigilo_listar = this.userScops.indexOf("cs_l") !== -1;
    this.configuracao_alterar = this.userScops.indexOf("cf_a") !== -1;
    this.configuracao_apagar = this.userScops.indexOf("cf_d") !== -1;
    this.configuracao_incluir = this.userScops.indexOf("cf_i") !== -1;
    this.contabilidade_alterar = this.userScops.indexOf("co_a") !== -1;
    this.contabilidade_apagar = this.userScops.indexOf("co_d") !== -1;
    this.contabilidade_incluir = this.userScops.indexOf("co_i") !== -1;
    this.contabilidade_listar = this.userScops.indexOf("co_l") !== -1;
    this.contatos_exibir = this.userScops.indexOf("ct_e") !== -1;
    this.contatos_gerenciar = this.userScops.indexOf("ct_g") !== -1;
    this.emenda_alterar = this.userScops.indexOf("em_a") !== -1;
    this.emenda_apagar = this.userScops.indexOf("em_d") !== -1;
    this.emenda_incluir = this.userScops.indexOf("em_i") !== -1;
    this.emenda_listar = this.userScops.indexOf("em_l") !== -1;
    this.historico_alterar = this.userScops.indexOf("hi_a") !== -1;
    this.historico_apagar = this.userScops.indexOf("hi_d") !== -1;
    this.historico_incluir = this.userScops.indexOf("hi_i") !== -1;
    this.historicoemenda_alterar = this.userScops.indexOf("he_a") !== -1;
    this.historicoemenda_apagar = this.userScops.indexOf("he_d") !== -1;
    this.historicoemenda_incluir = this.userScops.indexOf("he_i") !== -1;
    this.historicoemenda_listar = this.userScops.indexOf("he_l") !== -1;
    this.municipio_alterar = this.userScops.indexOf("mu_a") !== -1;
    this.municipio_apagar = this.userScops.indexOf("mu_d") !== -1;
    this.municipio_incluir = this.userScops.indexOf("mu_i") !== -1;
    this.oficio_alterar = this.userScops.indexOf("of_a") !== -1;
    this.oficio_apagar = this.userScops.indexOf("of_d") !== -1;
    this.oficio_deferir = this.userScops.indexOf("of_df") !== -1;
    this.oficio_incluir = this.userScops.indexOf("of_i") !== -1;
    this.oficio_indeferir = this.userScops.indexOf("of_id") !== -1;
    this.oficio_listar = this.userScops.indexOf("of_l") !== -1;
    this.oficio_vizualizar = this.userScops.indexOf("of_l") !== -1;
    this.passagemaerea_alterar = this.userScops.indexOf("pa_a") !== -1;
    this.passagemaerea_apagar = this.userScops.indexOf("pa_d") !== -1;
    this.passagemaerea_incluir = this.userScops.indexOf("pa_i") !== -1;
    this.passagemaerea_listar = this.userScops.indexOf("pa_l") !== -1;
    this.processo_apagar = this.userScops.indexOf("pr_d") !== -1;
    this.processo_deferir = this.userScops.indexOf("pr_df") !== -1;
    this.processo_indeferir = this.userScops.indexOf("pr_if") !== -1;
    this.processo_listar = this.userScops.indexOf("pr_l") !== -1;
    this.proposicao_alterar = this.userScops.indexOf("pp_a") !== -1;
    this.proposicao_apagar = this.userScops.indexOf("pp_d") !== -1;
    this.proposicao_incluir = this.userScops.indexOf("pp_i") !== -1;
    this.proposicao_listar = this.userScops.indexOf("pp_l") !== -1;
    this.sms_incluir = this.userScops.indexOf("sm_i") !== -1;
    this.solicitacao_alterar = this.userScops.indexOf("so_a") !== -1;
    this.solicitacao_incluir = this.userScops.indexOf("so_i") !== -1;
    this.solicitacao_listar = this.userScops.indexOf("so_l") !== -1;
    this.telefone_alterar = this.userScops.indexOf("te_a") !== -1;
    this.telefone_apagar = this.userScops.indexOf("te_d") !== -1;
    this.telefone_incluir = this.userScops.indexOf("te_i") !== -1;
    this.telefone_listar = this.userScops.indexOf("te_l") !== -1;
    this.usuario_alterar = this.userScops.indexOf("us_a") !== -1;
    this.usuario_apagar = this.userScops.indexOf("us_d") !== -1;
    this.usuario_incluir = this.userScops.indexOf("us_i") !== -1;

    this.arquivos = (this.userRules?.indexOf("ar") !== -1 && this.config_arquivo_ativo);
    this.usuario_responsavel_sn = (this.userRules?.indexOf("ur") !== -1 || this.userScops.indexOf("us_r") !== -1 || this.userRules?.indexOf("up") !== -1);
    this.arquivos_anexar = (this.userScops.indexOf("ar_a") !== -1 && this.config_arquivo_ativo);
    this.arquivos_apagar = (this.userScops.indexOf("ar_d") !== -1 && this.config_arquivo_ativo);
    this.arquivos_baixar = (this.userScops.indexOf("ar_b") !== -1 && this.config_arquivo_ativo);
    this.processo_analisar = (this.userScops.indexOf("pr_df") !== -1 || this.userScops.indexOf("pr_if") !== -1 || this.userRules?.indexOf("ur") !== -1 || this.userRules?.indexOf("up") !== -1 || this.userScops.indexOf("us_r") !== -1);
    this.solicitacao_analisar = (this.userScops.indexOf("so_an") !== -1 || this.userRules?.indexOf("ur") !== -1 || this.userRules?.indexOf("up") !== -1 || this.userScops.indexOf("us_r") !== -1);
    this.solicitacao_apagar = (this.userScops.indexOf("so_d") !== -1 || this.userRules?.indexOf("ur") !== -1 || this.userRules?.indexOf("up") !== -1 || this.userScops.indexOf("us_r") !== -1);
    this.permissoes_carregadas = true;
    this.as.verificaPermissoes();
    this.mostraMenuEmiter(true);
  }

  cancelaPermissoes() {
    varAcesso.forEach(s => {
      this[s] = false;
    });
    varRegra.forEach(s => {
      this[s] = false;
    });
    varBool.forEach(s => {
      this[s] = false;
    });
    varNum.forEach(s => {
      this[s] = 0;
    });
    this.currentUser = null;
    this.dispositivo = null;
    this.versao = null;
    this.parlamentar_nome = "";
    this.usuario_email = "";
    this.usuario_nome = "";
    this.usuario_uuid = "";
    this.userRules = [];
    this.userScops = [];
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
