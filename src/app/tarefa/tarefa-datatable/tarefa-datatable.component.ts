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
import {TarefaPrintService} from "../_services/tarefa-print.service";
import {MsgService} from "../../_services/msg.service";


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
  showHistorico = false;
  showIncluirHistorico = false;
  histFormI?: TarefaHistoricoI;
  cssMostra: string | null = null;
/*  permListHist: boolean = true;
  permInclHist: boolean = true;
  permitirAcao: boolean = true;*/

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    public md: MenuDatatableService,
    private router: Router,
    public ts: TarefaService,
    public tfs: TarefaFormService,
    public tp: TarefaPrintService,
    private ms: MsgService
  ) {
  }

  ngOnInit() {
    // this.usuario_id = +this.aut.usuario_id;
    if (this.ts.selecionados === undefined || this.ts.selecionados === null || !Array.isArray(this.ts.selecionados)) {
      this.ts.selecionados = [];
    }

    this.montaColunas();

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
          // this.imprimirSN = true;
          // this.imprimirTabela();
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
      {field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'true', width: '400px'},
      {field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '160px'},
      {field: 'tarefa_usuario_situacao', header: 'DEMANDADOS SITUAÇÃO', sortable: 'false', width: '250px'},
      {field: 'tarefa_data', header: 'PRAZO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario_autor_nome', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'tarefa_datahora', header: 'DATA PEDIDO', sortable: 'true', width: '150px'},
      {
        field: 'tarefa_usuario_situacao_andamento',
        header: 'DEMANDADOS SITUAÇÃO ANDAMENTOS',
        sortable: 'false',
        width: '430px'
      },
    ];
    if (!this.ts.stateSN) {
      this.resetSelectedColumns();
    }
  }

  resetSelectedColumns(): void {
    this.ts.criaTabela();
    this.ts.tabela.selectedColumns = [
      {field: 'tarefa_titulo', header: 'TITULO', sortable: 'true', width: '150px'},
      {field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'true', width: '400px'},
      {field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '160px'},
      {field: 'tarefa_usuario_situacao', header: 'DEMANDADOS SITUAÇÃO', sortable: 'false', width: '250px'},
      {field: 'tarefa_data', header: 'PRAZO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario_autor_nome', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'tarefa_datahora', header: 'DATA PEDIDO', sortable: 'true', width: '150px'},
      // {field: 'tarefa_usuario_situacao_andamento', header: 'ANDAMENTOS', sortable: 'true', width: '900px'},
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
          this.tarefaAlterar(this.ts.Contexto, this.ts.idx);
        }
      });


    this.contextoMenu.push(
      {
        label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
        command: () => {
          this.tarefaApagar(this.ts.Contexto, this.ts.idx);
        }
      });

    this.contextoMenu.push(
      {
        label: 'LISTAR ANDAMENTO', icon: 'pi pi-list', style: {'font-size': '1em'},
        command: () => {
          this.andamentoList(this.ts.Contexto, this.ts.idx);
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
    this.ts.salvaState();
    this.dtb.saveState();
    this.ts.acaoForm = 'INCLUIR';
    this.tfs.acao = 'incluir';
    this.tfs.origem = 'listagem';
    this.tfs.criaFormIncluir()
    this.ts.showForm = true;
  }

  tarefaDetalheCompleto(tar: TarefaI) {
    this.tp.valores = this.ts.tarefas;
    this.showDetalhe = true;
    this.tarefaDetalhe = tar;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.tarefaDetalhe = null;
  }

  tarefaAlterar(tar: TarefaI, indice: number) {
    if (+tar.tarefa_usuario_autor_id === +this.aut.usuario_id || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.ts.salvaState();
      this.dtb.saveState();
      this.ts.acaoForm = 'ALTERAR';
      this.tfs.acao = 'alterar';
      this.tfs.idx = indice;
      this.tfs.tarefaListar = tar;
      this.tfs.origem = 'listagem';
      this.tfs.parceTarefaForm(tar);
      this.ts.showForm = true;
    } else {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - SEM PERMISSÃO',
        detail: 'Você não tem permissão para alterar esta tarefa.'
      });
    }
  }

  tarefaApagar(tar: TarefaI, indice: number) {
    if (+tar.tarefa_usuario_autor_id === +this.aut.usuario_id || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      if (this.permissaoApagarArquivo(tar)) {
        this.ts.tarefaApagar = tar;
        // this.ts.salvaState();
        // this.dtb.saveState();
        this.ts.acaoForm = 'APAGAR';
        this.ts.idx = indice;
        this.ts.showExcluir = true;
      } else {
        this.ms.add({
          key: 'toastprincipal',
          severity: 'warn',
          summary: 'ATENÇÃO - SEM PERMISSÃO',
          detail: 'Esta tarefa possui arquivo(s) anexado(s_ e você não tem permissão para apaga-lo(s).'
        });
      }
    } else {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - SEM PERMISSÃO',
        detail: 'Você não tem permissão para apagar esta tarefa.'
      });
    }
  }

  fechaApagar(ev: boolean) {
    this.ts.showExcluir = false;
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  andamentoIncluir(tar: TarefaI, indice: number) {
    this.tarefaDetalhe = tar;
    this.idx = indice;
    this.showIncluirHistorico = true;
  }

  andamentoList(tar: TarefaI, indice: number) {
    this.tarefaDetalhe = tar;
    this.idx = indice;
    this.showHistorico = true;
  }

  fecharListAnd(ev) {
    this.tarefaDetalhe = undefined;
    this.idx = 0;
    this.showHistorico = false;
  }

  fecharIncluirAnd(ev) {
    this.tarefaDetalhe = undefined;
    this.idx = 0;
    this.showIncluirHistorico = false;
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

  fechaTusForm(ev) {
    this.ts.showTusForm = false;
  }

  fechaDetalhes(ev) {
    this.showDetalhe = false;
  }

  mostraTusFormEvent(ev: boolean) {
    this.ts.showTusForm = true;
  }

  fechaTsForm(ev: boolean) {
    this.ts.showSitForm = false;
  }

  onTogleRow(ev) {
    this.dtb.toggleRow(this.ts.tabela.dadosExpandidosRaw.data, this.ts.tabela.dadosExpandidosRaw.originalEvent);
  }

  mostraTsFormEvent(ev: boolean) {
    this.ts.showSitForm = true;
  }

  teste(): boolean {
    let el = document.querySelector("div.p-datatable-scrollable-view");// p-datatable-scrollable-view
    el.setAttribute('id', 'pagimprimir');
    return true;
  }

  imprimirTarefa(tarefa: TarefaI) {
    this.ts.onImprimirTarefa(tarefa);
  }

  onGerarPdfTarefa(tarefa: TarefaI) {
    this.ts.onGerarPdfTarefa(tarefa);
  }

}
