import { Component, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LazyLoadEvent, SelectItem, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { WindowsService } from '../../_layout/_service';
import {AuthenticationService, MenuInternoService} from '../../_services';
import {Stripslashes} from "../../shared/functions/stripslashes";
import {ProposicaoListarI} from "../_models/proposicao-listar-i";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {ProposicaoService} from "../_services/proposicao.service";
import {ProposicaoFormService} from "../_services/proposicao-form.service";
import {AndamentoProposicaoI, AndPropI} from "../_models/andamento-proposicao-i";


@Component({
  selector: 'app-proposicao-datatable',
  templateUrl: './proposicao-datatable.component.html',
  styleUrls: ['./proposicao-datatable.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ DialogService ]
})
export class ProposicaoDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: any;
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  showDetalhe = false;
  proposicaoDetalhe?: ProposicaoListarI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  idx = -1;
  acaoAndamento = '';

  andProp: AndPropI;
  showHistorico = false;
  // tituloHistoricoDialog = 'ANDAMENTOS';
  // histAcao: string = '';
  histFormI?: AndamentoProposicaoI;
  cssMostra: string | null = null;
  permListHist: boolean = false;
  permInclHist: boolean = false;
  permitirAcao: boolean = true;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    public md: MenuDatatableService,
    public ps: ProposicaoService,
    public pfs: ProposicaoFormService
  ) { }

  ngOnInit() {
    if (this.ps.selecionados === undefined || this.ps.selecionados === null || !Array.isArray(this.ps.selecionados)) {
      this.ps.selecionados = [];
    }
    this.permListHist = (this.aut.andamentoproposicao_listar || this.aut.andamentoproposicao_incluir || this.aut.andamentoproposicao_alterar || this.aut.andamentoproposicao_apagar ||  this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permInclHist = (this.aut.andamentoproposicao_listar || this.aut.andamentoproposicao_incluir || this.aut.andamentoproposicao_alterar || this.aut.andamentoproposicao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);

    this.montaColunas();

    if (!this.ps.stateSN) {
      this.resetSelectedColumns();
    }

    this.itemsAcao = [
      {
        label: 'CSV - LINHAS SELECIONADAS', icon: 'pi pi-share-alt', style: {'font-size': '.9em'}, command: () => {
          this.dtb.exportCSV({selectionOnly: true});
        }
      },
      {
        label: 'CSV - PÁGINA', icon: 'pi pi-share-alt', style: {'font-size': '.9em'}, command: () => {
          this.dtb.exportCSV();
        }
      },
      {
        label: 'CSV - TODOS', icon: 'pi pi-share-alt', style: {'font-size': '.9em'}, command: () => {
          this.ps.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.ps.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ps.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ps.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ps.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ps.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.ps.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.ps.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ps.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ps.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.ps.busca$.subscribe(
      () => {
        if (this.ps.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.ps.busca.todos = false;
      }
    ));

    this.getColunas();
  }

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    if (this.ps.titulos === undefined || this.ps.titulos === null || (Array.isArray(this.ps.titulos) && this.ps.titulos.length === 0)) {
      this.ps.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaColunas() {
    this.cols = [
      {field: 'proposicao_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'proposicao_tipo_nome', header: 'TIPO', sortable: 'true', width: '150px'},
      {field: 'proposicao_numero', header: 'NÚMERO', sortable: 'true', width: '150px'},
      {field: 'proposicao_autor', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'proposicao_relator', header: 'RELATOR', sortable: 'true', width: '200px'},
      {field: 'proposicao_data_apresentacao', header: 'DT. APRESENTAÇÃO', sortable: 'true', width: '170px'},
      {field: 'proposicao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', width: '300px'},
      {field: 'proposicao_parecer', header: 'PARECER', sortable: 'true', width: '200px'},
      {field: 'proposicao_origem_nome', header: 'ORGÃO ORIGEM', sortable: 'true', width: '200px'},
      {field: 'proposicao_emenda_tipo_nome', header: 'TP. EMENDA', sortable: 'true', width: '250px'},
      {field: 'proposicao_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '300px'},
      {field: 'proposicao_ementa', header: 'EMENTA', sortable: 'true', width: '300px'},
      {field: 'proposicao_relator_atual', header: 'RELATOR ATUAL', sortable: 'true', width: '300px'},
      {field: 'proposicao_orgao_nome', header: 'ORGÃO ATUAL', sortable: 'true', width: '300px'},
      {field: 'andamento_proposicao_data', header: 'AND. DATA', sortable: 'true', width: '150px'},
      {field: 'andamento_proposicao_orgao_nome', header: 'AND. ORGÃO', sortable: 'true', width: '300px'},
      {field: 'andamento_proposicao_relator_atual', header: 'AND. RELATORL', sortable: 'true', width: '300px'},
      {field: 'andamento_proposicao_situacao_nome', header: 'AND. SITUAÇÃO', sortable: 'true', width: '300px'},
      {field: 'andamento_proposicao_texto', header: 'ANDAMENTO', sortable: 'true', width: '300px'},
    ];
  }

  resetSelectedColumns(): void {
    this.ps.criaTabela();
    this.ps.tabela.selectedColumns = [
      {field: 'proposicao_data_apresentacao', header: 'DT. APRESENTAÇÃO', sortable: 'true', width: '170px'},
      {field: 'proposicao_tipo_nome', header: 'TIPO', sortable: 'true', width: '150px'},
      {field: 'proposicao_numero', header: 'NÚMERO', sortable: 'true', width: '150px'},
      {field: 'proposicao_autor', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'proposicao_relator', header: 'RELATOR', sortable: 'true', width: '200px'},
      {field: 'proposicao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', width: '300px'},
      {field: 'proposicao_parecer', header: 'PARECER', sortable: 'true', width: '200px'},
      {field: 'proposicao_origem_nome', header: 'ORGÃO ORIGEM', sortable: 'true', width: '200px'},
      {field: 'proposicao_emenda_tipo_nome', header: 'TP. EMENDA', sortable: 'true', width: '250px'},
      {field: 'proposicao_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '300px'},
      {field: 'proposicao_orgao_nome', header: 'ORGÃO ATUAL', sortable: 'true', width: '300px'},
    ];
  }

  resetColunas() {
    this.ps.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.ps.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.ps.tabela.mostraSeletor = false;
  }

  rowColor(field: string, vl1: number): string | null {
    if (field !== 'proposicao_situacao_nome') {
      return null;
    }

    if (field === 'proposicao_situacao_nome') {
      switch (vl1) {
        case 0:
          return 'status-1';
        case 1:
          return 'status-3';
        case 2:
          return 'status-2';
        default:
          return 'status-1';
      }
    }
  }

  montaMenuContexto() {
    this.contextoMenu = [
      {
        label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {
          this.proposicaoDetalheCompleto(this.ps.Contexto);
        }
      }];

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.solicitacao_alterar) {
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.proposicaoAlterar(this.ps.Contexto);
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.solicitacao_apagar) {
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.proposicaoApagar(this.ps.Contexto);
          }
        });
    }
  }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (this.ps.tabela.sortField !== event.sortField) {
      this.ps.tabela.sortField = event.sortField;
    }
    if (this.ps.tabela.first !== +event.first) {
      this.ps.tabela.first = +event.first;
    }
    if (event.rows !== undefined && this.ps.tabela.rows !== +event.rows) {
      this.ps.tabela.rows = +event.rows;
    }
    if (this.ps.tabela.sortOrder !== +event.sortOrder) {
      this.ps.tabela.sortOrder = +event.sortOrder;
    }
    this.ps.lazy = true;
    this.ps.proposicaoBusca();
  }

  // FUNCOES DE BUSCA ==========================================================

  // FUNCOES DE CRUD ===========================================================

  proposicaoIncluir(): void {
    if (this.aut.proposicao_incluir || this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) {
      this.pfs.acao = 'incluir';
      this.ps.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/proposicao/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  proposicaoDetalheCompleto(prop: ProposicaoListarI) {
    this.showDetalhe = true;
    this.proposicaoDetalhe = prop;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.proposicaoDetalhe = null;
  }

  proposicaoAlterar(prop: ProposicaoListarI) {
    if (this.aut.proposicao_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.ps.salvaState();
      this.dtb.saveState();
      this.pfs.acao = 'alterar';
      this.pfs.proposicaoListar = prop;
      this.pfs.parceProposicaoFormulario(prop);
      this.router.navigate(['/proposicao/alterar']);
    } else {
      console.log('SEM PERMISSAO');
    }

  }

  proposicaoApagar(prop: ProposicaoListarI) {
    if ((this.aut.proposicao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn ) && this.permissaoApagarArquivo(prop)) {
      this.ps.proposicaoApagar = prop;
      this.ps.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/proposicao/apagar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  /*proposicaoAtualizar(eme: ProposicaoListarI) {
    if (this.aut.proposicao_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      console.log('proposicaoAtualizar', eme);
      this.ps.salvaState();
      this.dtb.saveState();
      this.pfs.proposicaoListar = eme;
      this.pfs.resetAtualizar();
      this.pfs.parceEmendaAtualizar(eme);
      this.router.navigate(['/proposicao/atualizar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }*/

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  andamentoAcao(idx: number, acao: string) {
    this.acaoAndamento = acao;
    this.idx = idx;
    this.showHistorico = true;
    this.mostraDialog(true);
  }

  permissaoApagarArquivo(prop: ProposicaoListarI): boolean {
    if (this.aut.arquivos_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      return true
    }
    return !(prop.proposicao_arquivos !== undefined && prop.proposicao_arquivos !== null && Array.isArray(prop.proposicao_arquivos) && prop.proposicao_arquivos.length > 0);
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'p-d-none';
  }

  recebeRegistro(p: ProposicaoListarI) {
    this.ps.proposicoes[this.idx] = p;
    const a: any = {
      data: p
    }
    this.ps.onRowExpand(a);
    /*const idx = this.ps.proposicoes.findIndex(i => i.proposicao_id === p.andamento_proposicao_proposicao_id);
    const pp: ProposicaoListarI = this.ps.proposicoes[idx];
    const ap:AndamentoProposicaoI[] = pp.andamento_proposicao;
    const apidx = ap.findIndex(a => a.andamento_proposicao_id === p.andamento_proposicao_id);
    if (apidx === -1) {
      ap.push(p)
    }*/
    // this.ps.recebeRegistro(h);
  }

  ngOnDestroy(): void {
    this.ps.selecionados = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  getColunas() {
    this.ps.colunas = this.cols.map(t => {
      return t.field;
    });
  }

}
