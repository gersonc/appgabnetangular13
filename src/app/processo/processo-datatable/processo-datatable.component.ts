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
  ProcessoArray,
  ProcessoBuscaCampoInterface,
  ProcessoDetalheInterface,
  ProcessoListagemInterface,
  ProcessoPaginacaoInterface,
  ProcessoTotalInterface
} from '../_models';
import { ProcessoBuscaService, ProcessoService } from '../_services';
import { ProcessoDetalheComponent } from '../processo-detalhe/processo-detalhe.component';
import {Config} from 'quill-to-word';
import * as quillToWord from 'quill-to-word';
import {saveAs} from 'file-saver';
import {Editor} from 'primeng/editor';


@Component({
  selector: 'app-processo-datatable',
  templateUrl: './processo-datatable.component.html',
  styleUrls: ['./processo-datatable.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ DialogService ]
})
export class ProcessoDatatableComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('dtpr', { static: true }) public dtpr: any;
  @ViewChild('edtor', { static: true }) public edtor: Editor;
  loading = false;
  cols: any[];
  currentPage = 1;
  processo: ProcessoListagemInterface[];
  prContexto: ProcessoListagemInterface;
  total: ProcessoTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: ProcessoListagemInterface[] = [];
  sortCampo = 'processo_status_nome';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: ProcessoBuscaCampoInterface[];
  altura = `${WindowsService.altura - 180}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  numColunas = 3;
  expColunas = 0;
  dadosExpandidos: Subscription;
  dadosExp: any[];
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  contextoMenu2: MenuItem[];
  contextoMenu3: MenuItem[];
  tmp = false;
  sub: Subscription[] = [];
  authAlterar = false;
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;
  buscaStateSN: boolean;
  public mostraMenu$: boolean;
  campoTexto: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;
  showDetalhe = false;
  proDetalhe: ProcessoDetalheInterface = null;

  constructor(
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    public dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private processoService: ProcessoService,
    private pbs: ProcessoBuscaService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {

    this.cols = [
      {field: 'processo_id', header: 'ID', sortable: 'true', largura: '60px'},
      {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', largura: '150px'},
      {field: 'processo_status_nome', header: 'SITUAÇÃO', sortable: 'true', largura: '150px'},

      {field: 'cadastro_tipo_nome', header: 'TP. SOLICITANTE', sortable: 'true', largura: '150px'},
      {field: 'cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '400px'},
      {field: 'cadastro_endereco', header: 'ENDEREÇO', sortable: 'true', largura: '300px'},
      {field: 'cadastro_endereco_numero', header: 'END. NÚMERO', sortable: 'true', largura: '170px'},
      {field: 'cadastro_endereco_complemento', header: 'END. COMPLEMENTO', sortable: 'true', largura: '170px'},
      {field: 'cadastro_bairro', header: 'BAIRRO', sortable: 'true', largura: '300px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
      {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', largura: '300px'},
      {field: 'cadastro_cep', header: 'CEP', sortable: 'true', largura: '100px'},
      {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', largura: '100px'},
      {field: 'cadastro_telefone', header: 'TELEFONE1', sortable: 'true', largura: '150px'},
      {field: 'cadastro_telefone2', header: 'TELEFONE2', sortable: 'true', largura: '150px'},
      {field: 'cadastro_telcom', header: 'TELEFONE3', sortable: 'true', largura: '150px'},
      {field: 'cadastro_celular', header: 'CELULAR1', sortable: 'true', largura: '150px'},
      {field: 'cadastro_celular2', header: 'CELULAR2', sortable: 'true', largura: '150px'},
      {field: 'cadastro_fax', header: 'FAX', sortable: 'true', largura: '150px'},
      {field: 'cadastro_email', header: 'E-MAIL1', sortable: 'true', largura: '200px'},
      {field: 'cadastro_email2', header: 'E-MAIL2', sortable: 'true', largura: '200px'},
      {field: 'cadastro_rede_social', header: 'FACEBOOK', sortable: 'true', largura: '200px'},
      {field: 'cadastro_outras_midias', header: 'OUTRAS MÍDIAS', sortable: 'true', largura: '200px'},
      {field: 'cadastro_data_nascimento', header: 'DT. NASC./FUNDAÇÃO', sortable: 'true', largura: '200px'},

      {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '100px'},
      {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '200px'},
      {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '400px'},
      {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '400px'},
      {field: 'solicitacao_indicacao_sn', header: 'INDICAÇÃO S/N', sortable: 'true', largura: '150px'},
      {field: 'solicitacao_indicacao_nome', header: 'INDICAÇÃO', sortable: 'true', largura: '300px'},
      {field: 'solicitacao_orgao', header: 'ORGÃO SOLICITADO', sortable: 'true', largura: '300px'},
      {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '250px'},
      {field: 'solicitacao_tipo_recebimento_nome', header: 'TP. RECEBIMENTO', sortable: 'true', largura: '200px'},
      {field: 'solicitacao_descricao', header: 'DESCRIÇÃO', sortable: 'true', largura: '400px'},
      {field: 'solicitacao_aceita_recusada', header: 'OBSERVAÇÕES', sortable: 'true', largura: '400px'},

      {field: 'oficio_codigo', header: 'OF. CÓDIGO', sortable: 'true', largura: '150px'},
      {field: 'oficio_numero', header: 'OF. Nº', sortable: 'true', largura: '100px'},
      {field: 'oficio_prioridade_nome', header: 'OF. PRIORIDADE', sortable: 'true', largura: '150px'},
      {field: 'oficio_convenio', header: 'OF. TP. CONVÊNIO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_emissao', header: 'OF. DT. EMISSÃO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_recebimento', header: 'OF. DT. RECEBIMENTO', sortable: 'true', largura: '200px'},
      {field: 'oficio_orgao_solicitado_nome', header: 'OF. ORG. SOLICITADO', sortable: 'true', largura: '300px'},
      {field: 'oficio_descricao_acao', header: 'OF. DESC. AÇÃO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_protocolo', header: 'OF. DT. PROTOCOLO', sortable: 'true', largura: '200px'},
      {field: 'oficio_protocolo_numero', header: 'OF. Nº PROTOCOLO', sortable: 'true', largura: '300px'},
      {field: 'oficio_orgao_protocolante_nome', header: 'OF. ORG. PROTOCOLANTE', sortable: 'true', largura: '300px'},
      {field: 'oficio_protocolante_funcionario', header: 'OF. ORG. PROT. FUNCIONÁRIO', sortable: 'true', largura: '300px'},
      {field: 'oficio_prazo', header: 'OF. PRAZO', sortable: 'true', largura: '200px'},
      {field: 'oficio_tipo_andamento_nome', header: 'OF. TIPO ANDAMENTO', sortable: 'true', largura: '200px'},
      {field: 'oficio_status_nome', header: 'OF. SITUAÇÃO', sortable: 'true', largura: '150px'},
      {field: 'oficio_valor_solicitado', header: 'OF. VL. SOLICITADO', sortable: 'true', largura: '200px'},
      {field: 'oficio_valor_recebido', header: 'OF. VL. RECEBIDO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_pagamento', header: 'OF. DT. PAGAMENTO', sortable: 'true', largura: '200px'},
      {field: 'oficio_data_empenho', header: 'OF. DT. EMPENHO', sortable: 'true', largura: '200px'},

      {field: 'oficio', header: 'OFÍCIOS', sortable: 'false', largura: '3000px'},

      {field: 'historico_data', header: 'HIST. DT.', sortable: 'true', largura: '200px'},
      {field: 'historico_andamento', header: 'HIST. ANDAMENTO', sortable: 'true', largura: '400px'},

      {field: 'historico', header: 'HISTÓRICOS', sortable: 'false', largura: '1000px'}

    ];

    if (sessionStorage.getItem('processo-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('processo-selectedColumns'));
      this.mapeiaColunasSelecionadas();
      sessionStorage.removeItem('processo-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [
      {label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {this.processoDetalheCompleto(this.prContexto); }}];

    if (this.authenticationService.usuario_responsavel_sn
      && (this.authenticationService.processo_indeferir
        || this.authenticationService.processo_deferir)) {
      this.authAnalisar = true;
      this.contextoMenu.push(
        {label: 'ANALISAR', icon: 'pi pi-exclamation-circle', style: {'font-size': '1em'},
          command: () => { this.processoAnalisar(this.prContexto); }});
    }

    if (this.authenticationService.processo_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => { this.processoApagar(this.prContexto); }});
    }

    this.contextoMenu2 = [
      {label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {this.processoDetalheCompleto(this.prContexto); }}];

    if (this.authenticationService.processo_apagar) {
      this.authApagar = true;
      this.contextoMenu2.push(
        {label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => { this.processoApagar(this.prContexto); }});
    }

    this.contextoMenu3 = this.contextoMenu;

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

    if (this.pbs.buscaStateSN) {
      this.getState();
    } else {
      this.cs.escondeCarregador();
      this.pbs.processoBusca.todos = false;
    }

    this.sub.push(this.pbs.busca$.subscribe(
      () => {
        this.pbs.processoBusca.todos = false;
        this.dtpr.reset();
        this.dtpr.selectionKeys = [];
        this.selecionados = [];
      }
    ));

  }

  // EVENTOS ===================================================================

  ngOnChanges() { }

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.pbs.processoBusca.sortcampo !== event.sortField.toString ()) {
        this.pbs.processoBusca.sortcampo = event.sortField.toString ();
      }
    }
    if (this.pbs.processoBusca.inicio !== event.first.toString()) {
      this.pbs.processoBusca.inicio = event.first.toString();
    }
    if (this.pbs.processoBusca.numlinhas !== event.rows.toString()) {
      this.pbs.processoBusca.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.pbs.processoBusca.sortorder !== event.sortOrder.toString()) {
      this.pbs.processoBusca.sortorder = event.sortOrder.toString();
    }
    if (!this.pbs.buscaStateSN) {
      this.postProcessoBusca();
    }
  }

  onRowExpand(event): void {
    this.sub.push(this.dadosExpandidos = this.processoService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.processoService.montaColunaExpandida(event.data);
  }

  onChangeSeletorColunas(changes): void {
    this.dtpr.saveState();
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
      this.postProcessoBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.prContexto = event.data;
    if (event.data.processo_status_nome.toString() !== 'EM ANDAMENTO') {
      this.contextoMenu3 = this.contextoMenu2;
    } else {
      this.contextoMenu3 = this.contextoMenu;
    }
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
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', largura: '150px'},
        {field: 'processo_status_nome', header: 'SITUAÇÃO', sortable: 'true', largura: '150px'},
        {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '100px'},
        {field: 'cadastro_tipo_nome', header: 'TP. SOLICITANTE', sortable: 'true', largura: '150px'},
        {field: 'cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '400px'},
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
        {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', largura: '300px'},
        {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', largura: '100px'},
        {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '400px'},
        {field: 'solicitacao_orgao', header: 'ORGÃO SOLICITADO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '400px'}
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({field: 'processo_id', header: 'ID'});
    this.selectedColumns.forEach( (c) => {
      this.camposSelecionados.push({field: c.field, header: c.header});
    });
  }

  // FUNCOES DE BUSCA ==========================================================

  postProcessoBusca(): void {
    this.pbs.processoBusca['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.processoService.postProcessoBusca(this.pbs.processoBusca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.processo = dados.processo;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.pbs.processoBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.pbs.processoBusca.inicio, 10) +
            parseInt(this.pbs.processoBusca.numlinhas, 10)) /
            parseInt(this.pbs.processoBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.pbs.criarProcessoBusca();
    this.pbs.processoBusca = JSON.parse(sessionStorage.getItem('processo-busca'));
    if (this.pbs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: ProcessoPaginacaoInterface }) => {
          this.processo = data.dados.processo;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.pbs.processoBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.pbs.processoBusca.inicio, 10) +
            parseInt(this.pbs.processoBusca.numlinhas, 10)) /
            parseInt(this.pbs.processoBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.pbs.buscaStateSN = false;
          sessionStorage.removeItem('processo-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================


  processoDetalheCompleto(pr: ProcessoListagemInterface) {
    this.cs.mostraCarregador();
    this.sub.push(this.processoService.getProcessoDetalhe(pr.processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.proDetalhe = dados;
        },
        error: (err) => {
          console.log ('erro', err.toString ());
        },
        complete: () => {
          this.showDetalhe = true;
          this.cs.escondeCarregador();
        }
      }));
  }


  processoApagar(pr: ProcessoListagemInterface) {
    if (this.authenticationService.processo_apagar) {
      this.cs.mostraCarregador();
      this.dtpr.saveState();
      sessionStorage.setItem('processo-busca', JSON.stringify(this.pbs.processoBusca));
      sessionStorage.setItem('processo-selectedColumns', JSON.stringify(this.selectedColumns));
      this.pbs.buscaStateSN = true;
      this.router.navigate(['/processo/excluir', pr.processo_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  processoAnalisar(pr: ProcessoListagemInterface) {
    if (pr.processo_status_nome !== 'EM ANDAMENTO') {
      this.messageService.add(
        {
          key: 'processoToast',
          severity: 'warn',
          summary: 'ANALIISE',
          detail: pr.processo_status_nome.toString()}
      );
    }
    if (this.authenticationService.usuario_responsavel_sn
      && (this.authenticationService.processo_deferir
        || this.authenticationService.processo_indeferir)
      && pr.processo_status_nome === 'EM ANDAMENTO') {
      // let proDetalhe: ProcessoDetalheInterface;
      this.cs.mostraCarregador();
      this.dtpr.saveState();
      sessionStorage.setItem('processo-busca', JSON.stringify(this.pbs.processoBusca));
      sessionStorage.setItem('processo-selectedColumns', JSON.stringify(this.selectedColumns));
      this.pbs.buscaStateSN = true;
      this.router.navigate(['/processo/analisar', pr.processo_id]);
    }

  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.pbs.processoBusca.todos;
    this.pbs.processoBusca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prPdf: ProcessoListagemInterface[];
      let totalPdf: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.processoService.postProcessoBusca(this.pbs.processoBusca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            prPdf = dados.processo;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('processo', this.camposSelecionados, prPdf);
            this.pbs.processoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('processo', this.camposSelecionados, this.selecionados);
      this.pbs.processoBusca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('processo', this.camposSelecionados, this.processo);
    this.pbs.processoBusca.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.pbs.processoBusca.todos;
    this.pbs.processoBusca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prprint: ProcessoListagemInterface[];
      let totalprint: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.processoService.postProcessoBusca(this.pbs.processoBusca)
        .subscribe({
          next: (dados) => {
            prprint = dados.processo;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, prprint);
            this.pbs.processoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.pbs.processoBusca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.processo);
    this.pbs.processoBusca.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.pbs.processoBusca.todos;
    this.pbs.processoBusca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prcsv: ProcessoListagemInterface[];
      let totalprint: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.processoService.postProcessoBusca (this.pbs.processoBusca)
        .subscribe ({
          next: (dados) => {
            prcsv = dados.processo;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv ('processo', this.camposSelecionados, prcsv);
            this.pbs.processoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv ('processo', this.camposSelecionados, this.selecionados);
      this.pbs.processoBusca.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv ('processo', this.camposSelecionados, this.processo);
    this.pbs.processoBusca.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.pbs.processoBusca.todos;
    this.pbs.processoBusca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prcsv: ProcessoListagemInterface[];
      let totalprint: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.processoService.postProcessoBusca (this.pbs.processoBusca)
        .subscribe ({
          next: (dados) => {
            prcsv = dados.processo;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile ('processo', prcsv, ProcessoArray.getArrayTitulo());
            this.pbs.processoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile ('processo', this.selecionados, ProcessoArray.getArrayTitulo());
      this.pbs.processoBusca.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile ('processo', this.processo, ProcessoArray.getArrayTitulo());
    this.pbs.processoBusca.todos = this.tmp;
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
  }

  escondeTexto() {
    this.campoTexto = null;
    this.deltaquill = null;
    this.campoTitulo = null;
    this.showCampoTexto = false;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.proDetalhe = null;
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
    const fileName = 'processo' + this.campoTitulo.toLowerCase() + '.docx';
    saveAs(blob, fileName);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
