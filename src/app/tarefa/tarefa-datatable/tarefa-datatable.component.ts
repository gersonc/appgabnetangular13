import {Component, OnInit, ViewChild} from '@angular/core';
import {WindowsService} from "../../_layout/_service";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {TarefaFormService} from "../_services/tarefa-form.service";
import {Router} from "@angular/router";
import {TarefaService} from "../_services/tarefa.service";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {Subscription} from "rxjs";
import {TarefaI} from "../_models/tarefa-i";
import {TarefaHistoricoI} from "../_models/tarefa-historico-i";
import {breakTextIntoLines} from "pdf-lib";

@Component({
  selector: 'app-tarefa-datatable',
  templateUrl: './tarefa-datatable.component.html',
  styleUrls: ['./tarefa-datatable.component.css']
})
export class TarefaDatatableComponent implements OnInit {
  @ViewChild('dtb', {static: true}) public dtb: any;
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  showDetalhe = false;
  tarefaDetalhe?: TarefaI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  idx = -1;
  acaoHistorico = '';

  // andProp: AndPropI;
  showHistorico = true;
  // tituloHistoricoDialog = 'ANDAMENTOS';
  // histAcao: string = '';
  histFormI?: TarefaHistoricoI;
  cssMostra: string | null = null;
  permListHist: boolean = true;
  permInclHist: boolean = true;
  permitirAcao: boolean = true;

