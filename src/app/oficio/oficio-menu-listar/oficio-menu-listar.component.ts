import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
// import { DropdownnomeidClass } from '../../_models';
import {MostraMenuService, DropdownService, MenuInternoService} from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';

import { OficioBuscaService } from '../_services';
import { OficioBuscaInterface, OficioDropdownMenuListar } from '../_models';

@Component({
  selector: 'app-oficio-menu-listar',
  templateUrl: './oficio-menu-listar.component.html',
  styleUrls: ['./oficio-menu-listar.component.css']
})
export class OficioMenuListarComponent implements OnInit {

  public formMenuOfico: FormGroup;
  public items: Array<any> = [];
  // public ddNomeIdArray = new DropdownnomeidClass();
  public ddOficio_processo_id: SelectItem[] = [];
  public ddOficio_codigo: SelectItem[] = [];
  public ddOficio_numero: SelectItem[] = [];
  public ddOficio_convenio: SelectItem[] = [];
  public ddOficio_protocolo_numero: SelectItem[] = [];
  public ddOficio_orgao_solicitado_nome: SelectItem[] = [];
  public ddOficio_orgao_protocolante_nome: SelectItem[] = [];
  public ddOficio_municipio_id: SelectItem[] = [];
  public ddOficio_tipo_solicitante_id: SelectItem[] = [];
  public ddOficio_cadastro_id: SelectItem[] = [];
  public ddOficio_assunto_id: SelectItem[] = [];
  public ddOficio_area_interesse_id: SelectItem[] = [];
  public ddSolicitacao_reponsavel_analize_id: SelectItem[] = [];
  public ddSolicitacao_local_id: SelectItem[] = [];
  public ddOficio_status: SelectItem[] = [];
  public ddOficio_prioridade_id: SelectItem[] = [];
  public ddOficio_tipo_andamento_id: SelectItem[] = [];
  public ddOficio_data_emissao1: SelectItem[] = [];
  public ddOficio_data_emissao2: SelectItem[] = [];
  public ddOficio_data_empenho1: SelectItem[] = [];
  public ddOficio_data_empenho2: SelectItem[] = [];
  public ddOficio_data_protocolo1: SelectItem[] = [];
  public ddOficio_data_protocolo2: SelectItem[] = [];
  public ddOficio_data_pagamento1: SelectItem[] = [];
  public ddOficio_data_pagamento2: SelectItem[] = [];
  public ddOficio_prazo1: SelectItem[] = [];
  public ddOficio_prazo2: SelectItem[] = [];
  private ddOficio = new OficioDropdownMenuListar();

  constructor(
    private formBuilder: FormBuilder,
    // private dd: DropdownService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cs: CarregadorService,
    public obs: OficioBuscaService
  ) { }

  ngOnInit() {

    this.formMenuOfico = this.formBuilder.group({
      oficio_processo_id: [null],
      oficio_codigo: [null],
      oficio_convenio: [null],
      oficio_protocolo_numero: [null],
      oficio_assunto_id: [null],
      oficio_numero: [null],
      oficio_municipio_id: [null],
      oficio_tipo_solicitante_id: [null],
      oficio_cadastro_id: [null],
      solicitacao_assunto_id: [null],
      oficio_area_interesse_id: [null],
      solicitacao_reponsavel_analize_id: [null],
      solicitacao_local_id: [null],
      oficio_orgao_solicitado_nome: [null],
      oficio_orgao_protocolante_nome: [null],
      oficio_status: [null],
      oficio_prioridade_id: [null],
      oficio_tipo_andamento_id: [null],
      oficio_data_emissao1: [null],
      oficio_data_emissao2: [null],
      oficio_descricao_acao: [null],
      oficio_data_empenho1: [null],
      oficio_data_empenho2: [null],
      oficio_data_protocolo1: [null],
      oficio_data_protocolo2: [null],
      oficio_data_pagamento1: [null],
      oficio_data_pagamento2: [null],
      oficio_prazo1: [null],
      oficio_prazo2: [null],
    });

    this.carregaDropDown();

    if (!this.obs.buscaStateSN) {
      if (sessionStorage.getItem('oficio-listagem')) {
        sessionStorage.removeItem('oficio-listagem');
      }
      this.mi.showMenuInterno();
    }
  }

  carregaDropDown() {
    let dr = JSON.parse(sessionStorage.getItem('oficio-dropdown'));
    this.ddOficio_processo_id = dr.ddOficio_processo_id;
    this.ddOficio_codigo = dr.ddOficio_codigo;
    this.ddOficio_numero = dr.ddOficio_numero;
    this.ddOficio_protocolo_numero = dr.ddOficio_protocolo_numero;
    this.ddOficio_convenio = dr.ddOficio_convenio;
    this.ddOficio_orgao_solicitado_nome = dr.ddOficio_orgao_solicitado_nome;
    this.ddOficio_orgao_protocolante_nome = dr.ddOficio_orgao_protocolante_nome;
    this.ddOficio_data_emissao1 = dr.ddOficio_data_emissao1;
    this.ddOficio_data_emissao2 = dr.ddOficio_data_emissao2;
    this.ddOficio_data_empenho1 = dr.ddOficio_data_empenho1;
    this.ddOficio_data_empenho2 = dr.ddOficio_data_empenho2;
    this.ddOficio_data_protocolo1 = dr.ddOficio_data_protocolo1;
    this.ddOficio_data_protocolo2 = dr.ddOficio_data_protocolo2;
    this.ddOficio_data_pagamento1 = dr.ddOficio_data_pagamento1;
    this.ddOficio_data_pagamento2 = dr.ddOficio_data_pagamento2;
    this.ddOficio_prazo1 = dr.ddOficio_prazo1;
    this.ddOficio_prazo2 = dr.ddOficio_prazo2;
    this.ddOficio_municipio_id = dr.ddOficio_municipio_id;
    this.ddOficio_tipo_solicitante_id = dr.ddOficio_tipo_solicitante_id;
    this.ddOficio_cadastro_id = dr.ddOficio_cadastro_id;
    this.ddOficio_area_interesse_id = dr.ddOficio_area_interesse_id;
    this.ddOficio_prioridade_id = dr.ddOficio_prioridade_id;
    this.ddOficio_tipo_andamento_id = dr.ddOficio_tipo_andamento_id;
    this.ddOficio_assunto_id = dr.ddOficio_assunto_id;
    this.ddSolicitacao_reponsavel_analize_id = dr.ddSolicitacao_reponsavel_analize_id;
    this.ddSolicitacao_local_id = dr.ddSolicitacao_local_id;
    this.ddOficio_status = dr.ddOficio_status;
    dr = null;
    this.cs.escondeCarregador();
  }

  onMudaForm() {
    this.obs.resetOficioBusca();
    let ofBusca: OficioBuscaInterface;
    ofBusca = this.formMenuOfico.getRawValue();
    for (const propName in ofBusca ) {
      if (ofBusca[propName] == null) {
        ofBusca[propName] = '';
      }
      if ( typeof ofBusca[propName] === 'object' ) {
        ofBusca[propName] = ofBusca[propName].value;
      }
      this.obs.oficioBusca[propName] = ofBusca[propName].toString();
    }
    this.obs.buscaMenu();
    // this.mm.mudaMenu(false);
    this.mi.hideMenu();
    this.cs.mostraCarregador();
  }

  goIncluir() {
    if (this.authenticationService.oficio_incluir) {
      this.mi.hideMenu();
      this.cs.mostraCarregador();
      this.router.navigate(['/oficio/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }
}
