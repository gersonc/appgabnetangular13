import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormControlName, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { DropdownnomeidClass } from '../../_models';
import {MostraMenuService, DropdownService, MenuInternoService} from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';

import { ProcessoBuscaService } from '../_services';
import { ProcessoBuscaInterface, ProcessoDropdownMenuListar } from '../_models';
import {ProceDropdownMenuI} from "../../proce/_model/proc-i";

@Component({
  selector: 'app-processo-menu-listar',
  templateUrl: './processo-menu-listar.component.html',
  styleUrls: ['./processo-menu-listar.component.css']
})
export class ProcessoMenuListarComponent implements OnInit {

  public formMenuProcesso: FormGroup;
  public ddProceMenu?: ProceDropdownMenuI;

  public items: Array<any> = [];
  /*public ddNomeIdArray = new DropdownnomeidClass();
  public ddProcesso_cadastro_regiao_id: SelectItem[] = [];
  public ddProcesso_numero: SelectItem[] = [];
  public ddProcesso_cadastro_municipio_id: SelectItem[] = [];
  public ddProcesso_cadastro_tipo_id: SelectItem[] = [];
  public ddProcesso_solicitacao_reponsavel_analize_id: SelectItem[] = [];
  public ddProcesso_cadastro_id: SelectItem[] = [];
  public ddProcesso_solicitacao_assunto_id: SelectItem[] = [];
  public ddProcesso_solicitacao_area_interesse_id: SelectItem[] = [];
  public ddProcesso_solicitacao_local_id: SelectItem[] = [];
  public ddProcesso_status_id: SelectItem[] = [];
  public ddProcesso_solicitacao_data1: SelectItem[] = [];
  public ddProcesso_solicitacao_data2: SelectItem[] = [];*/


  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public pbs: ProcessoBuscaService,
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
      solicitacao_situacao: [null],
      processo_status_id: [null],
      solicitacao_data1: [null],
      solicitacao_data2: [null],
    });

    this.carregaDropDown();

    if (!this.pbs.buscaStateSN) {
      this.mi.showMenuInterno();
    }
  }

  carregaDropDown() {
    this.ddProceMenu = JSON.parse(sessionStorage.getItem('processo-dropdown'));
    /*let dr = JSON.parse(sessionStorage.getItem('processo-dropdown'));
    this.ddProcesso_cadastro_regiao_id = dr.ddProcesso_cadastro_regiao_id;
    this.ddProcesso_numero = dr.ddProcesso_numero;
    this.ddProcesso_cadastro_municipio_id = dr.ddProcesso_cadastro_municipio_id;
    this.ddProcesso_cadastro_tipo_id = dr.ddProcesso_cadastro_tipo_id;
    this.ddProcesso_cadastro_id = dr.ddProcesso_cadastro_id;
    this.ddProcesso_solicitacao_reponsavel_analize_id = dr.ddProcesso_solicitacao_reponsavel_analize_id;
    this.ddProcesso_solicitacao_assunto_id = dr.ddProcesso_solicitacao_assunto_id;
    this.ddProcesso_solicitacao_area_interesse_id = dr.ddProcesso_solicitacao_area_interesse_id;
    this.ddProcesso_solicitacao_local_id = dr.ddProcesso_solicitacao_local_id;
    this.ddProcesso_status_id = dr.ddProcesso_status_id;
    this.ddProcesso_solicitacao_data1 = dr.ddProcesso_solicitacao_data1;
    this.ddProcesso_solicitacao_data2 = dr.ddProcesso_solicitacao_data2;
    dr = null;*/
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
  }

  limpar() {
    this.formMenuProcesso.reset();
  }


  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

}
