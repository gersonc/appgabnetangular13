import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { MostraMenuService, DropdownService, AutocompleteService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { TelefoneBuscaService } from '../_services';
import { take } from 'rxjs/operators';
import { TelefoneFormularioComponent } from '../telefone-formulario/telefone-formulario.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-telefone-menu-listar',
  templateUrl: './telefone-menu-listar.component.html',
  styleUrls: ['./telefone-menu-listar.component.css'],
  providers: [ DialogService ]
})
export class TelefoneMenuListarComponent implements OnInit, OnDestroy {
  public formMenuTelefone?: FormGroup;
  public items: Array<any> = [];
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
    private mm: MostraMenuService,
    public authenticationService: AuthenticationService,
    private autocompleteservice: AutocompleteService,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    private router: Router,
    private cs: CarregadorService,
    private tbs: TelefoneBuscaService
  ) { }

  ngOnInit() {
    console.log('menuinit');
    this.configuraCalendario();

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

    if (!this.tbs.buscaStateSN) {
      if (sessionStorage.getItem('telefone-listagem')) {
        sessionStorage.removeItem('telefone-listagem');
      }
      this.mm.mudaMenu(true);
    }

    this.sub.push(this.tbs.atualisaMenu$.subscribe(
      (dados: boolean) => {
        if (dados) {
          this.ddTelefone_usuario_nome = JSON.parse(sessionStorage.getItem('telefone-dropdown')!);
        }}
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
    this.ddTelefone_local_id = JSON.parse(sessionStorage.getItem('dropdown-local')!);
    this.ddTelefone_usuario_nome = JSON.parse(sessionStorage.getItem('telefone-dropdown')!);
    this.cs.escondeCarregador();
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
    this.tbs.resetTelefoneBusca();
    this.tbs.tb = this.formMenuTelefone!.getRawValue();
    this.tbs.buscaMenu();
    this.mm.mudaMenu(false);
    this.cs.mostraCarregador();
  }

  goIncluir() {
    if (this.authenticationService.telefone_incluir) {
      const ref = this.dialogService.open(TelefoneFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'menu'
        },
        header: 'INCLUIR TELEFONEMA',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });
    }
  }

  onKey(event: any) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
