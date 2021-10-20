import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { MostraMenuService, DropdownService, AutocompleteService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { ContaBuscaService } from '../_services';
import { take } from 'rxjs/operators';
import { ContaFormularioComponent } from '../conta-formulario/conta-formulario.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ContaDropdown } from '../_models/conta-dropdown';

@Component({
  selector: 'app-conta-menu-listar',
  templateUrl: './conta-menu-listar.component.html',
  styleUrls: ['./conta-menu-listar.component.css'],
  providers: [ DialogService ]
})
export class ContaMenuListarComponent implements OnInit, OnDestroy {
  public formMenuConta: FormGroup;
  public items: Array<any> = [];
  ptBr: any;
  sub: Subscription[] = [];
  public sgt: string[];
  public ddConta_local_id: SelectItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private mm: MostraMenuService,
    public authenticationService: AuthenticationService,
    // private autocompleteservice: AutocompleteService,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    private router: Router,
    private cs: CarregadorService,
    private cd: ContaDropdown,
    private cbs: ContaBuscaService
  ) { }

  ngOnInit() {
    this.configuraCalendario();

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

    if (!this.cbs.buscaStateSN) {
      if (sessionStorage.getItem('conta-listagem')) {
        sessionStorage.removeItem('conta-listagem');
      }
      this.mm.mudaMenu(true);
    }

    this.sub.push(this.cbs.atualisaMenu$.subscribe(
      (dados: boolean) => {
        if (dados) {
          this.carregaDropDown();
        }
      }
    ));
  }

  configuraCalendario() {
    this.ptBr = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'septembro',
        'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy'
    };
  }

  carregaDropDown() {
    this.ddConta_local_id = JSON.parse(sessionStorage.getItem('conta-dropdown'));
    this.cs.escondeCarregador();
  }

  /*
  autoComp (event, campo) {
    let sg: any[];
    const tabela = campo.substring(0, campo.indexOf('_'));
    this.autocompleteservice.getACSimples3(tabela, campo, event.query)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          sg = dados;
        },
        error: err => console.error('FE-cadastro_datatable.postCadastroListarPaginacaoSort-ERRO-->', err),
        complete: () => {
          this.sgt = sg;
        }
      });
  }
  */

  onMudaForm() {
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
    this.mm.mudaMenu(false);
    this.cs.mostraCarregador();
  }

  goIncluir() {
    if (this.authenticationService.contabilidade_incluir) {
      const ref = this.dialogService.open(ContaFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'menu'
        },
        header: 'INCLUIR CONTA',
        width: '60%',
        height: '50vh',
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
