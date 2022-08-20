import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import {MenuInternoService} from '../../_services';
import { AuthenticationService} from '../../_services';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {ContaDropdownMenuService} from "../_services/conta-dropdown-menu.service";
import {DateTime} from "luxon";
import {ContaService} from "../_services/conta.service";
import {ContaFormService} from "../_services/conta-form.service";
import {ContaBuscaI} from "../_models/conta-i";



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
      // conta_debito_automatico_id: [999],
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
    this.ct.resetContaBusca();
    this.ct.novaBusca(this.criaBusca());
    delete this.ct.busca.ids;
    this.ct.buscaMenu();
    this.mi.hideMenu();
  }

  criaBusca(): ContaBuscaI {
    let b: ContaBuscaI = {};
    const f = this.formMenuConta.getRawValue();

    if (f.cedente_array !== null && Array.isArray(f.cedente_array)) {
      const c: string[] = f.cedente_array;
      b.cedente_array = c.map(a => {return a.toUpperCase()});
    }
    if (f.conta_vencimento_1data !== null) {
      b.conta_vencimento_1data = DateTime.fromJSDate(f.conta_vencimento_1data).toSQLDate();
    }
    if (f.conta_vencimento_2data !== null) {
      b.conta_vencimento_2data = DateTime.fromJSDate(f.conta_vencimento_2data).toSQLDate();
    }
    if (f.conta_pagamento_1data !== null) {
      b.conta_pagamento_1data = DateTime.fromJSDate(f.conta_pagamento_1data).toSQLDate();
    }
    if (f.conta_pagamento_2data !== null) {
      b.conta_pagamento_2data = DateTime.fromJSDate(f.conta_pagamento_2data).toSQLDate();
    }
    /*if (f.conta_debito_automatico_id !== undefined && f.conta_debito_automatico_id !== null && f.conta_debito_automatico_id !== 999) {
      b.conta_debito_automatico_id = +f.conta_debito_automatico_id;
    }*/
    if (f.conta_local_id !== undefined && f.conta_local_id !== null && f.conta_local_id !== 999) {
      b.conta_local_id = +f.conta_local_id;
    }
    if (f.conta_tipo_id !== undefined && f.conta_tipo_id !== null && f.conta_tipo_id !== 999) {
      b.conta_tipo_id = +f.conta_tipo_id;
    }
    if (f.conta_paga_id !== undefined && f.conta_paga_id !== null && f.conta_paga_id !== 999) {
      b.conta_paga_id = +f.conta_paga_id;
    }

    return b;
  }

  limpar() {
    this.formMenuConta.reset();
    this.criaFormMenu();
  }

  onAddCedente(ev, ev2) {
    const v1: string = ev.value;
    const v2: string[] = ev2;
    if (v1.length < 2) {
      if (v2.length === 1) {
        this.formMenuConta.get('cedente_array').patchValue(null);
      } else {
        ev2.pop();
        this.formMenuConta.get('cedente_array').patchValue(ev2);
      }
    }
    console.log('onAddAssunto2',ev, ev2);
  }

  goIncluir() {
    if (this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn || this.aut.telefone_incluir) {
      this.cfs.acao = 'incluir';
      this.cfs.criaFormIncluir()
      this.mi.mudaMenuInterno(false);
      this.ct.showForm = true;
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
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

  /*goIncluir() {
    if (this.aut.contabilidade_incluir) {
      const ref = this.dialogService.open(ContaFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'menu'
        },
        header: 'INCLUIR CONTA',
        width: '60%',
        styleClass: 'tablistagem',
        /!*height: '50vh',*!/
        dismissableMask: true,
        showHeader: true
      });
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }*/

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
