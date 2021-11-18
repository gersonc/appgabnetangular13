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
  AndamentoProposicaoListagemInterface,
  ProposicaoArray,
  ProposicaoBuscaCampoInterface,
  ProposicaoDetalheInterface,
  ProposicaoListagemInterface,
  ProposicaoPaginacaoInterface,
  ProposicaoTotalInterface
} from '../_models';
import { AndamentoProposicaoService, ProposicaoBuscaService, ProposicaoService } from '../_services';
import { ProposicaoDetalheComponent } from '../proposicao-detalhe/proposicao-detalhe.component';
import { AndamentoproposicaoIncluirComponent } from '../andamentoproposicao-incluir/andamentoproposicao-incluir.component';
import { AndamentoproposicaoListarEditarExcluirComponent } from '../andamentoproposicao-listar-editar-excluir/andamentoproposicao-listar-editar-excluir.component';


@Component({
  selector: 'app-proposicao-datatable',
  templateUrl: './proposicao-datatable.component.html',
  styleUrls: ['./proposicao-datatable.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ DialogService ]
})
export class ProposicaoDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtpp', { static: true }) public dtpp: any;
  loading = false;
  cols: any[];
  currentPage = 1;
  proposicao: ProposicaoListagemInterface[];
  ppContexto: ProposicaoListagemInterface;
  total: ProposicaoTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: ProposicaoListagemInterface[] = [];
  sortCampo = 'proposicao_status';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: ProposicaoBuscaCampoInterface[];
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
  // buscaStateSN: boolean;
  // public mostraMenu$: boolean;

  constructor(
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    public dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private proposicaoService: ProposicaoService,
    private andamentoProposicaoService: AndamentoProposicaoService,
    private pbs: ProposicaoBuscaService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {

    this.cols = [
      {field: 'proposicao_id', header: 'ID', sortable: 'true', largura: '80px'},
      {field: 'proposicao_tipo_nome', header: 'TIPO', sortable: 'true', largura: '150px'},
      {field: 'proposicao_numero', header: 'NÚMERO', sortable: 'true', largura: '150px'},
      {field: 'proposicao_autor', header: 'AUTOR', sortable: 'true', largura: '150px'},
      {field: 'proposicao_relator', header: 'RELATOR', sortable: 'true', largura: '200px'},
      {field: 'proposicao_data_apresentacao', header: 'DT. APRESENTAÇÃO', sortable: 'true', largura: '170px'},
      {field: 'proposicao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
      {field: 'proposicao_parecer', header: 'PARECER', sortable: 'true', largura: '200px'},
      {field: 'proposicao_origem_nome', header: 'ORGÃO ORIGEM', sortable: 'true', largura: '200px'},
      {field: 'proposicao_emenda_tipo_nome', header: 'TP. EMENDA', sortable: 'true', largura: '250px'},
      {field: 'proposicao_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', largura: '300px'},
      {field: 'proposicao_ementa', header: 'EMENTA', sortable: 'true', largura: '300px'},
      {field: 'proposicao_relator_atual', header: 'RELATOR ATUAL', sortable: 'true', largura: '300px'},
      {field: 'proposicao_orgao_nome', header: 'ORGÃO ATUAL', sortable: 'true', largura: '300px'},
      {field: 'andamento_proposicao_data', header: 'AND. DATA', sortable: 'true', largura: '150px'},
      {field: 'andamento_proposicao_orgao_nome', header: 'AND. ORGÃO', sortable: 'true', largura: '300px'},
      {field: 'andamento_proposicao_relator_atual', header: 'AND. RELATORL', sortable: 'true', largura: '300px'},
      {field: 'andamento_proposicao_situacao_nome', header: 'AND. SITUAÇÃO', sortable: 'true', largura: '300px'},
      {field: 'andamento_proposicao_texto', header: 'ANDAMENTO', sortable: 'true', largura: '300px'},
    ];

    if (sessionStorage.getItem('proposicao-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('proposicao-selectedColumns'));
      sessionStorage.removeItem('proposicao-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [
      {label: 'DETALHES', icon: 'fas fa-lg fa-glasses', style: {'font-size': '1em'},
        command: () => {this.proposicaoDetalheCompleto(this.ppContexto); }}];

    if (this.authenticationService.proposicao_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {label: 'INCLUIR', icon: 'far fa-lg fa-address-card', style: {'font-size': '1em'},
          command: () => { this.proposicaoIncluir(); }});
    }

    if (this.authenticationService.proposicao_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {label: 'ALTERAR', icon: 'fas fa-lg fa-pen-fancy', style: {'font-size': '1em'},
          command: () => { this.proposicaoAlterar(this.ppContexto); }});
    }

    if (this.authenticationService.andamentoproposicao_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {label: 'INCLUIR ANDAMENTO', icon: 'pi pi-plus', style: {'font-size': '1em'},
          command: () => { this.andamentoIncluir(this.ppContexto); }});
    }

    if (this.authenticationService.andamentoproposicao_listar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {label: 'ANDAMENTOS', icon: 'fas fa-lg fa-receipt', style: {'font-size': '1em'},
          command: () => { this.andamentoListar(this.ppContexto); }});
    }

    if (this.authenticationService.proposicao_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {label: 'APAGAR', icon: 'far fa-lg fa-trash-alt', style: {'font-size': '1em'},
          command: () => { this.proposicaoApagar(this.ppContexto); }});
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

    if (this.pbs.buscaStateSN) {
      this.getState();
    } else {
      this.pbs.proposicaoBusca.todos = false;
    }

    this.sub.push(this.pbs.busca$.subscribe(
      () => {
        this.pbs.proposicaoBusca.todos = false;
        this.dtpp.reset();
        this.dtpp.selectionKeys = [];
        this.selecionados = [];
        this.cs.escondeCarregador();
      }
    ));
  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.pbs.proposicaoBusca.sortcampo !== event.sortField.toString ()) {
        this.pbs.proposicaoBusca.sortcampo = event.sortField.toString ();
      }
    }
    if (this.pbs.proposicaoBusca.inicio !== event.first.toString()) {
      this.pbs.proposicaoBusca.inicio = event.first.toString();
    }
    if (this.pbs.proposicaoBusca.numlinhas !== event.rows.toString()) {
      this.pbs.proposicaoBusca.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.pbs.proposicaoBusca.sortorder !== event.sortOrder.toString()) {
      this.pbs.proposicaoBusca.sortorder = event.sortOrder.toString();
    }
    if (!this.pbs.buscaStateSN) {
      this.postProposicaoBusca();
    }
  }

  onRowExpand(event): void {
    this.proposicaoService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.proposicaoService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.proposicaoService.montaColunaExpandida(this.proposicaoService.expandidoDados);
  }

  onChangeSeletorColunas(changes): void {
    this.dtpp.saveState();
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
      this.postProposicaoBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.ppContexto = event.data;
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
        {field: 'proposicao_tipo_nome', header: 'TIPO', sortable: 'true', largura: '150px'},
        {field: 'proposicao_numero', header: 'NÚMERO', sortable: 'true', largura: '150px'},
        {field: 'proposicao_autor', header: 'AUTOR', sortable: 'true', largura: '150px'},
        {field: 'proposicao_relator', header: 'RELATOR', sortable: 'true', largura: '200px'},
        {field: 'proposicao_data_apresentacao', header: 'DT. APRESENTAÇÃO', sortable: 'true', largura: '170px'},
        {field: 'proposicao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
        {field: 'proposicao_parecer', header: 'PARECER', sortable: 'true', largura: '200px'},
        {field: 'proposicao_origem_nome', header: 'ORGÃO ORIGEM', sortable: 'true', largura: '200px'},
        {field: 'proposicao_emenda_tipo_nome', header: 'TP. EMENDA', sortable: 'true', largura: '250px'},
        {field: 'proposicao_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', largura: '300px'},
        {field: 'proposicao_orgao_nome', header: 'ORGÃO ATUAL', sortable: 'true', largura: '300px'},
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({field: 'proposicao_id', header: 'ID'});
    this.selectedColumns.forEach( (c) => {
      this.camposSelecionados.push({field: c.field, header: c.header});
    });
  }

  // FUNCOES DE BUSCA ==========================================================

  postProposicaoBusca(): void {
    this.pbs.proposicaoBusca['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.proposicaoService.postProposicaoBusca(this.pbs.proposicaoBusca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.proposicao = dados.proposicao;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.pbs.proposicaoBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.pbs.proposicaoBusca.inicio, 10) +
            parseInt(this.pbs.proposicaoBusca.numlinhas, 10)) /
            parseInt(this.pbs.proposicaoBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.pbs.criarProposicaoBusca();
    this.pbs.proposicaoBusca = JSON.parse(sessionStorage.getItem('proposicao-busca'));
    if (this.pbs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: ProposicaoPaginacaoInterface }) => {
          this.proposicao = data.dados.proposicao;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.pbs.proposicaoBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.pbs.proposicaoBusca.inicio, 10) +
            parseInt(this.pbs.proposicaoBusca.numlinhas, 10)) /
            parseInt(this.pbs.proposicaoBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.pbs.buscaStateSN = false;
          sessionStorage.removeItem('proposicao-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  proposicaoIncluir(): void {
    if (this.authenticationService.proposicao_incluir) {
      this.cs.mostraCarregador();
      this.dtpp.saveState();
      if (this.proposicaoService.expandidoDados) {
        this.proposicaoService.gravaColunaExpandida(this.proposicaoService.expandidoDados);
      }
      sessionStorage.setItem('proposicao-busca', JSON.stringify(this.pbs.proposicaoBusca));
      sessionStorage.setItem('proposicao-selectedColumns', JSON.stringify(this.selectedColumns));
      this.pbs.buscaStateSN = true;
      this.router.navigate(['/proposicao/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  proposicaoDetalheCompleto(pp: ProposicaoListagemInterface) {
    let ppDetalhe: ProposicaoDetalheInterface;
    this.sub.push(this.proposicaoService.getProposicaoDetalhe(pp.proposicao_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          ppDetalhe = dados;
        },
        error: (err) => {
          console.log ('erro', err.toString ());
        },
        complete: () => {
          const ref = this.dialogService.open (ProposicaoDetalheComponent, {
            data: {
              ppDetalhe: ppDetalhe
            },
            header: 'PROPOSIÇÃO DETALHE',
            width: '70%',
            height: '80vh',
            styleClass: 'tablistagem',
            dismissableMask: true,
            showHeader: true
          });
        }
      }));
  }

  proposicaoAlterar(pp: ProposicaoListagemInterface) {
    if (this.authenticationService.proposicao_alterar) {
      this.cs.mostraCarregador();
      this.dtpp.saveState();
      if (this.proposicaoService.expandidoDados) {
        this.proposicaoService.gravaColunaExpandida(this.proposicaoService.expandidoDados);
      }
      sessionStorage.setItem('proposicao-busca', JSON.stringify(this.pbs.proposicaoBusca));
      sessionStorage.setItem('proposicao-selectedColumns', JSON.stringify(this.selectedColumns));
      this.pbs.buscaStateSN = true;
      this.router.navigate(['/proposicao/alterar', pp.proposicao_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  andamentoListar(pp: ProposicaoListagemInterface) {
    if (this.authenticationService.andamentoproposicao_listar) {
      this.cs.mostraCarregador();
      let andamentos: AndamentoProposicaoListagemInterface[];
      this.sub.push(this.andamentoProposicaoService.getAndamentoProposicaoListagem(pp.proposicao_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            andamentos = dados;
          },
          error: (err) => {
            console.log('erro', err.toString());
          },
          complete: () => {
            const ref = this.dialogService.open(AndamentoproposicaoListarEditarExcluirComponent, {
              data: {
                andamentos: andamentos
              },
              header: 'ANDAMENTOS',
              width: '90%',
              height: '80vh',
              styleClass: 'tablistagem',
              dismissableMask: true,
              showHeader: true,
              closable: true
            });
          }
        }));
    }
  }

  andamentoIncluir(pp: ProposicaoListagemInterface) {
    if (this.authenticationService.andamentoproposicao_incluir) {
      this.cs.mostraCarregador();
      const ref = this.dialogService.open (AndamentoproposicaoIncluirComponent, {
        data: {
          proposicao_id: pp.proposicao_id
        },
        header: 'INCLUIR ANDAMENTOS',
        styleClass: 'tablistagem',
        dismissableMask: true,
        showHeader: true,
        closable: true
      });
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  proposicaoApagar(pp: ProposicaoListagemInterface) {
    if (this.authenticationService.proposicao_apagar) {
      this.cs.mostraCarregador();
      this.dtpp.saveState();
      if (this.proposicaoService.expandidoDados) {
        this.proposicaoService.gravaColunaExpandida(this.proposicaoService.expandidoDados);
      }
      sessionStorage.setItem('proposicao-busca', JSON.stringify(this.pbs.proposicaoBusca));
      sessionStorage.setItem('proposicao-selectedColumns', JSON.stringify(this.selectedColumns));
      this.pbs.buscaStateSN = true;
      this.router.navigate(['/proposicao/apagar', pp.proposicao_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }


  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.pbs.proposicaoBusca.todos;
    this.pbs.proposicaoBusca.todos = td;
    if (this.pbs.proposicaoBusca.todos === true) {
      let ppPdf: ProposicaoListagemInterface[];
      let totalPdf: ProposicaoTotalInterface;
      let numTotalRegs: number;
      this.pbs.proposicaoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.proposicaoService.postProposicaoBusca(this.pbs.proposicaoBusca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ppPdf = dados.proposicao;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('proposicao', this.camposSelecionados, ppPdf);
            this.pbs.proposicaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('proposicao', this.camposSelecionados, this.selecionados);
      this.pbs.proposicaoBusca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('proposicao', this.camposSelecionados, this.proposicao);
    this.pbs.proposicaoBusca.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.pbs.proposicaoBusca.todos;
    this.pbs.proposicaoBusca.todos = td;
    if (this.pbs.proposicaoBusca.todos === true) {
      let ppprint: ProposicaoListagemInterface[];
      let totalprint: ProposicaoTotalInterface;
      let numTotalRegs: number;
      this.pbs.proposicaoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.proposicaoService.postProposicaoBusca(this.pbs.proposicaoBusca)
        .subscribe({
          next: (dados) => {
            ppprint = dados.proposicao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, ppprint);
            this.pbs.proposicaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.pbs.proposicaoBusca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.proposicao);
    this.pbs.proposicaoBusca.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.pbs.proposicaoBusca.todos;
    this.pbs.proposicaoBusca.todos = td;
    if (this.pbs.proposicaoBusca.todos === true) {
      let ppcsv: ProposicaoListagemInterface[];
      let totalprint: ProposicaoTotalInterface;
      let numTotalRegs: number;
      this.pbs.proposicaoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.proposicaoService.postProposicaoBusca (this.pbs.proposicaoBusca)
        .subscribe ({
          next: (dados) => {
            ppcsv = dados.proposicao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv ('proposicao', this.camposSelecionados, ppcsv);
            this.pbs.proposicaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv ('proposicao', this.camposSelecionados, this.selecionados);
      this.pbs.proposicaoBusca.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv ('proposicao', this.camposSelecionados, this.proposicao);
    this.pbs.proposicaoBusca.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.pbs.proposicaoBusca.todos;
    this.pbs.proposicaoBusca.todos = td;
    if (this.pbs.proposicaoBusca.todos === true) {
      let ppcsv: ProposicaoListagemInterface[];
      let totalprint: ProposicaoTotalInterface;
      let numTotalRegs: number;
      this.pbs.proposicaoBusca['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.proposicaoService.postProposicaoBusca (this.pbs.proposicaoBusca)
        .subscribe ({
          next: (dados) => {
            ppcsv = dados.proposicao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile ('proposicao', ppcsv, ProposicaoArray.getArrayTitulo());
            this.pbs.proposicaoBusca.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile ('proposicao', this.selecionados, ProposicaoArray.getArrayTitulo());
      this.pbs.proposicaoBusca.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile ('proposicao', this.proposicao, ProposicaoArray.getArrayTitulo());
    this.pbs.proposicaoBusca.todos = this.tmp;
    return true;
  }

  constroiExtendida() {
    const v = this.proposicaoService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.proposicaoService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.proposicaoService.montaColunaExpandida(v);
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
