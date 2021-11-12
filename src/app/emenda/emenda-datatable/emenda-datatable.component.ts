import { Component, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, SelectItem, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { WindowsService } from '../../_layout/_service';
import {AuthenticationService, CarregadorService, MenuInternoService} from '../../_services';
import {
  CsvService,
  ExcelService,
  MostraMenuService,
  PrintJSService,
  TabelaPdfService
} from '../../_services';
import {
  EmendaArray,
  EmendaBuscaCampoInterface,
  EmendaDetalheInterface,
  EmendaInterface,
  EmendaListarInterface,
  EmendaPaginacaoInterface,
  EmendaTotalInterface, HistoricoEmendaInterface
} from '../_models';
import { EmendaBuscaService, EmendaService } from '../_services';
import { EmendaDetalheComponent } from '../emenda-detalhe/emenda-detalhe.component';
import {EmendaAtualizarComponent} from "../emenda-atualizar/emenda-atualizar.component";
import {TarefaListarInterface} from "../../tarefa/_models";
import {Editor} from "primeng/editor";
import {Config} from "quill-to-word";
import * as quillToWord from "quill-to-word";
import {saveAs} from "file-saver";


@Component({
  selector: 'app-emenda-datatable',
  templateUrl: './emenda-datatable.component.html',
  styleUrls: ['./emenda-datatable.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ DialogService ]
})
export class EmendaDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('edtor', { static: true }) public edtor: Editor;
  @ViewChild('dtem', { static: true }) public dtem: any;
  loading = false;
  cols: any[];
  currentPage = 1;
  emenda: EmendaListarInterface[];
  emContexto: EmendaListarInterface;
  total: EmendaTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: EmendaListarInterface[] = [];
  sortCampo = 'emenda_status';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: EmendaBuscaCampoInterface[];
  altura = `${WindowsService.altura - 180}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  numColunas = 3;
  expColunas = 0;
  dadosExpandidos: Subscription;
  expandidoDados: any = false;
  dadosExp: any[];
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  tmp = false;
  sub: Subscription[] = [];
  authAlterar = false;
  authApagar = false;
  authIncluir = false;
  justificativa: string = null;
  historico_emenda: HistoricoEmendaInterface[] = null;
  // buscaStateSN: boolean;
  // public mostraMenu$: boolean;
  campoTexto: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;

  constructor(
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    public dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private emendaService: EmendaService,
    private ebs: EmendaBuscaService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {

    this.cols = [
      {field: 'emenda_id', header: 'ID', sortable: 'true', largura: '80px'},
      {field: 'emenda_cadastro_tipo_nome', header: 'TIPO DE SOLICITANTE', sortable: 'true', largura: '150px'},
      {field: 'emenda_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '150px'},
      {field: 'emenda_autor_tipo_nome', header: 'TIPO DE AUTOR', sortable: 'true', largura: '150px'},
      {field: 'emenda_autor_nome', header: 'AUTOR', sortable: 'true', largura: '200px'},
      {field: 'emenda_situacao', header: 'SITUAÇÃO', sortable: 'true', largura: '150px'},
      {field: 'emenda_numero', header: 'NÚM EMENDA', sortable: 'true', largura: '200px'},
      {field: 'emenda_funcional_programatica', header: 'FUNC. PROGRAMÁTICA', sortable: 'true', largura: '200px'},
      {field: 'emenda_orgao_solicitado_nome', header: 'ORGÃO SOLICITADO', sortable: 'true', largura: '200px'},
      {field: 'emenda_numero_protocolo', header: 'NUM. PROTOCOLO', sortable: 'true', largura: '250px'},
      {field: 'emenda_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
      {field: 'emenda_data_solicitacao', header: 'DT. SOLICITAÇÃO', sortable: 'true', largura: '300px'},
      {field: 'emenda_processo', header: 'CONTRATO/PROCESSO', sortable: 'true', largura: '300px'},
      {field: 'emenda_tipo_emenda_nome', header: 'TIPO DE EMENDA', sortable: 'true', largura: '300px'},
      {field: 'emenda_ogu_nome', header: 'O.G.U.', sortable: 'true', largura: '300px'},
      {field: 'emenda_valor_solicitadado', header: 'VL. SOLICITADO', sortable: 'true', largura: '300px'},
      {field: 'emenda_valor_empenhado', header: 'VL. EMPENHADO', sortable: 'true', largura: '200px'},
      {field: 'emenda_data_empenho', header: 'DT. EMPENHO', sortable: 'true', largura: '200px'},
      {field: 'emenda_numero_empenho', header: 'NUM EMPENHO', sortable: 'true', largura: '300px'},
      {field: 'emenda_crnr', header: 'CR.NR.', sortable: 'true', largura: '250px'},
      {field: 'emenda_gmdna', header: 'GND/MA', sortable: 'true', largura: '200px'},
      {field: 'emenda_ebservacao_pagamento', header: 'INFO. PGTO', sortable: 'true', largura: '200px'},
      {field: 'emenda_data_pagamento', header: 'DT. PAGAMENTO', sortable: 'true', largura: '200px'},
      {field: 'emenda_valor_pago', header: 'VL PAGAMENTO', sortable: 'true', largura: '200px'},
      {field: 'emenda_numero_ordem_bancaria', header: 'ORD. BANCÁRIA', sortable: 'true', largura: '200px'},
      {field: 'emenda_justificativa', header: 'JUSTIFICATIVA', sortable: 'true', largura: '230px'},
      {field: 'emenda_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '150px'},
      {field: 'emenda_uggestao', header: 'UG/GESTÃO', sortable: 'true', largura: '150px'},
      {field: 'emenda_siconv', header: 'SICONV', sortable: 'true', largura: '150px'},
      {field: 'emenda_regiao', header: 'REGIÃO', sortable: 'true', largura: '150px'},
      {field: 'emenda_contrato', header: 'CONTRATO CAIXA', sortable: 'true', largura: '150px'},
      {field: 'emenda_porcentagem', header: '% CONCLUIDA', sortable: 'true', largura: '150px'},
      {field: 'cadastro_cpfcnpj', header: 'CPF/CNPJ', sortable: 'true', largura: '150px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '150px'},
    ];

    if (sessionStorage.getItem('emenda-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('emenda-selectedColumns'));
      sessionStorage.removeItem('emenda-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [
      {label: 'DETALHES', icon: 'fas fa-lg fa-glasses', style: {'font-size': '1em'},
        command: () => {this.emendaDetalheCompleto(this.emContexto); }}];

    if (this.authenticationService.emenda_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {label: 'INCLUIR', icon: 'far fa-lg fa-address-card', style: {'font-size': '1em'},
          command: () => { this.emendaIncluir(); }});
    }

    if (this.authenticationService.emenda_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {label: 'ALTERAR', icon: 'fas fa-lg fa-pen-fancy', style: {'font-size': '1em'},
          command: () => { this.emendaAlterar(this.emContexto); }});
    }

    if (this.authenticationService.emenda_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {label: 'ATUALIZAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => { this.emendaAtualizar(this.emContexto); }});
    }

    if (this.authenticationService.emenda_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {label: 'APAGAR', icon: 'far fa-lg fa-trash-alt', style: {'font-size': '1em'},
          command: () => { this.emendaApagar(this.emContexto); }});
    }

    this.itemsAcao = [
      {label: 'CSV', icon: 'fas fa-lg fa-file-csv', style: {'font-size': '.9em'}, command: () => { this.exportToCsv(); }},
      {label: 'CSV - TODOS', icon: 'fas fa-lg fa-file-csv', style: {'font-size': '.9em'}, command: () => { this.exportToCsv(true); }},
      {label: 'PDF', icon: 'fas fa-lg fa-file-pdf', style: {'font-size': '1em'}, command: () => { this.mostraTabelaPdf(); }},
      {label: 'PDF - TODOS', icon: 'far fa-lg fa-file-pdf', style: {'font-size': '.9em'}, command: () => { this.mostraTabelaPdf(true); }},
      {label: 'IMPRIMIR', icon: 'fas fa-lg fa-print', style: {'font-size': '1em'}, command: () => { this.imprimirTabela(); }},
      {label: 'IMPRIMIR - TODOS', icon: 'fas fa-lg fa-print', style: {'font-size': '.9em'}, command: () => { this.imprimirTabela(true); }},
      {label: 'EXCEL', icon: 'fas fa-lg fa-file-excel', style: {'font-size': '1em'}, command: () => { this.exportToXLSX(); }},
      {label: 'EXCEL - TODOS', icon: 'far fa-lg fa-file-excel', style: {'font-size': '.9em'}, command: () => { this.exportToXLSX(true); }}
    ];

    this.constroiExtendida();

    if (this.ebs.buscaStateSN) {
      this.getState();
    } else {
      this.ebs.emendaBusca.todos = false;
    }

    this.sub.push(this.ebs.busca$.subscribe(
      () => {
        this.ebs.emendaBusca.todos = false;
        this.dtem.reset();
        this.dtem.selectionKeys = [];
        this.selecionados = [];
      }
    ));
  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.ebs.emendaBusca.sortcampo !== event.sortField.toString ()) {
        this.ebs.emendaBusca.sortcampo = event.sortField.toString ();
      }
    }
    if (this.ebs.emendaBusca.inicio !== event.first.toString()) {
      this.ebs.emendaBusca.inicio = event.first.toString();
    }
    if (this.ebs.emendaBusca.numlinhas !== event.rows.toString()) {
      this.ebs.emendaBusca.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.ebs.emendaBusca.sortorder !== event.sortOrder.toString()) {
      this.ebs.emendaBusca.sortorder = event.sortOrder.toString();
    }
    if (!this.ebs.buscaStateSN) {
      this.postEmendaBusca();
    }
  }

  onRowExpand(event): void {
    this.emendaService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.emendaService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    if (event.data.historico_emenda) {
      this.historico_emenda = event.data.historico_emenda;
    } else {
      this.historico_emenda = null;
    }
    if (event.data.emenda_justificativa) {
      this.justificativa = event.data.emenda_justificativa;
    } else {
      this.justificativa = null;
    }
    this.emendaService.montaColunaExpandida(this.emendaService.expandidoDados);
  }

  onChangeSeletorColunas(changes): void {
    this.dtem.saveState();
    this.camposSelecionados = null;
    this.camposSelecionados = changes.value.map(
      function (val) { return { field: val.field, header: val.header }; });
  }

  mostraSelectColunas(): void {
    this.selectedColumnsOld = this.selectedColumns;
    this.mostraSeletor = true;
  }

  hideSeletor(ev): void {
    if (this.selectedColumnsOld !== this.selectedColumns) {
      this.postEmendaBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.emContexto = event.data;
  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mostraLoader(vf: boolean) {
    this.loading = vf;
  }

  resetSelectedColumns(): void {
    if (this.selectedColumns.length <= 1) {
      this.selectedColumns = [
        {field: 'emenda_cadastro_tipo_nome', header: 'TIPO DE SOLICITANTE', sortable: 'true', largura: '150px'},
        {field: 'emenda_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '150px'},
        {field: 'emenda_autor_nome', header: 'AUTOR', sortable: 'true', largura: '200px'},
        {field: 'emenda_situacao', header: 'SITUAÇÃO', sortable: 'true', largura: '150px'},
        {field: 'emenda_numero', header: 'NÚM EMENDA', sortable: 'true', largura: '200px'},
        {field: 'emenda_funcional_programatica', header: 'FUNC. PROGRAMÁTICA', sortable: 'true', largura: '200px'},
        {field: 'emenda_orgao_solicitado_nome', header: 'ORGÃO SOLICITADO', sortable: 'true', largura: '200px'},
        {field: 'emenda_numero_protocolo', header: 'NUM. PROTOCOLO', sortable: 'true', largura: '250px'},
        {field: 'emenda_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
        {field: 'cadastro_cpfcnpj', header: 'CPF/CNPJ', sortable: 'true', largura: '150px'},
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '150px'},
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({field: 'emenda_id', header: 'ID'});
    this.selectedColumns.forEach( (c) => {
      this.camposSelecionados.push({field: c.field, header: c.header});
    });
  }

  // FUNCOES DE BUSCA ==========================================================

  postEmendaBusca(): void {
    this.ebs.emendaBusca['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.emendaService.postEmendaBusca(this.ebs.emendaBusca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.emenda = dados.emenda;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.ebs.emendaBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.ebs.emendaBusca.inicio, 10) +
            parseInt(this.ebs.emendaBusca.numlinhas, 10)) /
            parseInt(this.ebs.emendaBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.ebs.criarEmendaBusca();
    this.ebs.emendaBusca = JSON.parse(sessionStorage.getItem('emenda-busca'));
    if (this.ebs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: EmendaPaginacaoInterface }) => {
          this.emenda = data.dados.emenda;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.ebs.emendaBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.ebs.emendaBusca.inicio, 10) +
            parseInt(this.ebs.emendaBusca.numlinhas, 10)) /
            parseInt(this.ebs.emendaBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.ebs.buscaStateSN = false;
          sessionStorage.removeItem('emenda-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  emendaIncluir(): void {
    if (this.authenticationService.emenda_incluir) {
      this.cs.mostraCarregador();
      this.dtem.saveState();
      if (this.emendaService.expandidoDados) {
        this.emendaService.gravaColunaExpandida(this.emendaService.expandidoDados);
      }
      sessionStorage.setItem('emenda-busca', JSON.stringify(this.ebs.emendaBusca));
      sessionStorage.setItem('emenda-selectedColumns', JSON.stringify(this.selectedColumns));
      this.ebs.buscaStateSN = true;
      this.router.navigate(['/emenda/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  emendaDetalheCompleto(em: EmendaListarInterface) {
    const ref = this.dialogService.open(EmendaDetalheComponent, {
      data: {
        emenda: em
      },
      header: 'EMENDA DETALHE',
      width: '60%',
      height: '90vh',
      dismissableMask: false,
      showHeader: true
    });
  }

  emendaAtualizar(em: EmendaListarInterface) {
    const ref = this.dialogService.open(EmendaAtualizarComponent, {
      data: {
        emenda: em
      },
      header: 'EMENDA ATUALIZAR',
      width: '500px',
      dismissableMask: false,
      showHeader: true
    });
    this.sub.push(ref.onClose.subscribe((res?: EmendaListarInterface) => {
      if (res) {
        const tmp = this.emenda.find(i =>
          i.emenda_id === res.emenda_id
        );
        if (tmp !== undefined) {
          this.emenda[this.emenda.indexOf(tmp)] = res;
        }
      }
    }));
  }

  emendaAlterar(em: EmendaListarInterface) {
    if (this.authenticationService.emenda_alterar) {
      this.cs.mostraCarregador();
      this.dtem.saveState();
      if (this.emendaService.expandidoDados) {
        this.emendaService.gravaColunaExpandida(this.emendaService.expandidoDados);
      }
      sessionStorage.setItem('emenda-busca', JSON.stringify(this.ebs.emendaBusca));
      sessionStorage.setItem('emenda-selectedColumns', JSON.stringify(this.selectedColumns));
      this.ebs.buscaStateSN = true;
      this.router.navigate(['/emenda/alterar', em]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  emendaApagar(em: EmendaListarInterface) {
    if (this.authenticationService.emenda_apagar) {
      this.cs.mostraCarregador();
      this.dtem.saveState();
      if (this.emendaService.expandidoDados) {
        this.emendaService.gravaColunaExpandida(this.emendaService.expandidoDados);
      }
      sessionStorage.setItem('emenda-busca', JSON.stringify(this.ebs.emendaBusca));
      sessionStorage.setItem('emenda-selectedColumns', JSON.stringify(this.selectedColumns));
      this.ebs.buscaStateSN = true;
      this.emendaService.emendaExcluir = em;
      this.router.navigate(['/emenda/apagar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.ebs.emendaBusca.todos;
    this.ebs.emendaBusca.todos = td;
    if (this.ebs.emendaBusca.todos === true) {
      let emPdf: EmendaInterface[];
      let totalPdf: EmendaTotalInterface;
      let numTotalRegs: number;
      this.ebs.emendaBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.emendaService.postEmendaBusca(this.ebs.emendaBusca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            emPdf = dados.emenda;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('emenda', this.camposSelecionados, emPdf);
            this.ebs.emendaBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('emenda', this.camposSelecionados, this.selecionados);
      this.ebs.emendaBusca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('emenda', this.camposSelecionados, this.emenda);
    this.ebs.emendaBusca.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.ebs.emendaBusca.todos;
    this.ebs.emendaBusca.todos = td;
    if (this.ebs.emendaBusca.todos === true) {
      let emprint: EmendaInterface[];
      let totalprint: EmendaTotalInterface;
      let numTotalRegs: number;
      this.ebs.emendaBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.emendaService.postEmendaBusca(this.ebs.emendaBusca)
        .subscribe({
          next: (dados) => {
            emprint = dados.emenda;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, emprint);
            this.ebs.emendaBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.ebs.emendaBusca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.emenda);
    this.ebs.emendaBusca.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.ebs.emendaBusca.todos;
    this.ebs.emendaBusca.todos = td;
    if (this.ebs.emendaBusca.todos === true) {
      let emcsv: EmendaInterface[];
      let totalprint: EmendaTotalInterface;
      let numTotalRegs: number;
      this.ebs.emendaBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.emendaService.postEmendaBusca (this.ebs.emendaBusca)
        .subscribe ({
          next: (dados) => {
            emcsv = dados.emenda;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv ('emenda', this.camposSelecionados, emcsv);
            this.ebs.emendaBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv ('emenda', this.camposSelecionados, this.selecionados);
      this.ebs.emendaBusca.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv ('emenda', this.camposSelecionados, this.emenda);
    this.ebs.emendaBusca.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.ebs.emendaBusca.todos;
    this.ebs.emendaBusca.todos = td;
    if (this.ebs.emendaBusca.todos === true) {
      let emcsv: EmendaInterface[];
      let totalprint: EmendaTotalInterface;
      let numTotalRegs: number;
      this.ebs.emendaBusca['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.emendaService.postEmendaBusca (this.ebs.emendaBusca)
        .subscribe ({
          next: (dados) => {
            emcsv = dados.emenda;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile ('emenda', emcsv, EmendaArray.getArrayTitulo());
            this.ebs.emendaBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile ('emenda', this.selecionados, EmendaArray.getArrayTitulo());
      this.ebs.emendaBusca.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile ('emenda', this.emenda, EmendaArray.getArrayTitulo());
    this.ebs.emendaBusca.todos = this.tmp;
    return true;
  }

  constroiExtendida() {
    const v = this.emendaService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.emendaService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.emendaService.montaColunaExpandida(v);
    }
  }

  mostraTexto(texto: string) {
    this.showCampoTexto = true;
  }

  escondeTexto() {
    this.showCampoTexto = false;
  }

  async exportWord() {

    const config: Config = {
      paragraphStyles: {
        header_1: {
          paragraph: {
            spacing: {
              before: 3000,
              after: 1500
            }
          },
          run: {
            size: 12,
            bold: false,
            color: 'ffffff'
          }
        }
      },
      exportAs: 'blob'
    };

    // this.quillInstance = ev.getQuill();
    // Here is your export function
    // Typically this would be triggered by a click on an export button

    // const delta = this.quillInstance.getContents();

    const blob: any = await quillToWord.generateWord(this.deltaquill, config);
    // const blob: any = await quillToWord.generateWord(delta, this.quillToWordConfig);
    const fileName = 'solicitação_' + this.campoTitulo.toLowerCase() + '.docx';
    saveAs(blob, fileName);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
