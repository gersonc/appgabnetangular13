import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormControlName, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { DropdownnomeidClass } from '../../_models';
import {MostraMenuService, DropdownService, MenuInternoService} from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';

import { ProcessoBuscaService } from '../_services';
import { ProcessoBuscaInterface, ProcessoDropdownMenuListar } from '../_models';

@Component({
  selector: 'app-processo-menu-listar',
  templateUrl: './processo-menu-listar.component.html',
  styleUrls: ['./processo-menu-listar.component.css']
})
export class ProcessoMenuListarComponent implements OnInit {

  public formMenuProcesso: FormGroup;
  public items: Array<any> = [];
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddCadastro_regiao_id: SelectItem[] = [];
  public ddProcesso_numero: SelectItem[] = [];
  public ddCadastro_municipio_id: SelectItem[] = [];
  public ddCadastro_tipo_id: SelectItem[] = [];
  public ddSolicitacao_reponsavel_analize_id: SelectItem[] = [];
  public ddProcesso_cadastro_id: SelectItem[] = [];
  public ddSolicitacao_assunto_id: SelectItem[] = [];
  public ddSolicitacao_area_interesse_id: SelectItem[] = [];
  public ddSolicitacao_local_id: SelectItem[] = [];
  public ddProcesso_status_nome: SelectItem[] = [];
  public ddSolicitacao_data1: SelectItem[] = [];
  public ddSolicitacao_data2: SelectItem[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public pbs: ProcessoBuscaService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {

    this.formMenuProcesso = this.formBuilder.group({
      cadastro_regiao_id: [null],
      processo_id: [null],
      cadastro_municipio_id: [null],
      solicitacao_cadastro_tipo_id: [null],
      processo_cadastro_id: [null],
      solicitacao_assunto_id: [null],
      solicitacao_area_interesse_id: [null],
      solicitacao_reponsavel_analize_id: [null],
      solicitacao_local_id: [null],
      processo_status_nome: [null],
      solicitacao_data1: [null],
      solicitacao_data2: [null],
    });

    this.carregaDropDown();

    if (!this.pbs.buscaStateSN) {
      this.mi.showMenuInterno();
    }
  }

  carregaDropDown() {
    let dr = JSON.parse(sessionStorage.getItem('processo-dropdown'));
    this.ddCadastro_regiao_id = dr.cadastro_regiao_id;
    this.ddProcesso_numero = dr.processo_numero;
    this.ddCadastro_municipio_id = dr.cadastro_municipio_id;
    this.ddCadastro_tipo_id = dr.cadastro_tipo_id;
    this.ddProcesso_cadastro_id = dr.processo_cadastro_id;
    this.ddSolicitacao_reponsavel_analize_id = dr.solicitacao_reponsavel_analize_id;
    this.ddSolicitacao_assunto_id = dr.solicitacao_assunto_id;
    this.ddSolicitacao_area_interesse_id = dr.solicitacao_area_interesse_id;
    this.ddSolicitacao_local_id = dr.solicitacao_local_id;
    this.ddProcesso_status_nome = dr.processo_status_nome;
    this.ddSolicitacao_data1 = dr.solicitacao_data1;
    this.ddSolicitacao_data2 = dr.solicitacao_data2;
    dr = null;
    this.cs.escondeCarregador();
  }

  onMudaForm() {
    this.pbs.resetProcessoBusca();
    let ofBusca: ProcessoBuscaInterface;
    ofBusca = this.formMenuProcesso.getRawValue();
    for (const propName in ofBusca ) {
      if (ofBusca[propName] == null) {
        ofBusca[propName] = '';
      }
      if ( typeof ofBusca[propName] === 'object' ) {
        ofBusca[propName] = ofBusca[propName].value;
      }
      this.pbs.processoBusca[propName] = ofBusca[propName].toString();
    }
    this.pbs.buscaMenu();
    this.mi.hideMenu();
    this.cs.mostraCarregador();
  }

  limpar() {
    this.formMenuProcesso.reset();
  }


  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

}
