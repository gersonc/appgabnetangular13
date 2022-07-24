import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { DropdownnomeidClass } from '../../_models';
import {MostraMenuService, DropdownService, MenuInternoService} from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { EmendaBuscaInterface, EmendaDropdownMenu } from '../_models';
import { EmendaBuscaService} from '../_services';

@Component({
  selector: 'app-emenda-menu',
  templateUrl: './emenda-menu.component.html',
  styleUrls: ['./emenda-menu.component.css']
})
export class EmendaMenuComponent implements OnInit {

  public formMenuEmenda: FormGroup;
  public items: Array<any> = [];
  public ddNomeIdArray = new DropdownnomeidClass();

  public drd = new EmendaDropdownMenu();

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cs: CarregadorService,
    public ebs: EmendaBuscaService
  ) { }

  ngOnInit() {

    this.formMenuEmenda = this.formBuilder.group({
      emenda_id: [null],
      emenda_id2: [null],
      emenda_situacao: [null],
      emenda_tipo_emenda_id: [null],
      emenda_cadastro_tipo_id: [null],
      emenda_autor_nome: [null],
      emenda_cadastro_id: [null],
      emenda_autor_id: [null],
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
      emenda_data_solicitacao: [null],
      emenda_processo: [null],
      emenda_contrato: [null],
      emenda_data_empenho: [null],
      emenda_numero_ordem_bancaria: [null],
      emenda_data_pagamento: [null],
      cadastro_municipio_id: [null],
      lst: [null]
    });

    this.carregaDropDown();

    if (!this.ebs.buscaStateSN) {
      if (sessionStorage.getItem('emenda-listagem')) {
        sessionStorage.removeItem('emenda-listagem');
      }
      this.mi.showMenuInterno();
    }
  }

  carregaDropDown() {
    this.drd = JSON.parse(sessionStorage.getItem('emenda-dropdown-menu'));
    this.cs.escondeCarregador();
  }

  onMudaForm() {
    this.ebs.resetEmendaBusca();
    let emBusca: EmendaBuscaInterface;
    emBusca = this.formMenuEmenda.getRawValue();
    for (const propName in emBusca ) {
      if (emBusca[propName] == null) {
        emBusca[propName] = '';
      }
      if ( typeof emBusca[propName] === 'object' ) {
        emBusca[propName] = emBusca[propName].value;
      }
      this.ebs.emendaBusca[propName] = emBusca[propName].toString();
    }
    this.ebs.buscaMenu();
    this.mi.hideMenu();
    this.cs.mostraCarregador();
  }

  goIncluir() {
    if (this.authenticationService.emenda_incluir) {
      this.mi.hideMenu();
      this.cs.mostraCarregador();
      this.router.navigate(['/emenda/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }
}
