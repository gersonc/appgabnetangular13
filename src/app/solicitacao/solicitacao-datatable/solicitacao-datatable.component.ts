import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { WindowsService } from '../../_layout/_service';
import { AuthenticationService, CarregadorService, MenuInternoService, V} from '../../_services';
import {
  CsvService,
  ExcelService,
  PrintJSService,
  TabelaPdfService
} from '../../_services';
import {
  SolicitacaoTotalInterface,
  SolicitacaoPaginacaoInterface,
  SolicitacaoBuscaCampoInterface,
  SolicitacaoDetalheInterface,
  SolicitacaoInterfaceExcel,
  SolicitacaoListar12Interface,
  SolicitacaoListar345Interface, SolicitacaoExcel12
} from '../_models';
import { SolicitacaoService, SolicitacaoBuscarService } from '../_services';
import {Editor} from 'primeng/editor';
import { saveAs } from 'file-saver';
import * as quillToWord from 'quill-to-word';
import {Config} from 'quill-to-word';

@Component({
  selector: 'app-solicitacao-datatable',
  templateUrl: './solicitacao-datatable.component.html',
  styleUrls: ['./solicitacao-datatable.component.css'],
})

export class SolicitacaoDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtsol', { static: true }) public dtsol: any;
  @ViewChild('edtor', { static: true }) public edtor: Editor;
  loading = false;
  cols: any[];
  currentPage = 1;
  solicitacoes: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
  solContexto: SolicitacaoListar12Interface | SolicitacaoListar345Interface;
  total: SolicitacaoTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[] = [];
  sortCampo = 'solicitacao_posicao2';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: SolicitacaoBuscaCampoInterface[];
  /*altura = `${WindowsService.altura - 180}` + 'px';*/
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
  cfg: any;
  cfgVersao: number;
  campoTexto: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;
  showDetalhe = false;
  solDetalhe: SolicitacaoDetalheInterface = null;


  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private solicitacaoService: SolicitacaoService,
    private sbs: SolicitacaoBuscarService,
    private cs: CarregadorService
  ) {
    this.cfg = aut.versao.solicitacao;
    this.cfgVersao = +aut.versao_id;
    this.solicitacaoService.cfg = aut.versao.solicitacao;
    this.solicitacaoService.cfgVersao = +aut.versao_id;
  }

  ngOnInit() {
    this.solicitacaoService.definirCampo();

    if (this.cfg.varsao_id <= 2) {
      this.cols = [
        {field: 'solicitacao_id', header: 'ID', sortable: 'true', largura: '80px'},
        {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', largura: '250px'},
        {field: 'processo_status', header: 'SIT. PROCESSO', sortable: 'true', largura: '250px'},
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
        {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_indicacao_sn', header: 'INDICADO S/N', sortable: 'true', largura: '120px'},
        {field: 'solicitacao_indicacao_nome', header: 'INDICAÇÃO', sortable: 'true', largura: '250px'},
        {field: 'solicitacao_reponsavel_analize_nome', header: 'RESPONSÁVEL', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_tipo_recebimento_nome', header: 'TP. RECEBIMENTO', sortable: 'true', largura: '150px'},
        {field: 'solicitacao_cadastro_tipo_nome', header: 'TIPO SOLICITANTE', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_data_atendimento', header: 'DT ATENDIMENTO', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_atendente_cadastro_nome', header: 'ATENDENTE', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_cadastrante_cadastro_nome', header: 'CADASTRANTE', sortable: 'true', largura: '200px'},
        {field: 'historico_data', header: 'PROC.HIS.DT.', sortable: 'true', largura: '230px'},
        {field: 'historico_andamento', header: 'PROC. HIST. ANDAMENTO', sortable: 'true', largura: '400px'},
      ];
    } else {
      this.cols = [
        {field: 'solicitacao_id', header: 'ID', sortable: 'true', largura: '80px'},
        {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_orgao', header: this.cfg.solicitacao_orgao.titulo, sortable: 'true', largura: '250px'},
        {field: 'solicitacao_tipo_recebimento_nome', header: 'N° OFÍCIO', sortable: 'true', largura: '150px'},
        {field: 'solicitacao_indicacao_nome', header: 'INDICAÇÃO', sortable: 'true', largura: '250px'},
        {field: 'solicitacao_reponsavel_analize_nome', header: 'RESPONSÁVEL', sortable: 'true', largura: '200px'},
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
        {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '200px'},
        {field: 'historico_data', header: this.cfg.historico_data.titulo, sortable: 'true', largura: '230px'},
        {field: 'historico_andamento', header: this.cfg.historico_andamento.titulo, sortable: 'true', largura: '400px'},
        {field: 'solicitacao_data_atendimento', header: 'DT ATENDIMENTO', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_atendente_cadastro_nome', header: 'ATENDENTE', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_cadastrante_cadastro_nome', header: 'CADASTRANTE', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_cadastro_tipo_nome', header: 'TIPO SOLICITANTE', sortable: 'true', largura: '200px'},
      ];
      if (this.cfg.varsao_id === 3) {
        this.cols.push({field: 'cadastro_bairro', header: 'BAIRRO', sortable: 'true', largura: '300px'});
      }
    }

    if (sessionStorage.getItem('solicitacao-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('solicitacao-selectedColumns'));
      sessionStorage.removeItem('solicitacao-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [
      {label: 'DETALHES', icon: 'fas fa-lg fa-glasses', style: {'font-size': '1em'},
        command: () => {this.solicitacaoDetalheCompleto(this.solContexto); }}];

    if (this.aut.usuario_responsavel_sn) {
      this.authAnalisar = true;
      this.contextoMenu.push(
        {label: 'ANALISAR', icon: 'far fa-lg fa-eye', style: {'font-size': '1em'},
          command: () => { this.solicitacaoAnalisar(this.solContexto); }});
    }

    if (this.aut.solicitacao_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {label: 'INCLUIR', icon: 'far fa-lg fa-address-card', style: {'font-size': '1em'},
          command: () => { this.solicitacaoIncluir(); }});
    }

    if (this.aut.solicitacao_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {label: 'ALTERAR', icon: 'fas fa-lg fa-pen-fancy', style: {'font-size': '1em'},
          command: () => { this.solicitacaoAlterar(this.solContexto); }});
    }

    if (this.aut.solicitacao_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {label: 'APAGAR', icon: 'far fa-lg fa-trash-alt', style: {'font-size': '1em'},
          command: () => { this.solicitacaoApagar(this.solContexto); }});
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

    // this.constroiExtendida();

    if (this.sbs.buscaStateSN) {
      this.getState();
    } else {
      this.cs.escondeCarregador();
      this.sbs.solicitacaoBusca.todos = false;
    }

    this.sub.push(this.sbs.busca$.subscribe(
      () => {
        this.sbs.solicitacaoBusca.todos = false;
        this.dtsol.reset();
        this.dtsol.selectionKeys = [];
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
      if (this.sbs.solicitacaoBusca.sortcampo !== event.sortField?.toString ()) {
        this.sbs.solicitacaoBusca.sortcampo = event.sortField?.toString ();
      }
    }
    if (this.sbs.solicitacaoBusca.inicio !== event.first.toString()) {
      this.sbs.solicitacaoBusca.inicio = event.first.toString();
    }
    if (this.sbs.solicitacaoBusca.numlinhas !== event.rows.toString()) {
      this.sbs.solicitacaoBusca.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.sbs.solicitacaoBusca.sortorder !== event.sortOrder.toString()) {
      this.sbs.solicitacaoBusca.sortorder = event.sortOrder.toString();
    }
    if (this.solicitacaoService.buscaStateSN) {

    }
    if (!this.sbs.buscaStateSN) {
      this.postSolicitacaoBusca();
    }
  }

  onRowExpand(event): void {
    this.solicitacaoService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.solicitacaoService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.solicitacaoService.montaColunaExpandida(this.solicitacaoService.expandidoDados);
  }

  onChangeSeletorColunas(changes): void {
    this.dtsol.saveState();
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
      this.postSolicitacaoBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.solContexto = event.data;
  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mostraLoader(vf: boolean) {
    this.loading = vf;
  }

  resetSelectedColumns(): void {
    if (this.cfg.varsao_id <= 2) {
      this.selectedColumns = [
        {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', largura: '250px'},
        {field: 'processo_status', header: 'SIT. PROCESSO', sortable: 'true', largura: '250px'},
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
        {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', largura: '300px'}
      ];
    } else {
      this.selectedColumns = [
        {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_orgao', header: this.cfg.solicitacao_orgao.titulo, sortable: 'true', largura: '250px'},
        {field: 'solicitacao_tipo_recebimento_nome', header: 'N° OFÍCIO', sortable: 'true', largura: '150px'},
        {field: 'solicitacao_indicacao_nome', header: 'INDICAÇÃO', sortable: 'true', largura: '250px'},
        {field: 'solicitacao_reponsavel_analize_nome', header: 'RESPONSÁVEL', sortable: 'true', largura: '200px'}
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({field: 'solicitacao_id', header: 'ID'});
    this.selectedColumns.forEach( (c) => {
      this.camposSelecionados.push({field: c.field, header: c.header});
    });
  }

  achaValor(sol: SolicitacaoListar12Interface | SolicitacaoListar345Interface): number {
    return this.solicitacoes.indexOf(sol);
  }

  // FUNCOES DE BUSCA ==========================================================

  postSolicitacaoBusca(): void {
    this.sbs.solicitacaoBusca['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.solicitacaoService.postSolicitacaoBusca(this.sbs.solicitacaoBusca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.solicitacoes = dados.solicitacao;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.sbs.solicitacaoBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.sbs.solicitacaoBusca.inicio, 10) +
            parseInt(this.sbs.solicitacaoBusca.numlinhas, 10)) /
            parseInt(this.sbs.solicitacaoBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.sbs.criarSolicitacaoBusca();
    this.sbs.solicitacaoBusca = JSON.parse(sessionStorage.getItem('solicitacao-busca'));
    if (this.sbs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: SolicitacaoPaginacaoInterface }) => {
          this.solicitacoes = data.dados.solicitacao;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.sbs.solicitacaoBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.sbs.solicitacaoBusca.inicio, 10) +
            parseInt(this.sbs.solicitacaoBusca.numlinhas, 10)) /
            parseInt(this.sbs.solicitacaoBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.sbs.buscaStateSN = false;
          sessionStorage.removeItem('solicitacao-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  solicitacaoIncluir(): void {
    if (this.aut.solicitacao_incluir) {
      this.cs.mostraCarregador();
      this.dtsol.saveState();
      if (this.solicitacaoService.expandidoDados) {
        this.solicitacaoService.gravaColunaExpandida(this.solicitacaoService.expandidoDados);
      }
      sessionStorage.setItem('solicitacao-busca', JSON.stringify(this.sbs.solicitacaoBusca));
      sessionStorage.setItem('solicitacao-selectedColumns', JSON.stringify(this.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.router.navigate(['/solicitacao/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  solicitacaoDetalheCompleto(sol: SolicitacaoListar12Interface | SolicitacaoListar345Interface) {
    this.sub.push(this.solicitacaoService.getSolicitacaoDetalhe(sol.solicitacao_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.solDetalhe = dados;
        },
        error: (err) => {
          console.error('erro', err.toString ());
        },
        complete: () => {
          this.showDetalhe = true;
        }
      }));
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.solDetalhe = null;
  }

  solicitacaoAlterar(sol: SolicitacaoListar12Interface | SolicitacaoListar345Interface) {
    if (this.aut.solicitacao_alterar) {
      this.cs.mostraCarregador();
      this.dtsol.saveState();
      if (this.solicitacaoService.expandidoDados) {
        this.solicitacaoService.gravaColunaExpandida(this.solicitacaoService.expandidoDados);
      }
      sessionStorage.setItem('solicitacao-busca', JSON.stringify(this.sbs.solicitacaoBusca));
      sessionStorage.setItem('solicitacao-selectedColumns', JSON.stringify(this.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.router.navigate(['/solicitacao/alterar', sol.solicitacao_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  solicitacaoApagar(sol: SolicitacaoListar12Interface | SolicitacaoListar345Interface) {
    if (this.aut.solicitacao_apagar) {
      this.cs.mostraCarregador();
      this.dtsol.saveState();
      if (this.solicitacaoService.expandidoDados) {
        this.solicitacaoService.gravaColunaExpandida(this.solicitacaoService.expandidoDados);
      }
      sessionStorage.setItem('solicitacao-busca', JSON.stringify(this.sbs.solicitacaoBusca));
      sessionStorage.setItem('solicitacao-selectedColumns', JSON.stringify(this.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.router.navigate(['/solicitacao/apagar', sol.solicitacao_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  solicitacaoAnalisar(sol: SolicitacaoListar12Interface | SolicitacaoListar345Interface) {
    if (sol.solicitacao_posicao !== 'EM ABERTO') {
      this.messageService.add(
        {
          key: 'solicitacaoToast',
          severity: 'warn',
          summary: 'ANALIISE',
          detail: sol.solicitacao_posicao.toString()}
        );
    }
    if (this.aut.usuario_responsavel_sn
      && this.aut.solicitacao_analisar
      && sol.solicitacao_posicao === 'EM ABERTO') {
      this.cs.mostraCarregador();
      this.dtsol.saveState();
      if (this.solicitacaoService.expandidoDados) {
        this.solicitacaoService.gravaColunaExpandida(this.solicitacaoService.expandidoDados);
      }
      sessionStorage.setItem('solicitacao-busca', JSON.stringify(this.sbs.solicitacaoBusca));
      sessionStorage.setItem('solicitacao-selectedColumns', JSON.stringify(this.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.router.navigate(['/solicitacao/analisar', sol.solicitacao_id]);
    }

  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.sbs.solicitacaoBusca.todos;
    this.sbs.solicitacaoBusca.todos = td;
    if (this.sbs.solicitacaoBusca.todos === true) {
      // let solPdf: SolicitacaoInterface[];
      let solPdf: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalPdf: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.solicitacaoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca(this.sbs.solicitacaoBusca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            solPdf = dados.solicitacao;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('solicitacoes', this.camposSelecionados, solPdf);
            this.sbs.solicitacaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('solicitacoes', this.camposSelecionados, this.selecionados);
      this.sbs.solicitacaoBusca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('solicitacoes', this.camposSelecionados, this.solicitacoes);
    this.sbs.solicitacaoBusca.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.sbs.solicitacaoBusca.todos;
    this.sbs.solicitacaoBusca.todos = td;
    if (this.sbs.solicitacaoBusca.todos === true) {
      // let solprint: SolicitacaoInterface[];
      let solprint: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalprint: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.solicitacaoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca(this.sbs.solicitacaoBusca)
        .subscribe({
          next: (dados) => {
            solprint = dados.solicitacao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, solprint);
            this.sbs.solicitacaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.sbs.solicitacaoBusca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.solicitacoes);
    this.sbs.solicitacaoBusca.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.sbs.solicitacaoBusca.todos;
    this.sbs.solicitacaoBusca.todos = td;
    if (this.sbs.solicitacaoBusca.todos === true) {
      // let solcsv: SolicitacaoInterface[];
      let solcsv: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalprint: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.solicitacaoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca (this.sbs.solicitacaoBusca)
        .subscribe ({
          next: (dados) => {
            solcsv = dados.solicitacao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv ('solicitacao', this.camposSelecionados, solcsv);
            this.sbs.solicitacaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv ('solicitacao', this.camposSelecionados, this.selecionados);
      this.sbs.solicitacaoBusca.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv ('solicitacao', this.camposSelecionados, this.solicitacoes);
    this.sbs.solicitacaoBusca.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.sbs.solicitacaoBusca.todos;
    this.sbs.solicitacaoBusca.todos = td;
    if (this.sbs.solicitacaoBusca.todos === true) {
      // let solcsv: SolicitacaoInterface[];
      let solcsv: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalprint: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.solicitacaoBusca['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca (this.sbs.solicitacaoBusca)
        .subscribe ({
          next: (dados) => {
            solcsv = dados.solicitacao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile ('solicitacao', solcsv, this.solicitacaoService.getArrayTitulo());
            this.sbs.solicitacaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile ('solicitacao', this.exportToXLSXSimples(this.selecionados), this.solicitacaoService.getArrayTitulo());
      this.sbs.solicitacaoBusca.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile ('solicitacao', this.solicitacoes,  this.solicitacaoService.getArrayTitulo());
    this.sbs.solicitacaoBusca.todos = this.tmp;
    return true;
  }

  exportToXLSXSimples(dados: SolicitacaoListar12Interface[]): SolicitacaoExcel12[] {
    const sl: SolicitacaoExcel12[] = [];
    const r: SolicitacaoInterfaceExcel[] = [];
    dados.forEach( ( x: SolicitacaoListar12Interface ) => {
      const c: SolicitacaoExcel12 = (x as any) as SolicitacaoExcel12;
      sl.push(c);
    });
    // sl = (dados as  unknown[]) as SolicitacaoInterfaceExcel[];
    /*sl.unshift =  {
      solicitacao_posicao:                    'POSIÇÃO',
      solicitacao_cadastro_nome:              'SOLICITANTE',
      solicitacao_data:                       'DATA',
      solicitacao_assunto_nome:               'ASSUNTO',
      solicitacao_area_interesse_nome:        'ÁREA DE INTERESSE',
      processo_numero:                        'Nº PROCESSO',
      processo_status:                        'SIT. PROCESSO',
      cadastro_municipio_nome:                'MUNICÍPIO',
      cadastro_regiao_nome:                   'REGIÃO',
      solicitacao_indicacao_sn:               'INDICADO S/N',
      solicitacao_indicacao_nome:             'INDICAÇÃO',
      solicitacao_reponsavel_analize_nome:    'RESPONSÁVEL',
      solicitacao_local_nome:                 'NÚCLEO',
      solicitacao_tipo_recebimento_nome:      'TP. RECEBIMENTO',
      solicitacao_cadastro_tipo_nome:         'TP. SOLICITANTE',
      solicitacao_data_atendimento:           'DT. ATENDIMENTO',
      solicitacao_atendente_cadastro_nome:    'ATENDENTE',
      solicitacao_cadastrante_cadastro_nome:  'CADASTRANTE',
      historico_data:                         'PROC.HIS.DT.',
      historico_andamento:                    'PROC. HIST. ANDAMENTO',
      solicitacao_aceita_sn:                  'SOL, ACEITA S/N',
      cadastro_email:                         'E-MAIL1',
      cadastro_email2:                        'E-MAIL2',
      cadastro_telefone:                      'TELEFONE1',
      cadastro_telefone2:                     'TELEFONE2',
      cadastro_celular:                       'CELULAR1',
      cadastro_celular2:                      'CELULAR2',
      cadastro_telcom:                        'TELEFONE3',
      cadastro_fax: 							            'FAX',
    } ;*/
    console.log('excell22', sl);
    return sl;
  }



  constroiExtendida() {
    const v = this.solicitacaoService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.solicitacaoService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.solicitacaoService.montaColunaExpandida(v);
    }
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

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
