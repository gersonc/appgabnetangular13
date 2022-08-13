import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import {MostraMenuService, DropdownService, AutocompleteService, MenuInternoService} from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import {ContaBuscaService, ContaService} from '../_services';
import { take } from 'rxjs/operators';
import { ContaFormularioComponent } from '../conta-formulario/conta-formulario.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ContaDropdown } from '../_models';
import {ContaDropdownMenuService} from "../_services/conta-dropdown-menu.service";
import {ContaFormService} from "../_services/conta-form.service";

@Component({
  selector: 'app-conta-menu-listar',
  templateUrl: './conta-menu-listar.component.html',
  styleUrls: ['./conta-menu-listar.component.css'],
  providers: [ DialogService ]
})
export class ContaMenuListarComponent implements OnInit, OnDestroy {
  public formMenuConta: FormGroup;
  ptBr: any;
  sub: Subscription[] = [];
  public ddConta_local_id: SelectItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cdd: ContaDropdownMenuService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    public ct: ContaService,
    private cfs: ContaFormService
  ) { }

  ngOnInit() {
    this.criaFormMenu();
    this.carregaDropDown();
  }

  criaFormMenu() {
    this.formMenuConta = this.formBuilder.group({
      cedente_array: [null],
      conta_tipo_id: [999],
      conta_debito_automatico_id: [999],
      conta_paga_id: [999],
      conta_pagamento_1data: [null],
      conta_pagamento_2data: [null],
      conta_vencimento_1data: [null],
      conta_vencimento_2data: [null],
      conta_local_id: [null],
    });
  }

  carregaDropDown() {
    if(sessionStorage.getItem('dropdown-conta')) {
      this.ddConta_local_id = JSON.parse(sessionStorage.getItem('dropdown-conta'));
    }
    if(!sessionStorage.getItem('dropdown-conta') || !sessionStorage.getItem('dropdown-local')) {
      this.getCarregaDropDown();
    }

  }

  getCarregaDropDown() {
    this.sub.push(this.cdd.resp$.subscribe(
      (dados: boolean ) => {
      },
      error => {
        console.error(error.toString());
      },
      () => {
        this.carregaDropDown();
      }
    ));
    this.carregaDropDown();
  }

  onMudaForm() {
    this.ct.resetTelefoneBusca();
    this.ct.novaBusca(this.criaBusca());
    delete this.ct.busca.ids;
    this.ct.buscaMenu();
    this.mi.hideMenu();
  }


  /*onMudaForm2() {
    this.cbs.resetContaBusca();
    this.cbs.cb = this.formMenuConta.getRawValue();
    if (this.formMenuConta.get('conta_tipo_id').value === 999) {
      this.cbs.cb.conta_tipo_id = null;
    }
    if (this.formMenuConta.get('conta_debito_automatico_id').value === 999) {
      this.cbs.cb.conta_debito_automatico_id = null;
    }
    if (this.formMenuConta.get('conta_paga_id').value === 999) {
      this.cbs.cb.conta_paga_id = null;
    }
    this.cbs.buscaMenu();
    this.mi.mudaMenuInterno(false);
    this.cs.mostraCarregador();
  }*/

  goIncluir() {
    if (this.aut.contabilidade_incluir) {
      const ref = this.dialogService.open(ContaFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'menu'
        },
        header: 'INCLUIR CONTA',
        width: '60%',
        styleClass: 'tablistagem',
        /*height: '50vh',*/
        dismissableMask: true,
        showHeader: true
      });
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
