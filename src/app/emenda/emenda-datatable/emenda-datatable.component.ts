import {Component, OnInit, ViewChild} from '@angular/core';
import {WindowsService} from "../../_layout/_service";
import {Subscription} from "rxjs";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {Router} from "@angular/router";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {EmendaService} from "../_services/emenda.service";
import {EmendaFormService} from "../_services/emenda-form.service";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {EmendaListarI} from "../_models/emenda-listar-i";
import {HistFormI, HistI, HistListI} from "../../hist/_models/hist-i";


@Component({
  selector: 'app-emenda-datatable',
  templateUrl: './emenda-datatable.component.html',
  styleUrls: ['./emenda-datatable.component.css']
})
export class EmendaDatatableComponent implements OnInit {
  @ViewChild('dtb', {static: true}) public dtb: any;
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  showDetalhe = false;
  emendaDetalhe?: EmendaListarI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];

  histListI: HistListI;
  showHistorico = false;
  tituloHistoricoDialog = 'ANDAMENTOS';
  histAcao: string = '';
  histFormI?: HistFormI;
  cssMostra: string | null = null;
  permListHist: boolean = false;
  permInclHist: boolean = false;
  permitirAcao: boolean = true;




  real = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  valCols: string[] = [
    'emenda_valor_solicitado',
    'emenda_valor_empenhado',
    'emenda_valor_pago'
  ];


  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    public md: MenuDatatableService,
    public es: EmendaService,
    public efs: EmendaFormService
  ) { }

  ngOnInit(): void {
    if (this.es.selecionados === undefined || this.es.selecionados === null || !Array.isArray(this.es.selecionados)) {
      this.es.selecionados = [];
    }
    this.permListHist = (this.aut.emenda_listar || this.aut.emenda_incluir || this.aut.emenda_alterar || this.aut.emenda_apagar ||  this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permInclHist = (this.aut.emenda_listar || this.aut.emenda_incluir || this.aut.emenda_alterar || this.aut.emenda_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);

    this.montaColunas();

    if (!this.es.stateSN) {
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
          this.es.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.es.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.es.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.es.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.es.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.es.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.es.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.es.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.es.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.es.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.es.busca$.subscribe(
      () => {
        if (this.es.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.es.busca.todos = false;
      }
    ));

    this.getColunas();
  }

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    if (this.es.titulos === undefined || this.es.titulos === null || (Array.isArray(this.es.titulos) && this.es.titulos.length === 0)) {
      this.es.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaColunas() {
    this.cols = [
      {field: 'emenda_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'emenda_cadastro_tipo_nome', header: 'TIPO DE SOLICITANTE', sortable: 'true', width: '150px'},
      {field: 'emenda_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '150px'},
      {field: 'emenda_autor_nome', header: 'AUTOR', sortable: 'true', width: '200px'},
      {field: 'emenda_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'emenda_numero', header: 'NÚM EMENDA', sortable: 'true', width: '200px'},
      {field: 'emenda_funcional_programatica', header: 'FUNC. PROGRAMÁTICA', sortable: 'true', width: '200px'},
      {field: 'emenda_orgao_solicitado_nome', header: 'ORGÃO SOLICITADO', sortable: 'true', width: '200px'},
      {field: 'emenda_numero_protocolo', header: 'NUM. PROTOCOLO', sortable: 'true', width: '250px'},
      {field: 'emenda_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '300px'},
      {field: 'emenda_data_solicitacao', header: 'DT. SOLICITAÇÃO', sortable: 'true', width: '300px'},
      {field: 'emenda_processo', header: 'CONTRATO/PROCESSO', sortable: 'true', width: '300px'},
      {field: 'emenda_tipo_emenda_nome', header: 'TIPO DE EMENDA', sortable: 'true', width: '300px'},
      {field: 'emenda_ogu_nome', header: 'O.G.U.', sortable: 'true', width: '300px'},
      {field: 'emenda_valor_solicitado', header: 'VL. SOLICITADO', sortable: 'true', width: '300px'},
      {field: 'emenda_valor_empenhado', header: 'VL. EMPENHADO', sortable: 'true', width: '200px'},
      {field: 'emenda_data_empenho', header: 'DT. EMPENHO', sortable: 'true', width: '200px'},
      {field: 'emenda_numero_empenho', header: 'NUM EMPENHO', sortable: 'true', width: '300px'},
      {field: 'emenda_crnr', header: 'CR.NR.', sortable: 'true', width: '250px'},
      {field: 'emenda_gmdna', header: 'GND/MA', sortable: 'true', width: '200px'},
      {field: 'emenda_observacao_pagamento', header: 'INFO. PGTO', sortable: 'true', width: '200px'},
      {field: 'emenda_data_pagamento', header: 'DT. PAGAMENTO', sortable: 'true', width: '200px'},
      {field: 'emenda_valor_pago', header: 'VL PAGAMENTO', sortable: 'true', width: '200px'},
      {field: 'emenda_numero_ordem_bancaria', header: 'ORD. BANCÁRIA', sortable: 'true', width: '200px'},
      {field: 'emenda_justificativa', header: 'JUSTIFICATIVA', sortable: 'true', width: '230px'},
      {field: 'emenda_local_nome', header: 'NÚCLEO', sortable: 'true', width: '150px'},
      {field: 'emenda_uggestao', header: 'UG/GESTÃO', sortable: 'true', width: '150px'},
      {field: 'emenda_siconv', header: 'SICONV', sortable: 'true', width: '150px'},
      {field: 'emenda_regiao', header: 'REGIÃO', sortable: 'true', width: '150px'},
      {field: 'emenda_contrato', header: 'CONTRATO CAIXA', sortable: 'true', width: '150px'},
      {field: 'emenda_porcentagem', header: 'PORCENTAGEM', sortable: 'true', width: '150px'},
      {field: 'cadastro_cpfcnpj', header: 'CPF/CNPJ', sortable: 'true', width: '150px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '150px'},
    ];
  }

  resetSelectedColumns(): void {
    this.es.criaTabela();
    this.es.tabela.selectedColumns = [
      {field: 'emenda_orgao_solicitado_nome', header: 'ORGÃO SOLICITADO', sortable: 'true', width: '200px'},
      {field: 'emenda_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '200px'},
      {field: 'emenda_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '300px'},
      {field: 'emenda_tipo_emenda_nome', header: 'TIPO DE EMENDA', sortable: 'true', width: '300px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '300px'},
      {field: 'emenda_data_solicitacao', header: 'DT. SOLICITAÇÃO', sortable: 'true', width: '300px'},
      {field: 'emenda_processo', header: 'Nº PROCESSO', sortable: 'true', width: '150px'},
      {field: 'emenda_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '300px'},
      {field: 'emenda_numero', header: 'NÚM EMENDA', sortable: 'true', width: '150px'}
    ];
  }

  resetColunas() {
    this.es.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.es.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.es.tabela.mostraSeletor = false;
  }

  rowColor(field: string, vl1: number): string | null {
    if (field !== 'emenda_situacao_nome') {
      return null;
    }

    if (field === 'emenda_situacao_nome') {
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
          this.emendaDetalheCompleto(this.es.Contexto);
        }
      }];

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.emenda_alterar) {
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.emendaAlterar(this.es.Contexto);
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.emenda_apagar) {
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.emendaApagar(this.es.Contexto);
          }
        });
    }
  }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.es.tabela.sortField !== event.sortField) {
      this.es.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.es.tabela.first !== +event.first) {
      this.es.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.es.tabela.rows !== +event.rows) {
      this.es.tabela.rows = +event.rows;
      ct++;
    }
    if (this.es.tabela.sortOrder !== +event.sortOrder) {
      this.es.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.es.lazy = true;
      this.es.emendaBusca();
    }
  }

  // FUNCOES DE BUSCA ==========================================================

  // FUNCOES DE CRUD ===========================================================

  emendaIncluir(): void {
    if (this.aut.emenda_incluir || this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) {
      this.efs.acao = 'incluir';
      this.es.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/emenda/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  emendaDetalheCompleto(eme: EmendaListarI) {
    this.showDetalhe = true;
    this.emendaDetalhe = eme;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.emendaDetalhe = null;
  }

  emendaAlterar(eme: EmendaListarI) {
    if (this.aut.emenda_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.es.salvaState();
      this.dtb.saveState();
      this.efs.acao = 'alterar';
      this.efs.emendaListar = eme;
      this.efs.parceEmendaFormulario(eme);
      this.router.navigate(['/emenda/alterar']);
    } else {
      console.error('SEM PERMISSAO');
    }

  }

  emendaApagar(eme: EmendaListarI) {
    if ((this.aut.emenda_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn ) && this.permissaoApagarArquivo(eme)) {
      this.es.emendaApagar = eme;
      this.es.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/emenda/apagar']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  emendaAtualizar(eme: EmendaListarI) {
    if (this.aut.emenda_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.es.salvaState();
      this.dtb.saveState();
      this.efs.emendaListar = eme;
      this.efs.resetAtualizar();
      this.efs.parceEmendaAtualizar(eme);
      this.router.navigate(['/emenda/atualizar']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  historicoAcao(registro_id: number, acao: string, modulo: string, idx: number, permitirAcao: boolean = true, historicos?: HistI[]) {
    this.tituloHistoricoDialog = 'EMENDA';
    this.tituloHistoricoDialog += acao.toUpperCase() + ' ANDAMENTOS';
    this.histAcao = acao;
    this.permitirAcao = permitirAcao;
    if (acao === 'listar') {
      this.histListI = {
        hist: historicos,
        idx: idx,
        registro_id: registro_id,
        modulo: modulo
      }
      this.es.montaHistorico(modulo, idx);
    }
    if (acao === 'incluir') {
      this.histFormI = {
        idx: idx,
        acao: acao,
        modulo: modulo,
        hist: {
          historico_emenda_id: (modulo === 'emenda') ? registro_id : undefined,
        }
      }
    }
    this.showHistorico = true;
    this.mostraDialog(true);
  }

  permissaoApagarArquivo(eme: EmendaListarI): boolean {
    if (this.aut.arquivos_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      return true
    }
    return !(eme.emenda_arquivos !== undefined && eme.emenda_arquivos !== null && Array.isArray(eme.emenda_arquivos) && eme.emenda_arquivos.length > 0);
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'p-d-none';
  }

  recebeRegistro(h: HistFormI) {
    this.es.recebeRegistro(h);
  }


  ngOnDestroy(): void {
    this.es.selecionados = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  getColunas() {
    this.es.colunas = this.cols.map(t => {
      return t.field;
    });
  }
}
