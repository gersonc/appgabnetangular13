import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import {AutocompleteService, MenuInternoService} from '../../_services';
import { AuthenticationService } from '../../_services';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {TelefoneService} from "../_services/telefone.service";
import {TelefoneDropdownService} from "../_services/telefone-dropdown.service";
import {TelefoneFormService} from "../_services/telefone-form.service";
import {DateTime} from "luxon";
import {TelefoneBuscaInterface} from "../_models/telefone";

@Component({
  selector: 'app-telefone-menu-listar',
  templateUrl: './telefone-menu-listar.component.html',
  styleUrls: ['./telefone-menu-listar.component.css']
})
export class TelefoneMenuListarComponent implements OnInit, OnDestroy {
  public formMenuTelefone?: FormGroup;
  ptBr: any;
  sub: Subscription[] = [];
  public sgt?: string[];
  public ddTelefone_local_id: SelectItem[] = [];
  public ddTelefone_usuario_nome: SelectItem[] = [];
  public ddTelefone_tipo: SelectItem[] = [
    {label: 'Feitas', value: 2},
    {label: 'Recebidas', value: 1},
  ];
  public ddTelefone_resolvido: SelectItem[] = [
    {label: 'Todos', value: 999},
    {label: 'Resolvidos', value: 0},
    {label: 'Não resolvidos', value: 1},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private tdd: TelefoneDropdownService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private autocompleteservice: AutocompleteService,
    private router: Router,
    private ts: TelefoneService,
    private tfs: TelefoneFormService
  ) { }

  ngOnInit() {

    this.formMenuTelefone = this.formBuilder.group({
      telefone_assunto1: [null],
      telefone_assunto2: [null],
      telefone_data1: [null],
      telefone_data2: [null],
      telefone_ddd: [null],
      telefone_de: [null],
      telefone_local_id: [null],
      telefone_para: [null],
      telefone_resolvido: [999],
      telefone_telefone: [null],
      telefone_tipo: [2],
      telefone_usuario_nome: [null]
    });

    this.carregaDropDown();

    this.mi.showMenuInterno();
  }

  carregaDropDown() {
    if (sessionStorage.getItem('dropdown-local')) {
      this.ddTelefone_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
    }
    if (sessionStorage.getItem('telefone-dropdown')) {
      this.ddTelefone_usuario_nome = JSON.parse(sessionStorage.getItem('telefone-dropdown')!);
    }
    if (!sessionStorage.getItem('dropdown-local') || !sessionStorage.getItem('telefone-dropdown')) {
      this.getCarregaDropDown();
    }
  }

  getCarregaDropDown() {
    this.sub.push(this.tdd.resp$.subscribe(
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

  autoComp (event: any, campo: string) {
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

  onMudaForm() {
    this.ts.resetTelefoneBusca();
    this.ts.novaBusca(this.criaBusca());
    delete this.ts.busca.ids;
    this.ts.buscaMenu();
    this.mi.hideMenu();
  }

  criaBusca(): TelefoneBuscaInterface {
    const b: TelefoneBuscaInterface = {};
    const f = this.formMenuTelefone.getRawValue();
    if (f.telefone_assunto1 !== null) {
      b.telefone_assunto1 = f.telefone_assunto1;
      b.telefone_assunto1 = b.telefone_assunto1.toUpperCase();
    }
    if (f.telefone_assunto2 !== null && Array.isArray(f.telefone_assunto2)) {
      const c: string[] = f.telefone_assunto2;
      b.telefone_assunto2 = c.map(a => {return a.toUpperCase()});
    }
    if (f.telefone_data1 !== null) {
      b.telefone_data1 = DateTime.fromJSDate(f.telefone_data1).toFormat('yyyy-LL-dd HH:mm:ss');
    }
    if (f.telefone_data2 !== null) {
      b.telefone_data2 = DateTime.fromJSDate(f.telefone_data2).toFormat('yyyy-LL-dd HH:mm:ss');
    }
    if (f.telefone_ddd !== null) {
      b.telefone_ddd = f.telefone_ddd.toUpperCase();
    }
    if (f.telefone_para !== null) {
      b.telefone_para = f.telefone_para.toUpperCase();
    }
    if (f.telefone_de !== null) {
      b.telefone_de = f.telefone_de.toUpperCase();
    }
    if (f.telefone_usuario_nome !== null) {
      b.telefone_usuario_nome = f.telefone_usuario_nome.toUpperCase();
    }
    if (f.telefone_id !== undefined && f.telefone_id !== null) {
      b.telefone_id = +f.telefone_id;
    }
    if (f.telefone_local_id !== null) {
      b.telefone_local_id = +f.telefone_local_id;
    }
    if (f.telefone_tipo !== null) {
      b.telefone_tipo = +f.telefone_tipo;
    }
    if (f.telefone_resolvido !== null && +f.telefone_resolvido !== 999) {
      b.telefone_resolvido_id = +f.telefone_resolvido;
    }
    if (f.telefone_telefone !== null) {
      b.telefone_telefone = f.telefone_telefone.toUpperCase();
    }
    return b;
  }

  limpar() {
    this.formMenuTelefone = this.formBuilder.group({
      telefone_assunto1: [null],
      telefone_assunto2: [null],
      telefone_data1: [null],
      telefone_data2: [null],
      telefone_ddd: [null],
      telefone_de: [null],
      telefone_local_id: [null],
      telefone_para: [null],
      telefone_resolvido: [999],
      telefone_telefone: [null],
      telefone_tipo: [2],
      telefone_usuario_nome: [null]
    });
  }

  goIncluir() {
    if (this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn || this.aut.telefone_incluir) {
      this.tfs.acao = 'incluir';
      this.tfs.criaFormIncluir()
      this.mi.mudaMenuInterno(false);
      this.ts.showForm = true;
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  testaAssunto1(ev) {
    if (ev === null) {
      this.formMenuTelefone.get('telefone_assunto1').patchValue(null);
    }
  }

  onAddAssunto2(ev, ev2) {
    const v1: string = ev.value;
    const v2: string[] = ev2;
    if (v1.length < 4) {
      if (v2.length === 1) {
        this.formMenuTelefone.get('telefone_assunto2').patchValue(null);
      } else {
        ev2.pop();
        this.formMenuTelefone.get('telefone_assunto2').patchValue(ev2);
      }
    }
    console.log('onAddAssunto2',ev, ev2);
  }

  fechar() {
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
