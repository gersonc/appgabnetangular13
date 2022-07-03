import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
//import {Editor} from "primeng/editor";
import {WindowsService} from "../../_layout/_service";
import {Subscription} from "rxjs";
import {LazyLoadEvent, MenuItem, MessageService} from "primeng/api";
import {AuthenticationService, CsvService, ExcelService, MenuInternoService, TabelaPdfService} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import * as quillToWord from "quill-to-word";
import {Config} from "quill-to-word";
import {saveAs} from "file-saver";
import {SolicListarI, SolicPaginacaoInterface} from "../_models/solic-listar-i";
import {SolicService} from "../_services/solic.service";
import {SolicFormService} from "../_services/solic-form.service";
import {HistFormI, HistI, HistListI} from "../../hist/_models/hist-i";
import {SolicBuscaI} from "../_models/solic-busca-i";
import {PdfService} from "../../_services/pdf.service";
import {pdfTabelaCampoTexto} from "../../shared/functions/pdf-tabela-campo-texto";

@Component({
  selector: 'app-solic-datatable',
  templateUrl: './solic-datatable.component.html',
  styleUrls: ['./solic-datatable.component.css']
})

export class SolicDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: any;
  // @ViewChild('edtor', {static: true}) public edtor: Editor;
  altura = `${WindowsService.altura - 150}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  authAlterar = false;
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;
  solicitacaoVersao: number;
  campoTexto: string = null;
  campoHtml: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;
  showDetalhe = false;
  solDetalhe?: SolicListarI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  colteste: string[];
  mostraSeletor = false;
  cols: any[] = [];
  idx = 0;
  histListI: HistListI;
  showHistorico = false;
  showHistorico2 = false;
  showHistoricoSol = false;
  showHistoricoSol2 = false;

  tituloHistoricoDialog = 'ANDAMENTOS';
  histAcao: string = '';
  registro_id = 0;
  histFormI?: HistFormI;
  cssMostra: string | null = null;
  permListHistSol: boolean = false;
  permInclHistSol: boolean = false;
  permListHist: boolean = false;
  permInclHist: boolean = false;

  impressao = false;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public ss: SolicService,
    public md: MenuDatatableService,
    private sfs: SolicFormService
  ) {
    this.solicitacaoVersao = aut.solicitacaoVersao;
  }

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
          this.exportToCsv(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          // this.mostraTabelaPdf(1);
          this.ss.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          // this.mostraTabelaPdf(2);
          this.ss.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ss.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.imprimirTabela();
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.imprimirTabela(true);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.ss.busca$.subscribe(
      () => {
        if (this.ss.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.ss.busca.todos = false;
      }
    ));

  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    let cp: string[] = [];
    const n = this.cols.length;
    let ct = 1
    this.cols.forEach(c => {
      if (c.field !== 'solicitacao_id') {
        cp.push(c.field);
      }
      ct++;
      if (ct === n) {
        this.ss.montaTitulos(cp);
      }
    });
  }

  achaValor(sol: SolicListarI): number {
    return this.ss.solicitacoes.indexOf(sol);
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
    if (this.ss.tabela.sortField !== event.sortField) {
      this.ss.tabela.sortField = event.sortField;
    }
    if (this.ss.tabela.first !== +event.first) {
      this.ss.tabela.first = +event.first;
    }
    if (event.rows !== undefined && this.ss.tabela.rows !== +event.rows) {
      this.ss.tabela.rows = +event.rows;
    }
    if (this.ss.tabela.sortOrder !== +event.sortOrder) {
      this.ss.tabela.sortOrder = +event.sortOrder;
    }
    this.ss.lazy = true;
    this.ss.solicitacaoBusca();
  }

  mostraSelectColunas(): void {// this
    this.ss.tabela.mostraSeletor = true;
  }

  hideSeletor(ev): void {
    this.mostraSeletor = false;
  }

  historicoAcao(registro_id: number, acao: string, modulo: string, idx: number, historicos?: HistI[]) {
    this.tituloHistoricoDialog = (modulo === 'solicitacao') ? 'SOLICITAÇÃO - ' : 'PROCESSO - ';
    this.tituloHistoricoDialog += acao.toUpperCase() + ' ANDAMENTOS';
    this.histAcao = acao;
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
    this.showHistorico2 = true;
    this.showHistorico = true;
    this.mostraDialog(true);
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'p-d-none';
  }

  recebeRegistro(h: HistFormI) {
    this.ss.recebeRegistro(h);
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
    // this.ss.detalhe = sol;
    this.showDetalhe = true;
    this.solDetalhe = sol;
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


  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(n: number) {

    console.log('tamanhoLinha', this.ss.tamanhoLinha());
    // this.ss.pdfCamposTexto(n);
    // PdfService.tabelaToPdf(this.ss.tabela.selectedColumns, this.ss.solicitacoes);
    // TabelaPdfService.autoTabela('solicitacoes', 'SOLICITAÃOES', this.ss.tabela.selectedColumns, this.ss.solicitacoes);
  }

/*  buscaIdx(id: number) {
    return this.ss.solicitacoes.findIndex(d => {
      d.solicitacao_id = id
    });
  }*/



  /*mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.sbs.busca.todos;
    this.sbs.busca.todos = td;
    if (this.sbs.busca.todos === true) {
      // let solPdf: SolicitacaoInterface[];
      let solPdf: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalPdf: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.busca['campos'] = this.ss.selecionados;
      // this.cs.mostraCarregador();
      this.sub.push(this.ss.postSolicitacaoBusca(this.sbs.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            solPdf = dados.solicitacao;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            // this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('solicitacoes', this.ss.selecionados, solPdf);
            this.sbs.busca.todos = this.tmp;
            // this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.ss.selecionados && this.ss.selecionados.length > 0) {
      TabelaPdfService.autoTabela('solicitacoes', this.ss.selecionados, this.ss.selecionados);
      this.sbs.busca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('solicitacoes', this.ss.selecionados, this.solicitacoes);
    this.sbs.busca.todos = this.tmp;
    return true;
  }*/

  imprimirTabela(td: boolean = false) {

  }

  /*imprimirTabela(td: boolean = false) {
    this.tmp = this.sbs.busca.todos;
    this.sbs.busca.todos = td;
    if (this.sbs.busca.todos === true) {
      // let solprint: SolicitacaoInterface[];
      let solprint: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalprint: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.busca['campos'] = this.ss.selecionados;
      // this.cs.mostraCarregador();
      this.sub.push(this.ss.postSolicitacaoBusca(this.sbs.busca)
        .subscribe({
          next: (dados) => {
            solprint = dados.solicitacao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            // this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.ss.selecionados, solprint);
            this.sbs.busca.todos = this.tmp;
            // this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.ss.selecionados && this.ss.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.ss.selecionados, this.ss.selecionados);
      this.sbs.busca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.ss.selecionados, this.solicitacoes);
    this.sbs.busca.todos = this.tmp;
    return true;
  }*/


  exportToCsv(td: boolean = false) {
    if (td === true) {
      let busca: SolicBuscaI = this.ss.busca;
      busca.rows = undefined;
      busca.campos = this.ss.tabela.selectedColumns;
      busca.todos = td;
      busca.first = undefined;
      let slolicRelatorio: SolicPaginacaoInterface;
      this.sub.push(this.ss.postSolicitacaoRelatorio(busca)
        .subscribe({
          next: (dados) => {
            slolicRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            CsvService.jsonToCsv('solicitacao', this.ss.tabela.selectedColumns, slolicRelatorio.solicitacao);

          }
        })
      );
    }
  }

  exportToXLSX(td: number = 1) {
    const cp = this.ss.excelCamposTexto();
    if (td === 3) {
      let busca: SolicBuscaI = this.ss.busca;
      busca.rows = undefined;
      busca.campos = cp
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let solicRelatorio: SolicPaginacaoInterface;
      this.sub.push(this.ss.postSolicitacaoRelatorio(busca)
        .subscribe({
          next: (dados) => {
            solicRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            ExcelService.criaExcelFile('solicitacao', solicRelatorio.solicitacao, cp);
          }
        })
      );
    }
    if (this.ss.solicitacoes.length > 0 && td === 2) {
      ExcelService.criaExcelFile('solicitacao', pdfTabelaCampoTexto(this.ss.tabela.selectedColumns,this.ss.tabela.camposTexto,this.ss.solicitacoes), this.ss.tabela.selectedColumns);
      return true;
    }
    if (this.ss.selecionados !== undefined && this.ss.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('solicitacao', this.ss.selecionados, cp);
      return true;
    }
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
