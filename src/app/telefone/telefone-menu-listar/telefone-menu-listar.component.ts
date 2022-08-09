import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import {DropdownService, AutocompleteService, MenuInternoService} from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {TelefoneService} from "../_services/telefone.service";
import {TelefoneDropdownService} from "../_services/telefone-dropdown.service";
import {TelefoneBuscaInterface} from "../_models";
import {TelefoneFormService} from "../_services/telefone-form.service";

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
    private dd: DropdownService,
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
    this.tdd.getDD();
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
    let telefoneBusca: TelefoneBuscaInterface;
    telefoneBusca = this.formMenuTelefone.getRawValue();
    this.ts.novaBusca(telefoneBusca);
    this.ts.buscaMenu();
    this.mi.hideMenu();
  }

  goIncluir() {
    if (this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn || this.aut.telefone_incluir) {
      // this.es.acao = 'incluir';
      this.tfs.acao = 'incluir';
      this.mi.mudaMenuInterno(false);
      // this.router.navigate(['proposicao/incluir']);
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
