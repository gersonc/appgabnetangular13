import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Editor} from "primeng/editor";
import {WindowsService} from "../../_layout/_service";
import {Subscription} from "rxjs";
import {LazyLoadEvent, MenuItem, MessageService} from "primeng/api";
import {
  AuthenticationService,
  CsvService, ExcelService,
  MenuInternoService,
  PrintJSService,
  TabelaPdfService
} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {Config} from "quill-to-word";
import * as quillToWord from "quill-to-word";
import {saveAs} from "file-saver";
import {SolicListarI, SolicPaginacaoInterface} from "../_models/solic-listar-i";
import {SolicService} from "../_services/solic.service";
import {BuscaService} from "../../shared-datatables/services/busca.service";
import {DatatableService} from "../../shared-datatables/services/datatable.service";
import {TSMap} from "typescript-map";
import {ArquivoInterface} from "../../arquivo/_models";
import {SolicForm} from "../_models/solic-form";
import {SolicFormService} from "../_services/solic-form.service";
import {SolicBuscaService} from "../_services/solic-busca.service";


@Component({
  selector: 'app-solic-datatable',
  templateUrl: './solic-datatable.component.html',
  styleUrls: ['./solic-datatable.component.css']
})
export class SolicDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', { static: true }) public dtb: any;
  @ViewChild('edtor', { static: true }) public edtor: Editor;
  loading = false;
  // cols: any[];
  // currentPage = 1;
  // solicitacoes: SolicListarI[];
  // solContexto: SolicListarI;
  // total: SolicTotalInterface;
  // totalRecords = 0;
  // numerodePaginas: number;
  // first: number;
  // rows = 50;
  // selecionados: SolicListarI[] = [];
  // sortCampo = 'solicitacao_posicao2';
  // selectedColumns: any[] = [];
  // selectedColumnsOld: any[] = [];
  // mostraSeletor = false;
  // camposSelecionados: SolicBuscaCampoI[];
  /*altura = `${WindowsService.altura - 180}` + 'px';*/
  altura = `${WindowsService.altura - 150}` + 'px'; // 171.41 = 10.71rem = 10.71 * 16px
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  // numColunas = 3;
  // expColunas = 0;
  // dadosExpandidos: Subscription;
  // expandidoDados: any = false;
  // dadosExp: any[];
  // itemsAcao: MenuItem[];
  // contextoMenu: MenuItem[];
  // tmp = false;
  sub: Subscription[] = [];
  authAlterar = false;
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;
  versao: any;
  // versaoVersao: number;
  campoTexto: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;
  showDetalhe = false;
  solDetalhe?: SolicListarI;
  showHistoricoForm = false;
  solHistForm: any;
  arquivoOficio: TSMap<number, ArquivoInterface[]>;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    // private solicitacaoService: SolicitacaoService,
    private sbs: SolicBuscaService,
    public ss: SolicService,
    public sds: DatatableService,
    public md: MenuDatatableService,
    private sfs: SolicFormService
  ) {
    this.versao = aut.versaoN;
    // this.solicitacaoService.versao = aut.versaoN;
  }

  ngOnInit() {
    // this.solicitacaoService.definirCampo();
    this.montaColunas();

    if (sessionStorage.getItem('solic-selectedColumns')) {
      this.sds.selectedColumns = JSON.parse(sessionStorage.getItem('solic-selectedColumns'));
      sessionStorage.removeItem('solic-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.sds.itemsAcao = [
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
      this.sbs.getState();
    } else {
      this.sbs.busca.todos = false;
    }

    this.sub.push(this.sbs.busca$.subscribe(
      () => {
        this.sbs.busca.todos = false;
        this.dtb.reset();
        this.dtb.selectionKeys = [];
        this.ss.selecionados = [];
      }
    ));
  }

  montaColunas() {
    this.sds.cols = [
      {field: 'solicitacao_id', header: 'ID', sortable: 'true', largura: '80px'},
      {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '230px'},
      {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
      {field: 'solicitacao_cadastro_tipo_nome', header: 'TIPO SOLICITANTE', sortable: 'true', largura: '200px'},
    ];
    if (this.aut.cadastro_listar) {
      this.sds.cols.push(
        {field: 'cadastro_endereco', header: 'ENDEREÇO', sortable: 'false', largura: '300px'},
        {field: 'cadastro_endereco_numero', header: 'END.Nº', sortable: 'false', largura: '20px'},
        {field: 'cadastro_endereco_complemento', header: 'END.COMPL.', sortable: 'false', largura: '20px'},
      );
    }
    this.sds.cols.push(
      {field: 'cadastro_bairro', header: 'BAIRRO', sortable: 'true', largura: '100px'},
      {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', largura: '300px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
      {field: 'cadastro_estado_nome', header: 'UF', sortable: 'true', largura: '20px'},
    );
    if (this.aut.cadastro_listar) {
      this.sds.cols.push(
        {field: 'cadastro_email', header: 'E-MAIL1', sortable: 'false', largura: '200px'},
        {field: 'cadastro_email2', header: 'E-MAIL2', sortable: 'false', largura: '200px'},
        {field: 'cadastro_telefone', header: 'TELEFONE1', sortable: 'false', largura: '80px'},
        {field: 'cadastro_telefone2', header: 'TELEFONE2', sortable: 'false', largura: '80px'},
        {field: 'cadastro_celular', header: 'CELULAR1', sortable: 'false', largura: '80px'},
        {field: 'cadastro_celular2', header: 'CELULAR2', sortable: 'false', largura: '80px'},
        {field: 'cadastro_telcom', header: 'TEL.COM.', sortable: 'false', largura: '80px'},
        {field: 'cadastro_fax', header: 'FAX', sortable: 'false', largura: '80px'},
      );
    }
    this.sds.cols.push(
      {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '230px'},
      {field: 'solicitacao_orgao', header: 'ORGÃO SOLIC.', sortable: 'false', largura: '300px'},
      {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
      {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
      {field: 'solicitacao_numero_oficio', header: 'Nº OFÍCIO', sortable: 'false', largura: '80px'}
    );

    if (this.versao === 1) {
      this.sds.cols.push(
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'false', largura: '80px'},
        {field: 'processo_status', header: 'SIT. PROCESSO', sortable: 'true', largura: '80px'},
        {field: 'solicitacao_indicacao_sn', header: 'INDICADO S/N', sortable: 'true', largura: '120px'},
      );
    }
    this.sds.cols.push(
      {field: 'solicitacao_indicacao_nome', header: 'INDICAÇÃO', sortable: 'true', largura: '250px'},

    );
    if (this.versao < 3) {
      this.sds.cols.push(
        {field: 'solicitacao_reponsavel_analize_nome', header: 'RESPONSÁVEL', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '200px'}
      );
    }
    this.sds.cols.push(
      {field: 'solicitacao_data_atendimento', header: 'DT ATENDIMENTO', sortable: 'true', largura: '230px'},
      {field: 'solicitacao_atendente_cadastro_nome', header: 'ATENDENTE', sortable: 'true', largura: '200px'}
    );
    if (this.versao === 1) {
      this.sds.cols.push(
        {field: 'solicitacao_cadastrante_cadastro_nome', header: 'CADASTRANTE', sortable: 'true', largura: '200px'},
        {field: 'solicitacao_tipo_recebimento_nome', header: 'TP. RECEBIMENTO', sortable: 'true', largura: '150px'}
      );
    }
    this.sds.cols.push(
      {field: 'solicitacao_descricao', header: 'DESCRIÇÃO', sortable: 'false', largura: '400px'},
      {field: 'solicitacao_aceita_recusada', header: 'OBSERVAÇÕES', sortable: 'false', largura: '400px'}
    );
    if (this.versao === 1) {
      this.sds.cols.push(
        {field: 'solicitacao_carta', header: 'RESPOSTA', sortable: 'true', largura: '400px'}
      );
    }
    this.sds.definirCampo();
  }

  montaNenuContexto() {
    this.sds.contextoMenu = [
      {label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {this.solicitacaoDetalheCompleto(this.ss.Contexto); }}];

    if (this.aut.usuario_responsavel_sn) {
      this.authAnalisar = true;
      this.sds.contextoMenu.push(
        {label: 'ANALISAR', icon: 'pi pi-exclamation-circle', style: {'font-size': '1em'},
          command: () => { this.solicitacaoAnalisar(this.ss.Contexto); }});
    }

    if (this.aut.solicitacao_incluir) {
      this.authIncluir = true;
      this.sds.contextoMenu.push(
        {label: 'INCLUIR', icon: 'pi pi-plus', style: {'font-size': '1em'},
          command: () => { this.solicitacaoIncluir(); }});
    }

    if (this.aut.solicitacao_alterar) {
      this.authAlterar = true;
      this.sds.contextoMenu.push(
        {label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => { this.solicitacaoAlterar(this.ss.Contexto); }});
    }

    if (this.aut.solicitacao_apagar) {
      this.authApagar = true;
      this.sds.contextoMenu.push(
        {label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => { this.solicitacaoApagar(this.ss.Contexto); }});
    }
  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.sbs.busca.sortcampo !== event.sortField?.toString ()) {
        this.sbs.busca.sortcampo = event.sortField?.toString ();
      }
    }
    if (this.sbs.busca.inicio !== event.first.toString()) {
      this.sbs.busca.inicio = event.first.toString();
    }
    if (this.sbs.busca.numlinhas !== event.rows.toString()) {
      this.sbs.busca.numlinhas = event.rows.toString();
      this.sds.rows = event.rows;
    }
    if (this.sbs.busca.sortorder !== event.sortOrder.toString()) {
      this.sbs.busca.sortorder = event.sortOrder.toString();
    }
    /*if (this.solicitacaoService.buscaStateSN) {

    }*/
    if (this.sbs.buscaStateSN) {
      // this.postSolicitacaoBusca();
      this.sbs.getState();
    }
    if (!this.sbs.buscaStateSN) {
      // this.postSolicitacaoBusca();
      this.ss.solicitacaoBusca();
    }
  }


  onChangeSeletorColunas(changes): void {
    this.dtb.saveState();
    this.ss.camposSelecionados = null;
    this.ss.camposSelecionados = changes.value.map(
      function (val) { return { field: val.field, header: val.header }; });
  }

  mostraSelectColunas(): void {
    this.sds.selectedColumnsOld = this.sds.selectedColumns;
    this.sds.mostraSeletor = true;
  }

  hideSeletor(ev): void {
    this.sds.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.ss.Contexto = event.data;
  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mostraLoader(vf: boolean) {
    this.loading = vf;
  }

  resetSelectedColumns(): void {
    this.sds.selectedColumns = [
        {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_data', header: 'DATA', sortable: 'true', largura: '230px'},
        {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', largura: '300px'},
      ];
    if (this.versao === 1) {
      this.sds.selectedColumns.push(
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'false', largura: '80px'},
        {field: 'processo_status', header: 'SIT. PROCESSO', sortable: 'true', largura: '80px'}
      );
    }
    this.sds.selectedColumns.push(
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '300px'},
        {field: 'solicitacao_orgao', header: 'ORGÃO SOLIC.', sortable: 'false', largura: '300px'}
    );
  }

  mapeiaColunasSelecionadas(): void {
    this.ss.camposSelecionados = [];
    this.ss.camposSelecionados.push({field: 'solicitacao_id', header: 'ID'});
    this.sds.selectedColumns.forEach( (c) => {
      this.ss.camposSelecionados.push({field: c.field, header: c.header});
    });
  }

  achaValor(sol: SolicListarI): number {
    return this.ss.solicitacoes.indexOf(sol);
  }

  // FUNCOES DE BUSCA ==========================================================


  /*postSolicitacaoBusca(): void {
    this.sbs.busca['campos'] = this.sds.camposSelecionados;
    // this.cs.mostraCarregador();
    this.sub.push(this.solicitacaoService.postSolicitacaoBusca(this.sbs.busca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.sds.solicitacoes = dados.solicitacao;
          this.sds.total = dados.total;
          this.sds.totalRecords = this.sds.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.sbs.busca.todos = this.sds.tmp;
          this.sds.currentPage = (
              parseInt(this.sbs.busca.inicio, 10) +
              parseInt(this.sbs.busca.numlinhas, 10)) /
            parseInt(this.sbs.busca.numlinhas, 10);
          this.sds.numerodePaginas = Math.ceil(this.sds.totalRecords / this.sds.rows);
          // this.cs.escondeCarregador();
        }
      })
    );
  }*/

  getState(): void {
    this.sbs.criarBusca();
    this.sbs.busca = JSON.parse(sessionStorage.getItem('datatable-busca'));
    if (this.sbs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: SolicPaginacaoInterface }) => {
          this.ss.solicitacoes = data.dados.solicitacao;
          this.sds.total = data.dados.total;
          this.sds.totalRecords = this.sds.total.num;
          this.sbs.busca.todos = this.sds.tmp;
          this.sds.currentPage = (
              parseInt(this.sbs.busca.inicio, 10) +
              parseInt(this.sbs.busca.numlinhas, 10)) /
            parseInt(this.sbs.busca.numlinhas, 10);
          this.sds.numerodePaginas = Math.ceil(this.sds.totalRecords / this.sds.rows);
          this.sbs.buscaStateSN = false;
          sessionStorage.removeItem('datatable-busca');
          // this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  solicitacaoIncluir(): void {
    if (this.aut.solicitacao_incluir) {
      this.sfs.acao = 'incluir';
      // this.cs.mostraCarregador();
      this.dtb.saveState();
      if (this.sds.expandidoDados) {
        this.sds.gravaColunaExpandida(this.sds.expandidoDados);
      }
      sessionStorage.setItem('datatable-busca', JSON.stringify(this.sbs.busca));
      sessionStorage.setItem('solic-selectedColumns', JSON.stringify(this.sds.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.router.navigate(['/solic/form']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  solicitacaoDetalheCompleto(sol: SolicListarI){
    console.log('solicitacaoDetalheCompleto', sol);
    this.showDetalhe = true;
    this.solDetalhe = sol;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.solDetalhe = null;
  }

  solicitacaoAlterar(sol: SolicListarI) {
    if (this.aut.solicitacao_alterar) {
      console.log('solicitacaoAlterar', sol);
      this.sfs.acao = 'alterar';
      this.sfs.solicListar = sol;
      this.sfs.parseListagemForm(sol);
      this.router.navigate(['/solic/form']);
    } else {
      console.log('SEM PERMISSAO');
    }

  }
  /*solicitacaoAlterar(sol: SolicListarI) {
    if (this.aut.solicitacao_alterar) {
      this.dtb.saveState();
      if (this.solicitacaoService.expandidoDados) {
        this.solicitacaoService.gravaColunaExpandida(this.solicitacaoService.expandidoDados);
      }
      sessionStorage.setItem('datatable-busca', JSON.stringify(this.sbs.busca));
      sessionStorage.setItem('solicitacao-selectedColumns', JSON.stringify(this.sds.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.router.navigate(['/solicitacao/alterar', sol.solicitacao_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }*/


  solicitacaoApagar(sol: SolicListarI) {}
  /*solicitacaoApagar(sol: SolicListarI) {
    let soldel: SolicitacaoExcluirInterface;
    if (this.aut.solicitacao_apagar) {
      // this.cs.mostraCarregador();
      this.dtb.saveState();
      if (this.solicitacaoService.expandidoDados) {
        this.solicitacaoService.gravaColunaExpandida(this.solicitacaoService.expandidoDados);
      }
      sessionStorage.setItem('datatable-busca', JSON.stringify(this.sbs.busca));
      sessionStorage.setItem('solicitacao-selectedColumns', JSON.stringify(this.sds.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.sub.push(this.solicitacaoService.getSolicitacaoExcluir(sol.solicitacao_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.solicitacaoService.solicitacaoExluirDados = dados;
          },
          error: (err) => {
            // this.cs.escondeCarregador();
            console.error('erro', err.toString ());
          },
          complete: () => {
            // this.cs.escondeCarregador();
            this.router.navigate(['/solicitacao/apagar']);
          }
        }));

    } else {
      console.log('SEM PERMISSAO');
    }
  }*/


  solicitacaoAnalisar(sol: SolicListarI) {}
  /*solicitacaoAnalisar(sol: SolicListarI) {
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
      // this.cs.mostraCarregador();
      this.dtb.saveState();
      if (this.solicitacaoService.expandidoDados) {
        this.solicitacaoService.gravaColunaExpandida(this.solicitacaoService.expandidoDados);
      }
      sessionStorage.setItem('datatable-busca', JSON.stringify(this.sbs.busca));
      sessionStorage.setItem('solicitacao-selectedColumns', JSON.stringify(this.sds.selectedColumns));
      this.sbs.buscaStateSN = true;
      this.router.navigate(['/solicitacao/analisar', sol.solicitacao_id]);
    }

  }*/

  historicoSolicitacao(sol: SolicListarI) {
    this.solHistForm = sol;
    this.showHistoricoForm = true;
  }

  onHistoricoIncluido(novosDados: any) {
    this.showHistoricoForm = false;
    this.solHistForm = null;
  }

  escondeHistoricoForm() {
    this.showHistoricoForm = false;
    this.solHistForm = null;
  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {

  }
  /*mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.sbs.busca.todos;
    this.sbs.busca.todos = td;
    if (this.sbs.busca.todos === true) {
      // let solPdf: SolicitacaoInterface[];
      let solPdf: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalPdf: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.busca['campos'] = this.camposSelecionados;
      // this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca(this.sbs.busca)
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
            TabelaPdfService.autoTabela('solicitacoes', this.camposSelecionados, solPdf);
            this.sbs.busca.todos = this.tmp;
            // this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('solicitacoes', this.camposSelecionados, this.selecionados);
      this.sbs.busca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('solicitacoes', this.camposSelecionados, this.solicitacoes);
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
      this.sbs.busca['campos'] = this.camposSelecionados;
      // this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca(this.sbs.busca)
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
            PrintJSService.imprimirTabela(this.camposSelecionados, solprint);
            this.sbs.busca.todos = this.tmp;
            // this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.sbs.busca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.solicitacoes);
    this.sbs.busca.todos = this.tmp;
    return true;
  }*/

  exportToCsv(td: boolean = false){}
  /*exportToCsv(td: boolean = false) {

  }*/

  /*exportToCsv(td: boolean = false) {
    this.tmp = this.sbs.busca.todos;
    this.sbs.busca.todos = td;
    if (this.sbs.busca.todos === true) {
      // let solcsv: SolicitacaoInterface[];
      let solcsv: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalprint: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.busca['campos'] = this.camposSelecionados;
      // this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca (this.sbs.busca)
        .subscribe ({
          next: (dados) => {
            solcsv = dados.solicitacao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            // this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv ('solicitacao', this.camposSelecionados, solcsv);
            this.sbs.busca.todos = this.tmp;
            // this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv ('solicitacao', this.camposSelecionados, this.selecionados);
      this.sbs.busca.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv ('solicitacao', this.camposSelecionados, this.solicitacoes);
    this.sbs.busca.todos = this.tmp;
    return true;
  }*/

  exportToXLSX(td: boolean = false) {

  }
  /*exportToXLSX(td: boolean = false) {
    this.tmp = this.sbs.busca.todos;
    this.sbs.busca.todos = td;
    if (this.sbs.busca.todos === true) {
      // let solcsv: SolicitacaoInterface[];
      let solcsv: SolicitacaoListar12Interface[] | SolicitacaoListar345Interface[];
      let totalprint: SolicitacaoTotalInterface;
      let numTotalRegs: number;
      this.sbs.busca['campos'] = this.selectedColumns;
      // this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.postSolicitacaoBusca (this.sbs.busca)
        .subscribe ({
          next: (dados) => {
            solcsv = dados.solicitacao;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error ('ERRO-->', err);
            // this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile ('solicitacao', solcsv, this.solicitacaoService.getArrayTitulo());
            this.sbs.busca.todos = this.tmp;
            // this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile ('solicitacao', this.exportToXLSXSimples(this.selecionados), this.solicitacaoService.getArrayTitulo());
      this.sbs.busca.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile ('solicitacao', this.solicitacoes,  this.solicitacaoService.getArrayTitulo());
    this.sbs.busca.todos = this.tmp;
    return true;
  }*/

  exportToXLSXSimples(dados: SolicListarI[]){}
  /*exportToXLSXSimples(dados: SolicitacaoListar12Interface[]): SolicitacaoExcel12[] {
    const sl: SolicitacaoExcel12[] = [];
    const r: SolicitacaoInterfaceExcel[] = [];
    dados.forEach( ( x: SolicitacaoListar12Interface ) => {
      const c: SolicitacaoExcel12 = (x as any) as SolicitacaoExcel12;
      sl.push(c);
    });
    // sl = (dados as  unknown[]) as SolicitacaoInterfaceExcel[];
    /!*sl.unshift =  {
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
    } ;*!/
    return sl;
  }*/

  /*constroiExtendida() {
    const v = this.solicitacaoService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.sds.dadosExpandidos = this.solicitacaoService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.sds.expColunas = dados.pop();
            this.sds.dadosExp = dados;
          }
        )
      );
      this.solicitacaoService.montaColunaExpandida(v);
    }
  }*/

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