  showUsuarioSituacao = true;
  tarefa_historico = true;
  usuarioSN = true;
  situacaoSN = true;
  andamentoSN = true;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    public md: MenuDatatableService,
    private router: Router,
    public ts: TarefaService,
    public tfs: TarefaFormService
  ) { }

  ngOnInit() {
    if (this.ts.selecionados === undefined || this.ts.selecionados === null || !Array.isArray(this.ts.selecionados)) {
      this.ts.selecionados = [];
    }

    this.montaColunas();

    if (!this.ts.stateSN) {
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
          this.ts.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.ts.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ts.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ts.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ts.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ts.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.ts.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.ts.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ts.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ts.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.ts.busca$.subscribe(
      () => {
        if (this.ts.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.ts.busca.todos = false;
      }
    ));

    this.getColunas();
  }

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  /*mapeiaColunas() {
    if (this.ts.titulos === undefined || this.ts.titulos === null || (Array.isArray(this.ts.titulos) && this.ts.titulos.length === 0)) {
      this.ts.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }*/

  mapeiaColunas() {
    if (this.ts.titulos === undefined || this.ts.titulos === null || (Array.isArray(this.ts.titulos) && this.ts.titulos.length === 0)) {
      this.ts.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaColunas() {
    this.cols = [
      {field: 'tarefa_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'tarefa_titulo', header: 'TITULO', sortable: 'true', width: '150px'},
      {field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'true', width: '500px'},
      {field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'tarefa_data', header: 'PRAZO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario_autor_nome', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'tarefa_datahora', header: 'DATA PEDIDO', sortable: 'true', width: '150px'},
      // {field: 'tarefa_usuario_situacao', header: 'SITUAÇÃO DEMANDADOS', sortable: 'true', width: '350px'},
      // {field: 'tarefa_historico', header: 'ANDAMENTOS', sortable: 'true', width: '500px'},
      {field: 'tarefa_usuario_situacao_andamento', header: 'ANDAMENTOS', sortable: 'true', width: '900px'},
    ];
    /*this.cols = [
      {field: 'tarefa_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'tarefa_titulo', header: 'TITULO', sortable: 'true', width: '150px'},
      {field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'true', width: '500px'},
      {field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'tarefa_data', header: 'PRAZO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario', header: 'DEMANDADOS', sortable: 'true', width: '170px'},
      {field: 'tarefa_usuario_situacao', header: 'SITUAÇÃO DEMANDADOS', sortable: 'true', width: '170px'},
      {field: 'tarefa_autor', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'tarefa_datahora', header: 'DATA PEDIDO', sortable: 'true', width: '150px'},
      {field: 'tarefa_historico', header: 'ANDAMENTOS', sortable: 'true', width: '170px'},
      {field: 'tarefa_historico', header: 'ULTIMOS ANDAMENTOS', sortable: 'true', width: '170px'},
    ];*/
  }

  resetSelectedColumns(): void {
    this.ts.criaTabela();
    this.ts.tabela.selectedColumns = [
      {field: 'tarefa_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'tarefa_titulo', header: 'TITULO', sortable: 'true', width: '150px'},
      {field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'true', width: '500px'},
      {field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'tarefa_data', header: 'PRAZO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario_autor_nome', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'tarefa_datahora', header: 'DATA PEDIDO', sortable: 'true', width: '150px'},
      // {field: 'tarefa_usuario_situacao', header: 'SITUAÇÃO DEMANDADOS', sortable: 'true', width: '350px'},
      // {field: 'tarefa_historico', header: 'ANDAMENTOS', sortable: 'true', width: '900px'},
      {field: 'tarefa_usuario_situacao_andamento', header: 'ANDAMENTOS', sortable: 'true', width: '900px'},
    ];
  }

  resetColunas() {
    this.ts.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.ts.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.ts.tabela.mostraSeletor = false;
  }

  rowColor(field: string, vl1: number): string | null {
    if (field !== 'tarefa_situacao_nome') {
      return null;
    }

    if (field === 'tarefa_situacao_nome') {
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
          this.tarefaDetalheCompleto(this.ts.Contexto);
        }
      }];


      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.tarefaAlterar(this.ts.Contexto);
          }
        });



      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.tarefaApagar(this.ts.Contexto);
          }
        });

  }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.ts.tabela.sortField !== event.sortField) {
      this.ts.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.ts.tabela.first !== +event.first) {
      this.ts.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.ts.tabela.rows !== +event.rows) {
      this.ts.tabela.rows = +event.rows;
      ct++;
    }
    if (this.ts.tabela.sortOrder !== +event.sortOrder) {
      this.ts.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.ts.lazy = true;
      this.ts.tarefaBusca();
    }
  }

  // FUNCOES DE BUSCA ==========================================================

  // FUNCOES DE CRUD ===========================================================

  tarefaIncluir(): void {
      this.tfs.acao = 'incluir';
      this.ts.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/tarefa/incluir']);
  }

  tarefaDetalheCompleto(tar: TarefaI) {
    this.showDetalhe = true;
    this.tarefaDetalhe = tar;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.tarefaDetalhe = null;
  }

  tarefaAlterar(tar: TarefaI) {
      this.ts.salvaState();
      this.dtb.saveState();
      this.tfs.acao = 'alterar';
      this.tfs.tarefaListar = tar;
      this.tfs.parceTarefaForm(tar);
      this.router.navigate(['/tarefa/alterar']);
  }

  tarefaApagar(tar: TarefaI) {
    if (this.permissaoApagarArquivo(tar)) {
      this.ts.tarefaApagar = tar;
      this.ts.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/tarefa/apagar']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  /*tarefaAtualizar(eme: TarefaI) {
    if (this.aut.tarefa_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      console.log('tarefaAtualizar', eme);
      this.ts.salvaState();
      this.dtb.saveState();
      this.tfs.tarefaListar = eme;
      this.tfs.resetAtualizar();
      this.tfs.parceEmendaAtualizar(eme);
      this.router.navigate(['/tarefa/atualizar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }*/

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  andamentoAcao(idx: number, acao: string) {
    this.acaoHistorico = acao;
    this.idx = idx;
    this.showHistorico = true;
    this.mostraDialog(true);
  }

  permissaoApagarArquivo(tar: TarefaI): boolean {
    if (this.aut.arquivos_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      return true
    }
    return !(tar.tarefa_arquivos !== undefined && tar.tarefa_arquivos !== null && Array.isArray(tar.tarefa_arquivos) && tar.tarefa_arquivos.length > 0);
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'p-d-none';
  }

  recebeRegistro(p: TarefaI) {
    this.ts.tarefas[this.idx] = p;
    const a: any = {
      data: p
    }
    this.ts.onRowExpand(a);
    /*const idx = this.ts.tarefas.findIndex(i => i.tarefa_id === p.andamento_tarefa_tarefa_id);
    const pp: TarefaI = this.ts.tarefas[idx];
    const ap:TarefaHistoricoI[] = pp.andamento_tarefa;
    const apidx = ap.findIndex(a => a.andamento_tarefa_id === p.andamento_tarefa_id);
    if (apidx === -1) {
      ap.push(p)
    }*/
    // this.ts.recebeRegistro(h);
  }

  ngOnDestroy(): void {
    this.ts.selecionados = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  getColunas() {
    this.ts.colunas = this.cols.map(t => {
      return t.field;
    });
  }

  rowStyle(field: string, vl1: number): string | null {
    switch (field) {
      case 'tarefa_situacao_nome':
        switch (vl1) {
          case 1:
            return 'tstatus-1';
          case 2:
            return 'tstatus-2';
          case 3:
            return 'tstatus-3';
          case 4:
            return 'tstatus-4';
          default:
            return 'tstatus-0';
        }
      case 'tarefa_usuario_situacao':
      case 'tarefa_historico':
        return 'tarefa';
    default:
      return null;
    }
  }

}
