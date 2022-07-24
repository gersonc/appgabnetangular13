import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EmendaBuscaI} from "../_models/emenda-busca-i";
import {EmendaDropdownMenuService} from "../_services/emenda-dropdown-menu.service";
import {DropdownnomeidClass} from "../../_models";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {EmendaDropdownMenuI} from "../_models/emenda-dropdown-menu-i";
import {EmendaService} from "../_services/emenda.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-emenda-menu-listar',
  templateUrl: './emenda-menu-listar.component.html',
  styleUrls: ['./emenda-menu-listar.component.css']
})
export class EmendaMenuListarComponent implements OnInit {
  public formMenuEmenda: FormGroup;
  public ddNomeIdArray = new DropdownnomeidClass();
  public ptBr: any;
  private sub: Subscription[] = [];
  public drd: EmendaDropdownMenuI | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dd: EmendaDropdownMenuService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public es: EmendaService
  ) { }

  ngOnInit() {

    this.formMenuEmenda = this.formBuilder.group({
      emenda_id: [null],
      emenda_id2: [null],
      emenda_situacao_id: [null],
      emenda_tipo_emenda_id: [null],
      emenda_cadastro_tipo_id: [null],
      emenda_autor_nome: [null],
      emenda_cadastro_id: [null],
      emenda_cadastro_id2: [null],
      emenda_ogu_id: [null],
      emenda_orgao_solicitado_nome: [null],
      emenda_numero: [null],
      emenda_assunto_id: [null],
      emenda_crnr: [null],
      emenda_local_id: [null],
      emenda_gmdna: [null],
      emenda_numero_protocolo: [null],
      emenda_uggestao: [null],
      emenda_funcional_programatica: [null],
      emenda_regiao: [null],
      emenda_numero_empenho: [null],
      emenda_data_solicitacao1: [null],
      emenda_data_solicitacao2: [null],
      emenda_processo: [null],
      emenda_contrato: [null],
      emenda_data_empenho1: [null],
      emenda_data_empenho2: [null],
      emenda_numero_ordem_bancaria: [null],
      emenda_data_pagamento1: [null],
      emenda_data_pagamento2: [null],
      cadastro_municipio_id: [null],
      lst: [null]
    });

    this.carregaDropDown();

    this.mi.showMenuInterno();
  }

  carregaDropDown() {
    if (sessionStorage.getItem('emenda-menu-dropdown')) {
      this.drd = JSON.parse(sessionStorage.getItem('emenda-menu-dropdown'));
    } else {
      this.getCarregaDropDown();
    }
  }

  getCarregaDropDown() {
    this.sub.push(this.dd.resp$.subscribe(
      (dados: boolean ) => {
      },
      error => {
        console.error(error.toString());
      },
      () => {
        this.carregaDropDown();
      }
    ));
    this.dd.gravaDropDown();
  }

  onMudaForm() {
    this.es.resetEmendaBusca();
    let emendaBusca: EmendaBuscaI;
    emendaBusca = this.formMenuEmenda.getRawValue();
    this.es.novaBusca(emendaBusca);
    this.es.buscaMenu();
    this.mi.hideMenu();
  }

  goIncluir() {
    if (this.aut.emenda_incluir) {
      this.es.acao = 'incluir';
      // this.sfs.criaTipoAnalise(this.aut.solicitacao_analisar);
      this.mi.mudaMenuInterno(false);
      this.router.navigate(['emenda/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  fechar() {
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
