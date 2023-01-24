import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WindowsService} from "../../_layout/_service";
import {Subscription} from "rxjs";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {AuthenticationService, MenuInternoService,} from "../../_services";
import {Router} from "@angular/router";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {SolicListarI} from "../_models/solic-listar-i";
import {SolicService} from "../_services/solic.service";
import {SolicFormService} from "../_services/solic-form.service";
import {HistFormI, HistI, HistListI} from "../../hist/_models/hist-i";
import {Stripslashes} from "../../shared/functions/stripslashes";


@Component({
  selector: 'app-solic-datatable',
  templateUrl: './solic-datatable.component.html',
  styleUrls: ['./solic-datatable.component.css']
})

export class SolicDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: any;
  altura = `${WindowsService.altura - 150}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  authAlterar = false;
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;
  solicitacaoVersao: number;
  showDetalhe = false;
  solDetalhe?: SolicListarI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  histListI: HistListI;
  showHistorico = false;
  tituloHistoricoDialog = 'ANDAMENTOS';
  histAcao = '';
  histFormI?: HistFormI;
  cssMostra: string | null = null;
  permListHistSol = false;
  permInclHistSol = false;
  permListHist = false;
  permInclHist = false;
  permitirAcao = true;
  showGrafico = false;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    public md: MenuDatatableService,
    public ss: SolicService,
    private sfs: SolicFormService
  ) { }

  ngOnInit() {
    this.permListHist = ((this.aut.processo && this.aut.solicitacaoVersao === 1) && (this.aut.processo_listar || this.aut.historico_incluir || this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
    this.permInclHist = ((this.aut.processo && this.aut.solicitacaoVersao === 1) && (this.aut.historico_incluir || this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
    this.permListHistSol = (this.aut.processo_listar || this.aut.historico_incluir || this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || (this.aut.usuario_responsavel_sn || this.permListHist));
    this.permInclHistSol = (this.aut.historico_solicitacao_incluir || this.aut.historico_solicitacao_alterar || this.aut.solicitacao_analisar || (this.aut.usuario_responsavel_sn || this.permInclHist));

    this.montaColunas();

    if (!this.ss.stateSN) {
      this.resetSelectedColumns();
    }

    this.itemsAcao = [
      {
        label: 'Graficos', icon: 'pi pi-chart-line', style: {'font-size': '.9em'}, command: () => {
          this.showGrafico = true;
        }
      },
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
          this.ss.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.ss.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ss.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ss.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ss.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ss.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.ss.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.ss.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ss.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ss.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.ss.busca$.subscribe(
      () => {
        this.mapeiaColunas();
        this.ss.busca.todos = false;
      }
    ));

  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    if (this.ss.titulos === undefined || this.ss.titulos === null || (Array.isArray(this.ss.titulos) && this.ss.titulos.length === 0)) {
      this.ss.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaColunas() {

    this.cols = [
      {field: 'solicitacao_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'solicitacao_situacao', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'solicitacao_status_nome', header: 'STATUS', sortable: 'true', width: '160px'},
    ];
    if (this.solicitacaoVersao === 1) {
      this.cols.push(
        {field: 'processo_status_nome', header: 'ST. PROCESSO', sortable: 'true', width: '160px'}
      );
    }
    this.cols.push(
      {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '300px'},
      {field: 'solicitacao_cadastro_tipo_nome', header: 'TIPO SOLICITANTE', sortable: 'true', width: '200px'}
    );
    if (this.aut.cadastro_listar) {
      this.cols.push(
        {field: 'cadastro_endereco', header: 'ENDEREÇO', sortable: 'false', width: '300px'},
        {field: 'cadastro_endereco_numero', header: 'END.Nº', sortable: 'false', width: '150px'},
        {field: 'cadastro_endereco_complemento', header: 'END.COMPL.', sortable: 'false', width: '130px'},
      );
    }
    this.cols.push(
      {field: 'cadastro_bairro', header: 'BAIRRO', sortable: 'true', width: '200px'},
      {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', width: '200px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '300px'},
      {field: 'cadastro_estado_nome', header: 'UF', sortable: 'true', width: '70px'},
    );
    if (this.aut.cadastro_listar) {
      this.cols.push(
        {field: 'cadastro_email', header: 'E-MAIL1', sortable: 'false', width: '200px'},
        {field: 'cadastro_email2', header: 'E-MAIL2', sortable: 'false', width: '200px'},
        {field: 'cadastro_telefone', header: 'TELEFONE1', sortable: 'false', width: '150px'},
        {field: 'cadastro_telefone2', header: 'TELEFONE2', sortable: 'false', width: '150px'},
        {field: 'cadastro_telcom', header: 'TEL.COM.', sortable: 'false', width: '150px'},
        {field: 'cadastro_celular', header: 'CELULAR1', sortable: 'false', width: '150px'},
        {field: 'cadastro_celular2', header: 'CELULAR2', sortable: 'false', width: '150px'},
        {field: 'cadastro_fax', header: 'WHATSAPP', sortable: 'false', width: '150px'},
      );
    }
    this.cols.push(
      {field: 'solicitacao_data', header: 'DATA', sortable: 'true', width: '130px'},
      {field: 'solicitacao_orgao', header: 'ORGÃO SOLIC.', sortable: 'false', width: '300px'},
      {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '300px'},
      {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', width: '300px'},
      {field: 'solicitacao_numero_oficio', header: 'Nº OFÍCIO', sortable: 'false', width: '150px'}
    );

    if (this.solicitacaoVersao === 1) {
      this.cols.push(
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'false', width: '150px'},
        {field: 'processo_status_nome', header: 'SIT. PROCESSO', sortable: 'true', width: '210px'},
        {field: 'solicitacao_indicacao_sn', header: 'INDICADO S/N', sortable: 'true', width: '140px'},
      );
    }
    this.cols.push(
      {field: 'solicitacao_indicacao_nome', header: 'INDICAÇÃO', sortable: 'true', width: '250px'},
    );
    if (this.solicitacaoVersao < 3) {
      this.cols.push(
        {field: 'solicitacao_reponsavel_analize_nome', header: 'RESPONSÁVEL', sortable: 'true', width: '200px'},
        {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', width: '200px'}
      );
    }
    this.cols.push(
      {field: 'solicitacao_data_atendimento', header: 'DT ATENDIMENTO', sortable: 'true', width: '230px'},
      {field: 'solicitacao_atendente_cadastro_nome', header: 'ATENDENTE', sortable: 'true', width: '200px'}
    );
    if (this.solicitacaoVersao === 1) {
      this.cols.push(
        {field: 'solicitacao_cadastrante_cadastro_nome', header: 'CADASTRANTE', sortable: 'true', width: '200px'},
        {field: 'solicitacao_tipo_recebimento_nome', header: 'TP. RECEBIMENTO', sortable: 'true', width: '165px'}
      );
    }
    this.cols.push(
      {field: 'solicitacao_descricao', header: 'DESCRIÇÃO', sortable: 'false', width: '400px'},
      {field: 'solicitacao_aceita_recusada', header: 'OBSERVAÇÕES', sortable: 'false', width: '400px'}
    );
    if (this.solicitacaoVersao === 1) {
      this.cols.push(
        {field: 'solicitacao_carta', header: 'RESPOSTA', sortable: 'true', width: '400px'}
      );
    }

  }

  resetSelectedColumns(): void {
    this.ss.criaTabela();
    this.ss.tabela.selectedColumns = [
      {field: 'solicitacao_situacao', header: 'SITUAÇÃO', sortable: 'true', width: '130px'},
      {field: 'solicitacao_status_nome', header: 'STATUS', sortable: 'true', width: '130px'},
      {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '300px'},
      {field: 'solicitacao_data', header: 'DATA', sortable: 'true', width: '130px'},
      {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '300px'},
      {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', width: '300px'},
    ];
    if (this.solicitacaoVersao === 1) {
      this.ss.tabela.selectedColumns.push(
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'false', width: '150px'},
        {field: 'processo_status_nome', header: 'ST. PROCESSO', sortable: 'true', width: '150px'}
      );
    }
    this.ss.tabela.selectedColumns.push(
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '300px'},
      {field: 'solicitacao_orgao', header: 'ORGÃO SOLIC.', sortable: 'false', width: '300px'}
    );
  }

  resetColunas() {
    this.ss.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.ss.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.ss.tabela.mostraSeletor = false;
  }

  rowColor(field: string, vl1: number, vl2: string, vl3: string | number): string | null {
    if (field !== 'processo_status_nome' && field !== 'solicitacao_status_nome' && field !== 'solicitacao_situacao') {
      return null;
    }
    if (field === 'processo_status_nome') {
      return (typeof vl1 === 'undefined' || vl1 === null || vl1 === 0) ? 'status-0' : 'status-' + vl1;
    }
    if (field === 'solicitacao_status_nome') {
      switch (vl2) {
        case 'EM ABERTO':
          return 'status-0';
        case 'EM ANDAMENTO':
          return 'status-1';
        case 'INDEFERIDO':
          return 'status-2';
        case 'DEFERIDO':
          return 'status-3';
        case 'SUSPENSO':
          return 'status-4';
        default:
          return null;
      }
    }
    switch (vl3) {
      case 'EM ABERTO':
        return 'situacao-0';
      case 'EM ANDAMENTO':
        return 'situacao-1';
      case 'CONCLUIDA':
        return 'situacao-2';
      case 'SUSPENSO':
        return 'situacao-3';
      default:
        return null;
    }
  }

  montaMenuContexto() {
    this.contextoMenu = [
      {
        label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {
          this.solicitacaoDetalheCompleto(this.ss.Contexto);
        }
      }];

    if (this.aut.usuario_responsavel_sn) {
      this.authAnalisar = true;
      this.contextoMenu.push(
        {
          label: 'ANALISAR', icon: 'pi pi-exclamation-circle', style: {'font-size': '1em'},
          command: () => {
            this.solicitacaoAnalisar(this.ss.Contexto);
          }
        });
    }

    if (this.aut.solicitacao_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.solicitacaoAlterar(this.ss.Contexto);
          }
        });
    }

    if (this.aut.solicitacao_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.solicitacaoApagar(this.ss.Contexto);
          }
        });
    }
  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.ss.tabela.sortField !== event.sortField) {
      this.ss.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.ss.tabela.first !== +event.first) {
      this.ss.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.ss.tabela.rows !== +event.rows) {
      this.ss.tabela.rows = +event.rows;
      ct++;
    }
    if (this.ss.tabela.sortOrder !== +event.sortOrder) {
      this.ss.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.ss.lazy = true;
      this.ss.solicitacaoBusca();
    }
  }

  // FUNCOES DE BUSCA ==========================================================

  // FUNCOES DE CRUD ===========================================================

  solicitacaoIncluir(): void {
    if (this.aut.solicitacao_incluir) {
      this.sfs.acao = 'incluir';
      this.sfs.criaTipoAnalise(this.aut.solicitacao_analisar);
      this.ss.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/solic/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  solicitacaoDetalheCompleto(sol: SolicListarI) {
    // this.ss.showTitulos();
    this.showDetalhe = true;
    this.solDetalhe = sol;
    console.log(this.ss.titulos);
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.solDetalhe = null;
  }

  solicitacaoAlterar(sol: SolicListarI) {
    if (this.aut.solicitacao_alterar) {
      this.ss.salvaState();
      this.dtb.saveState();
      this.sfs.acao = 'alterar';
      this.sfs.solicListar = sol;
      this.sfs.criaTipoAnalise(this.aut.solicitacao_analisar);
      this.sfs.parseListagemForm(sol);
      this.router.navigate(['/solic/alterar']);
    } else {
      console.log('SEM PERMISSAO');
    }

  }

  solicitacaoApagar(sol: SolicListarI) {
    if (this.aut.solicitacao_apagar) {
      this.ss.solicitacaoApagar = sol;
      this.sfs.acao = 'alterar';
      this.ss.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/solic/apagar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  solicitacaoAnalisar(sol: SolicListarI) {
    if (this.aut.solicitacao_analisar) {
      this.ss.salvaState();
      this.dtb.saveState();
      this.sfs.acao = 'analisar';
      this.sfs.parseListagemAnalisarForm(sol);
      this.sfs.criaTipoAnalise(this.aut.solicitacao_analisar);
      this.router.navigate(['/solic/analisar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  historicoAcao(registro_id: number, acao: string, modulo: string, idx: number, permitirAcao = true, historicos?: HistI[]) {
    this.tituloHistoricoDialog = (modulo === 'solicitacao') ? 'SOLICITAÇÃO - ' : 'PROCESSO - ';
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
      this.ss.montaHistorico(modulo, idx);
    }
    if (acao === 'incluir') {
      this.histFormI = {
        idx: idx,
        acao: acao,
        modulo: modulo,
        hist: {
          historico_solicitacao_id: (modulo === 'solicitacao') ? registro_id : undefined,
          historico_processo_id: (modulo === 'processo') ? registro_id : undefined,
        }
      }
    }
    this.showHistorico = true;
    this.mostraDialog(true);
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'hidden';
  }

  recebeRegistro(h: HistFormI) {
    this.ss.recebeRegistro(h);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  hideGrafico(ev: boolean) {
    this.showGrafico = ev;
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
