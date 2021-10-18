import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { DropdownnomeidClass } from '../../util/_models';
import { MostraMenuService, DropdownService } from '../../util/_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { ProposicaoBuscaService } from '../_services';
import { ProposicaoBuscaInterface } from '../_models';

@Component({
  selector: 'app-proposicao-menu-listar',
  templateUrl: './proposicao-menu-listar.component.html',
  styleUrls: ['./proposicao-menu-listar.component.css']
})
export class ProposicaoMenuListarComponent implements OnInit {
  public formMenuProposicao: FormGroup;
  public items: Array<any> = [];
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddProposicao_tipo_id: SelectItem[] = [];
  public ddProposicao_numero: SelectItem[] = [];
  public ddProposicao_autor: SelectItem[] = [];
  public ddProposicao_relator: SelectItem[] = [];
  public ddProposicao_area_interesse_id: SelectItem[] = [];
  public ddProposicao_parecer: SelectItem[] = [];
  public ddProposicao_origem_id: SelectItem[] = [];
  public ddProposicao_emenda_tipo_id: SelectItem[] = [];
  public ddProposicao_situacao_id: SelectItem[] = [];
  public ddProposicao_relator_atual: SelectItem[] = [];
  public ddProposicao_orgao_id: SelectItem[] = [];
  public ddProposicao_data1: SelectItem[] = [];
  public ddProposicao_data2: SelectItem[] = [];
  estilo1 = {width: '100%'};
  estilo2 = {maxWidth: '400px'};

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private mm: MostraMenuService,
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cs: CarregadorService,
    private pbs: ProposicaoBuscaService
  ) { }

  ngOnInit() {

    this.formMenuProposicao = this.formBuilder.group({
      proposicao_tipo_id: [null],
      proposicao_numero: [null],
      proposicao_autor: [null],
      proposicao_relator: [null],
      proposicao_area_interesse_id: [null],
      proposicao_parecer: [null],
      proposicao_origem_id: [null],
      proposicao_emenda_tipo_id: [null],
      proposicao_situacao_id: [null],
      proposicao_relator_atual: [null],
      proposicao_orgao_id: [null],
      proposicao_data1: [null],
      proposicao_data2: [null],
      proposicao_ementa: [null],
      proposicao_texto: [null]
    });

    this.carregaDropDown();

    if (!this.pbs.buscaStateSN) {
      if (sessionStorage.getItem('proposicao-listagem')) {
        sessionStorage.removeItem('proposicao-listagem');
      }
      this.mm.mudaMenu(true);
    }
  }

  carregaDropDown() {
    let dr = JSON.parse(sessionStorage.getItem('proposicao-dropdown'));
    this.ddProposicao_tipo_id = dr.ddProposicao_tipo_id;
    this.ddProposicao_numero = dr.ddProposicao_numero;
    this.ddProposicao_autor = dr.ddProposicao_autor;
    this.ddProposicao_relator = dr.ddProposicao_relator;
    this.ddProposicao_area_interesse_id = dr.ddProposicao_area_interesse_id;
    this.ddProposicao_parecer = dr.ddProposicao_parecer;
    this.ddProposicao_origem_id = dr.ddProposicao_origem_id;
    this.ddProposicao_emenda_tipo_id = dr.ddProposicao_emenda_tipo_id;
    this.ddProposicao_situacao_id = dr.ddProposicao_situacao_id;
    this.ddProposicao_relator_atual = dr.ddProposicao_relator_atual;
    this.ddProposicao_orgao_id = dr.ddProposicao_orgao_id;
    this.ddProposicao_data1 = dr.ddProposicao_data1;
    this.ddProposicao_data2 = dr.ddProposicao_data2;
    dr = null;
    this.cs.escondeCarregador();
  }

  onMudaForm() {
    this.pbs.resetProposicaoBusca();
    let propBusca: ProposicaoBuscaInterface;
    propBusca = this.formMenuProposicao.getRawValue();
    for (const propName in propBusca ) {
      if (propBusca[propName] == null) {
        propBusca[propName] = '';
      }
      if ( typeof propBusca[propName] === 'object' ) {
        propBusca[propName] = propBusca[propName].value;
      }
      this.pbs.proposicaoBusca[propName] = propBusca[propName].toString();
    }
    this.pbs.buscaMenu();
    this.mm.mudaMenu(false);
    this.cs.mostraCarregador();
  }

  goIncluir() {
    if (this.authenticationService.proposicao_incluir) {
      this.mm.mudaMenu(false);
      this.cs.mostraCarregador();
      this.router.navigate(['/proposicao/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  onLimparForm() {
    this.formMenuProposicao.reset();
  }

}
