import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { WindowsService } from '../../_layout/_service';
import { AuthenticationService, CarregadorService, MenuInternoService, CsvService, ExcelService, PrintJSService, TabelaPdfService } from '../../_services';
import { OficioArray, OficioBuscaCampoInterface, OficioListagemInterface, OficioPaginacaoInterface, OficioTotalInterface } from '../_models';
import { OficioBuscaService, OficioService } from '../_services';
import {Config} from 'quill-to-word';
import * as quillToWord from 'quill-to-word';
import { saveAs } from 'file-saver';
import { Editor } from 'primeng/editor';

@Component({
  selector: 'app-oficio-datatable',
  templateUrl: './oficio-datatable.component.html',
  styleUrls: ['./oficio-datatable.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ DialogService ]
})
export class OficioDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtof', { static: true }) public dtof: any;
  @ViewChild('edtor', { static: true }) public edtor: Editor;
  loading = false;
  cols: any[];
  currentPage = 1;
  oficio: OficioListagemInterface[];
  ofContexto: OficioListagemInterface;
  total: OficioTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: OficioListagemInterface[] = [];
  sortCampo = 'oficio_status';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: OficioBuscaCampoInterface[];
  altura = `${WindowsService.altura - 150}` + 'px'; // 171.41 = 10.71rem = 10.71 * 16px
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
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;

  campoTexto: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;
  showDetalhe = false;
  ofiDetalhe: OficioListagemInterface = null;

  constructor(
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    public dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private oficioService: OficioService,
    private obs: OficioBuscaService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {

    this.cols = [
      {field: 'oficio_id', header: 'ID', sortable: 'true', largura: '80px'},
      {field: 'oficio_processo_numero', header: 'Nº PROCESSO', sortable: 'true', largura: '150px'},
      {field: 'oficio_codigo', header: 'CODIGO', sortable: 'true', largura: '150px'},
      {field: 'oficio_convenio', header: 'CONVENIO', sortable: 'true', largura: '150px'},
      {field: 'oficio_status', header: 'SITUAÇÃO', sortable: 'true', largura: '200px'},
      {field: 'oficio_numero', header: 'NÚMERO', sortable: 'true', largura: '150px'},
      {field: 'solicitacao_reponsavel_analize_nome', header: 'RESP. ANALISE', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_emissao', header: 'DT. EMISSÃO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_empenho', header: 'DT. EMPENHO', sortable: 'true', largura: '200px'},
      {field: 'oficio_tipo_solicitante_nome', header: 'TP. SOLICITANTE', sortable: 'true', largura: '250px'},
      {field: 'oficio_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
      {field: 'oficio_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
      {field: 'oficio_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
      {field: 'oficio_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
      {field: 'oficio_orgao_solicitado_nome', header: 'ORG. SOLICITADO', sortable: 'true', largura: '300px'},
      {field: 'oficio_orgao_protocolante_nome', header: 'ORG. PROTOCOLANTE', sortable: 'true', largura: '300px'},
      {field: 'oficio_protocolo_numero', header: 'Nº PROTOCOLO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_protocolo', header: 'DT. PROTOCOLO', sortable: 'true', largura: '200px'},
      {field: 'oficio_protocolante_funcionario', header: 'PROTOCOLO FUNCIONÁRIO', sortable: 'true', largura: '300px'},
      {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '250px'},
      {field: 'oficio_valor_solicitado', header: 'VL. SOLICITADO', sortable: 'true', largura: '200px'},
      {field: 'oficio_valor_recebido', header: 'VL. RECEBIDO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_pagamento', header: 'DT. PAGAMENTO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_recebimento', header: 'DT. RECEBIMENTO', sortable: 'true', largura: '200px'},
      {field: 'oficio_prazo', header: 'PRAZO', sortable: 'true', largura: '200px'},
      {field: 'oficio_prioridade_nome', header: 'PRIORIDADE', sortable: 'true', largura: '230px'},
      {field: 'oficio_tipo_andamento_nome', header: 'TP. ANDAMENTO', sortable: 'true', largura: '150px'},
      {field: 'oficio_tipo_recebimento_nome', header: 'TP. RECEBIMENTO', sortable: 'true', largura: '150px'}
    ];

    if (sessionStorage.getItem('oficio-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('oficio-selectedColumns'));
      sessionStorage.removeItem('oficio-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [
      {label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {this.oficioDetalheCompleto(this.ofContexto); }}];

    if (this.authenticationService.usuario_responsavel_sn
      && (this.authenticationService.oficio_indeferir
        || this.authenticationService.oficio_deferir)) {
      this.authAnalisar = true;
      this.contextoMenu.push(
        {label: 'ANALISAR', icon: 'pi pi-exclamation-circle', style: {'font-size': '1em'},
          command: () => { this.oficioAnalisar(this.ofContexto); }});
    }

    if (this.authenticationService.oficio_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {label: 'INCLUIR', icon: 'pi pi-plus', style: {'font-size': '1em'},
          command: () => { this.oficioIncluir(); }});
    }

    if (this.authenticationService.oficio_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => { this.oficioAlterar(this.ofContexto); }});
    }

    if (this.authenticationService.oficio_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => { this.oficioApagar(this.ofContexto); }});
    }

    this.itemsAcao = [
      {label: 'CSV', icon: 'pi pi-share-alt', style: {'font-size': '.9em'}, command: () => { this.exportToCsv(); }},
      {label: 'CSV - TODOS', icon: 'pi pi-share-alt', style: {'font-size': '.9em'}, command: () => { this.exportToCsv(true); }},
      {label: 'PDF', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => { this.mostraTabelaPdf(); }},
      {label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => { this.mostraTabelaPdf(true); }},
      {label: 'IMPRIMIR', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => { this.imprimirTabela(); }},
      {label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => { this.imprimirTabela(true); }},
      {label: 'EXCEL', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => { this.exportToXLSX(); }},
      {label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => { this.exportToXLSX(true); }}
    ];

    this.constroiExtendida();

    if (this.obs.buscaStateSN) {
      this.getState();
    } else {
      this.cs.escondeCarregador();
      this.obs.oficioBusca.todos = false;
    }

    this.sub.push(this.obs.busca$.subscribe(
      () => {
        this.obs.oficioBusca.todos = false;
        this.dtof.reset();
        this.dtof.selectionKeys = [];
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
      if (this.obs.oficioBusca.sortcampo !== event.sortField.toString ()) {
        this.obs.oficioBusca.sortcampo = event.sortField.toString ();
      }
    }
    if (this.obs.oficioBusca.inicio !== event.first.toString()) {
      this.obs.oficioBusca.inicio = event.first.toString();
    }
    if (this.obs.oficioBusca.numlinhas !== event.rows.toString()) {
      this.obs.oficioBusca.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.obs.oficioBusca.sortorder !== event.sortOrder.toString()) {
      this.obs.oficioBusca.sortorder = event.sortOrder.toString();
    }
    if (!this.obs.buscaStateSN) {
      this.postOficioBusca();
    }
  }

  onRowExpand(event): void {
    console.log('exp', event);
    this.oficioService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.oficioService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          console.log(dados);
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.oficioService.montaColunaExpandida(this.oficioService.expandidoDados);
  }

  onChangeSeletorColunas(changes): void {
    this.dtof.saveState();
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
      this.postOficioBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.ofContexto = event.data;
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
        {field: 'oficio_processo_numero', header: 'Nº PROCESSO', sortable: 'true', largura: '150px'},
        {field: 'oficio_status', header: 'SITUAÇÃO', sortable: 'true', largura: '200px'},
        {field: 'oficio_codigo', header: 'CODIGO', sortable: 'true', largura: '150px'},
        {field: 'oficio_numero', header: 'NÚMERO', sortable: 'true', largura: '150px'},
        {field: 'oficio_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
        {field: 'oficio_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
        {field: 'oficio_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'}
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({field: 'oficio_id', header: 'ID'});
    this.selectedColumns.forEach( (c) => {
      this.camposSelecionados.push({field: c.field, header: c.header});
    });
  }

  // FUNCOES DE BUSCA ==========================================================

  postOficioBusca(): void {
    this.obs.oficioBusca['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.oficioService.postOficioBusca(this.obs.oficioBusca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.oficio = dados.oficio;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.obs.oficioBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.obs.oficioBusca.inicio, 10) +
            parseInt(this.obs.oficioBusca.numlinhas, 10)) /
            parseInt(this.obs.oficioBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.obs.criarOficioBusca();
    this.obs.oficioBusca = JSON.parse(sessionStorage.getItem('oficio-busca'));
    console.log('ggg0');
    if (this.obs.buscaStateSN) {
      console.log('ggg1');
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: OficioPaginacaoInterface }) => {
          this.oficio = data.dados.oficio;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.obs.oficioBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.obs.oficioBusca.inicio, 10) +
            parseInt(this.obs.oficioBusca.numlinhas, 10)) /
            parseInt(this.obs.oficioBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.obs.buscaStateSN = false;
          sessionStorage.removeItem('oficio-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  oficioIncluir(): void {
    if (this.authenticationService.oficio_incluir) {
      this.cs.mostraCarregador();
      this.dtof.saveState();
      if (this.oficioService.expandidoDados) {
        this.oficioService.gravaColunaExpandida(this.oficioService.expandidoDados);
      }
      sessionStorage.setItem('oficio-busca', JSON.stringify(this.obs.oficioBusca));
      sessionStorage.setItem('oficio-selectedColumns', JSON.stringify(this.selectedColumns));
      this.obs.buscaStateSN = true;
      this.router.navigate(['/oficio/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  oficioDetalheCompleto(of: OficioListagemInterface) {
    this.ofiDetalhe = of;
    this.showDetalhe = true;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.ofiDetalhe = null;
  }

  oficioAlterar(of: OficioListagemInterface) {
    if (this.authenticationService.oficio_alterar) {
      this.cs.mostraCarregador();
      this.dtof.saveState();
      if (this.oficioService.expandidoDados) {
        this.oficioService.gravaColunaExpandida(this.oficioService.expandidoDados);
      }
      sessionStorage.setItem('oficio-busca', JSON.stringify(this.obs.oficioBusca));
      sessionStorage.setItem('oficio-selectedColumns', JSON.stringify(this.selectedColumns));
      this.obs.buscaStateSN = true;
      this.router.navigate(['/oficio/alterar', of.oficio_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  oficioApagar(of: OficioListagemInterface) {
    if (this.authenticationService.oficio_apagar) {
      this.cs.mostraCarregador();
      this.dtof.saveState();
      if (this.oficioService.expandidoDados) {
        this.oficioService.gravaColunaExpandida(this.oficioService.expandidoDados);
      }
      sessionStorage.setItem('oficio-busca', JSON.stringify(this.obs.oficioBusca));
      sessionStorage.setItem('oficio-selectedColumns', JSON.stringify(this.selectedColumns));
      this.obs.buscaStateSN = true;
      this.router.navigate(['/oficio/apagar', of.oficio_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  oficioAnalisar(of: OficioListagemInterface) {
    if (of.oficio_status !== 'EM ANDAMENTO') {
      this.messageService.add(
        {
          key: 'oficioToast',
          severity: 'warn',
          summary: 'ANALISE',
          detail: of.oficio_status.toString()}
      );
    }
    if ((this.authenticationService.usuario_responsavel_sn
      || this.authenticationService.usuario_principal_sn)
      || (this.authenticationService.oficio_deferir
      || this.authenticationService.oficio_indeferir)
      && of.oficio_status === 'EM ANDAMENTO') {
      this.cs.mostraCarregador();
      this.dtof.saveState();
      if (this.oficioService.expandidoDados) {
        this.oficioService.gravaColunaExpandida(this.oficioService.expandidoDados);
      }
      sessionStorage.setItem('oficio-busca', JSON.stringify(this.obs.oficioBusca));
      sessionStorage.setItem('oficio-selectedColumns', JSON.stringify(this.selectedColumns));
      this.obs.buscaStateSN = true;
      this.router.navigate(['/oficio/analisar', of.oficio_id]);
    }

  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.obs.oficioBusca.todos;
    this.obs.oficioBusca.todos = td;
    if (this.obs.oficioBusca.todos === true) {
      let ofPdf: OficioListagemInterface[];
      let totalPdf: OficioTotalInterface;
      let numTotalRegs: number;
      this.obs.oficioBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.oficioService.postOficioBusca(this.obs.oficioBusca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ofPdf = dados.oficio;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('oficio', this.camposSelecionados, ofPdf);
            this.obs.oficioBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('oficio', this.camposSelecionados, this.selecionados);
      this.obs.oficioBusca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('oficio', this.camposSelecionados, this.oficio);
    this.obs.oficioBusca.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.obs.oficioBusca.todos;
    this.obs.oficioBusca.todos = td;
    if (this.obs.oficioBusca.todos === true) {
      let ofprint: OficioListagemInterface[];
      let totalprint: OficioTotalInterface;
      let numTotalRegs: number;
      this.obs.oficioBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.oficioService.postOficioBusca(this.obs.oficioBusca)
        .subscribe({
          next: (dados) => {
            ofprint = dados.oficio;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, ofprint);
            this.obs.oficioBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.obs.oficioBusca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.oficio);
    this.obs.oficioBusca.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.obs.oficioBusca.todos;
    this.obs.oficioBusca.todos = td;
    if (this.obs.oficioBusca.todos === true) {
      let ofcsv: OficioListagemInterface[];
      let totalprint: OficioTotalInterface;
      let numTotalRegs: number;
      this.obs.oficioBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.oficioService.postOficioBusca (this.obs.oficioBusca)
        .subscribe ({
          next: (dados) => {
            ofcsv = dados.oficio;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv ('oficio', this.camposSelecionados, ofcsv);
            this.obs.oficioBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv ('oficio', this.camposSelecionados, this.selecionados);
      this.obs.oficioBusca.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv ('oficio', this.camposSelecionados, this.oficio);
    this.obs.oficioBusca.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.obs.oficioBusca.todos;
    this.obs.oficioBusca.todos = td;
    if (this.obs.oficioBusca.todos === true) {
      let ofcsv: OficioListagemInterface[];
      let totalprint: OficioTotalInterface;
      let numTotalRegs: number;
      this.obs.oficioBusca['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.oficioService.postOficioBusca (this.obs.oficioBusca)
        .subscribe ({
          next: (dados) => {
            ofcsv = dados.oficio;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile ('oficio', ofcsv, OficioArray.getArrayTitulo());
            this.obs.oficioBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile ('oficio', this.selecionados, OficioArray.getArrayTitulo());
      this.obs.oficioBusca.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile ('oficio', this.oficio, OficioArray.getArrayTitulo());
    this.obs.oficioBusca.todos = this.tmp;
    return true;
  }

  mostraTexto(texto: any[]) {
    this.campoTitulo = null;
    this.campoTexto = null;
    this.deltaquill = null;
    this.campoTitulo = texto[0];
    this.showCampoTexto = true;
    if (texto[4]) {
      if (this.edtor.getQuill()) {
        this.edtor.getQuill().deleteText(0, this.edtor.getQuill().getLength());
      }
      this.deltaquill = JSON.parse(texto[4]);
      setTimeout( () => {
        this.edtor.getQuill().updateContents(this.deltaquill, 'api');
      }, 300);
    } else {
      this.campoTexto = texto[1];
    }
    console.log('deltaquill', this.deltaquill);
  }

  escondeTexto() {
    this.campoTexto = null;
    this.deltaquill = null;
    this.campoTitulo = null;
    this.showCampoTexto = false;
  }

  toWord() {

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

  constroiExtendida() {
    const v = this.oficioService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.oficioService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.oficioService.montaColunaExpandida(v);
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
