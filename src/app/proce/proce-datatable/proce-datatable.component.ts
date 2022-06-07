import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Editor} from "primeng/editor";
import {
  ProcessoArray,
  ProcessoBuscaCampoInterface,
  ProcessoDetalheInterface,
  ProcessoListagemInterface, ProcessoPaginacaoInterface,
  ProcessoTotalInterface
} from "../../processo/_models";
import {WindowsService} from "../../_layout/_service";
import {Subscription} from "rxjs";
import {LazyLoadEvent, MenuItem, MessageService} from "primeng/api";
import {
  AuthenticationService,
  CarregadorService, CsvService, ExcelService,
  MenuInternoService,
  PrintJSService,
  TabelaPdfService
} from "../../_services";
import {DialogService} from "primeng/dynamicdialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ProcessoBuscaService, ProcessoService} from "../../processo/_services";
import {take} from "rxjs/operators";
import {Config} from "quill-to-word";
import * as quillToWord from "quill-to-word";
import {saveAs} from "file-saver";
import {ProceListarI} from "../_model/proc-i";
import {ProceService} from "../_services/proce.service";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {ProceFormService} from "../_services/proce-form.service";
import {SolicListarI} from "../../solic/_models/solic-listar-i";
import {HistFormI, HistListI} from "../../hist/_models/hist-i";

@Component({
  selector: 'app-proce-datatable',
  templateUrl: './proce-datatable.component.html',
  styleUrls: ['./proce-datatable.component.css']
})
export class ProceDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', { static: true }) public dtb: any;
  @ViewChild('edtor', { static: true }) public edtor: Editor;
/*  loading = false;
  cols: any[];
  currentPage = 1;
  processo: ProceListarI[];
  prContexto: ProceListarI;
  total: ProcessoTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: ProceListarI[] = [];
  sortCampo = 'processo_status_nome';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: ProcessoBuscaCampoInterface[];
  altura = `${WindowsService.altura - 150}` + 'px'; // 171.41 = 10.71rem = 10.71 * 16px
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
  proDetalhe: ProcessoDetalheInterface = null;*/

  loading = false;
  altura = `${WindowsService.altura - 150}` + 'px'; // 171.41 = 10.71rem = 10.71 * 16px
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  authAlterar = false;
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;
  solicitacaoVersao: number;
  campoTexto: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;
  showDetalhe = false;
  solDetalhe?: ProceListarI;
  showHistoricoForm = false;
  solHistForm: any;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  contextoMenu2: MenuItem[];
  contextoMenu3: MenuItem[];
  colteste: string[];
  mostraSeletor = false;
  cols: any[] = [];
  proceDetalhe?: any;

  showHistorico = false;
  showHistorico2 = false;
  histListI: HistListI | null = null;
  proHistForm: ProceListarI | null;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    public md: MenuDatatableService,
    // public dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public ps: ProceService,
    public pfs: ProceFormService,
    // private pbs: ProcessoBuscaService,
  ) { }

  ngOnInit() {
    this.montaColunas();
    if(!this.ps.stateSN) {
      this.resetSelectedColumns();
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

    this.montaMenuContexto();

    this.sub.push(this.ps.busca$.subscribe(
      () => {
        if (this.ps.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.ps.busca.todos = false;
        this.dtb.reset();
      }
    ));
  }

  montaColunas() {
    this.cols = [
      {field: 'processo_id', header: 'ID', sortable: 'true', width: '60px'},
      {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', width: '150px'},
      {field: 'processo_status_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},

      {field: 'cadastro_tipo_nome', header: 'TP. SOLICITANTE', sortable: 'true', width: '150px'},
      {field: 'cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '400px'},
      {field: 'cadastro_endereco', header: 'ENDEREÇO', sortable: 'true', width: '300px'},
      {field: 'cadastro_endereco_numero', header: 'END. NÚMERO', sortable: 'true', width: '170px'},
      {field: 'cadastro_endereco_complemento', header: 'END. COMPLEMENTO', sortable: 'true', width: '170px'},
      {field: 'cadastro_bairro', header: 'BAIRRO', sortable: 'true', width: '300px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '300px'},
      {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', width: '300px'},
      {field: 'cadastro_cep', header: 'CEP', sortable: 'true', width: '100px'},
      {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', width: '100px'},
      {field: 'cadastro_telefone', header: 'TELEFONE1', sortable: 'true', width: '150px'},
      {field: 'cadastro_telefone2', header: 'TELEFONE2', sortable: 'true', width: '150px'},
      {field: 'cadastro_telcom', header: 'TELEFONE3', sortable: 'true', width: '150px'},
      {field: 'cadastro_celular', header: 'CELULAR1', sortable: 'true', width: '150px'},
      {field: 'cadastro_celular2', header: 'CELULAR2', sortable: 'true', width: '150px'},
      {field: 'cadastro_fax', header: 'FAX', sortable: 'true', width: '150px'},
      {field: 'cadastro_email', header: 'E-MAIL1', sortable: 'true', width: '200px'},
      {field: 'cadastro_email2', header: 'E-MAIL2', sortable: 'true', width: '200px'},
      {field: 'cadastro_rede_social', header: 'FACEBOOK', sortable: 'true', width: '200px'},
      {field: 'cadastro_outras_midias', header: 'OUTRAS MÍDIAS', sortable: 'true', width: '200px'},
      {field: 'cadastro_data_nascimento', header: 'DT. NASC./FUNDAÇÃO', sortable: 'true', width: '200px'},

      {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', width: '100px'},
      {field: 'solicitacao_data', header: 'DATA', sortable: 'true', width: '200px'},
      {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '400px'},
      {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', width: '400px'},
      {field: 'solicitacao_indicacao_sn', header: 'INDICAÇÃO S/N', sortable: 'true', width: '150px'},
      {field: 'solicitacao_indicacao_nome', header: 'INDICAÇÃO', sortable: 'true', width: '300px'},
      {field: 'solicitacao_orgao', header: 'ORGÃO SOLICITADO', sortable: 'true', width: '300px'},
      {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', width: '250px'},
      {field: 'solicitacao_tipo_recebimento_nome', header: 'TP. RECEBIMENTO', sortable: 'true', width: '200px'},
      {field: 'solicitacao_descricao', header: 'DESCRIÇÃO', sortable: 'true', width: '400px'},
      {field: 'solicitacao_aceita_recusada', header: 'OBSERVAÇÕES', sortable: 'true', width: '400px'},

      {field: 'oficio_codigo', header: 'OF. CÓDIGO', sortable: 'true', width: '150px'},
      {field: 'oficio_numero', header: 'OF. Nº', sortable: 'true', width: '100px'},
      {field: 'oficio_prioridade_nome', header: 'OF. PRIORIDADE', sortable: 'true', width: '150px'},
      {field: 'oficio_convenio', header: 'OF. TP. CONVÊNIO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_emissao', header: 'OF. DT. EMISSÃO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_recebimento', header: 'OF. DT. RECEBIMENTO', sortable: 'true', width: '200px'},
      {field: 'oficio_orgao_solicitado_nome', header: 'OF. ORG. SOLICITADO', sortable: 'true', width: '300px'},
      {field: 'oficio_descricao_acao', header: 'OF. DESC. AÇÃO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_protocolo', header: 'OF. DT. PROTOCOLO', sortable: 'true', width: '200px'},
      {field: 'oficio_protocolo_numero', header: 'OF. Nº PROTOCOLO', sortable: 'true', width: '300px'},
      {field: 'oficio_orgao_protocolante_nome', header: 'OF. ORG. PROTOCOLANTE', sortable: 'true', width: '300px'},
      {field: 'oficio_protocolante_funcionario', header: 'OF. ORG. PROT. FUNCIONÁRIO', sortable: 'true', width: '300px'},
      {field: 'oficio_prazo', header: 'OF. PRAZO', sortable: 'true', width: '200px'},
      {field: 'oficio_tipo_andamento_nome', header: 'OF. TIPO ANDAMENTO', sortable: 'true', width: '200px'},
      {field: 'oficio_status_nome', header: 'OF. SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'oficio_valor_solicitado', header: 'OF. VL. SOLICITADO', sortable: 'true', width: '200px'},
      {field: 'oficio_valor_recebido', header: 'OF. VL. RECEBIDO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_pagamento', header: 'OF. DT. PAGAMENTO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_empenho', header: 'OF. DT. EMPENHO', sortable: 'true', width: '200px'},

      {field: 'oficio', header: 'OFÍCIOS', sortable: 'false', width: '3000px'},

      {field: 'historico_data', header: 'HIST. DT.', sortable: 'true', width: '200px'},
      {field: 'historico_andamento', header: 'HIST. ANDAMENTO', sortable: 'true', width: '400px'},

      {field: 'historico', header: 'HISTÓRICOS', sortable: 'false', width: '1000px'}

    ];
  }

  resetSelectedColumns(): void {
    this.ps.criaTabela();
    this.ps.tabela.selectedColumns = [
        {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', width: '150px'},
        {field: 'processo_status_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
        {field: 'solicitacao_posicao', header: 'POSIÇÃO', sortable: 'true', width: '100px'},
        {field: 'cadastro_tipo_nome', header: 'TP. SOLICITANTE', sortable: 'true', width: '150px'},
        {field: 'cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '400px'},
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '300px'},
        {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', width: '300px'},
        {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', width: '100px'},
        {field: 'solicitacao_data', header: 'DATA', sortable: 'true', width: '200px'},
        {field: 'solicitacao_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '400px'},
        {field: 'solicitacao_orgao', header: 'ORGÃO SOLICITADO', sortable: 'true', width: '300px'},
        {field: 'solicitacao_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', width: '400px'}
      ];
  }

  montaMenuContexto() {
    this.contextoMenu = [
      {label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {this.proceDetalheCompleto(this.ps.Contexto); }}];

    if (this.aut.usuario_responsavel_sn
      && (this.aut.processo_indeferir
        || this.aut.processo_deferir)) {
      this.authAnalisar = true;
      this.contextoMenu.push(
        {label: 'ANALISAR', icon: 'pi pi-exclamation-circle', style: {'font-size': '1em'},
          command: () => { this.processoAnalisar(this.ps.Contexto); }});
    }

    if (this.aut.processo_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => { this.processoApagar(this.ps.Contexto); }});
    }

    this.contextoMenu2 = [
      {label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {this.proceDetalheCompleto(this.ps.Contexto); }}];

    if (this.aut.processo_apagar) {
      this.authApagar = true;
      this.contextoMenu2.push(
        {label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => { this.processoApagar(this.ps.Contexto); }});
    }

    this.contextoMenu3 = this.contextoMenu;
  }

  // EVENTOS ===================================================================

  // ngOnChanges() { }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.ps.busca.sortField !== event.sortField?.toString ()) {
        this.ps.busca.sortField = event.sortField?.toString ();
      }
    }
    if (this.ps.busca.first !== event.first) {
      this.ps.busca.first = event.first;
    }
    if (event.rows !== undefined && this.ps.busca.rows !== event.rows) {
      this.ps.busca.rows = event.rows;
    }
    if (this.ps.busca.sortOrder !== event.sortOrder) {
      this.ps.busca.sortOrder = event.sortOrder;
    }
    this.ps.proceBusca();
  }

  onStateSave(ev) {
    this.ps.setState()
  }

  mostraSelectColunas(): void {
    this.ps.tabela.mostraSeletor = true;
  }

  hideSeletor(ev): void {
    this.mostraSeletor = false;
  }

  processoDetalheCompleto(pro){}

  historicoProcesso(pro: ProceListarI) {
    this.histListI =  {
      modulo: 'processo',
      hist: pro.historico_processo
    }
    // this.histListI.hist = pro.historico_processo;
    console.log('historicoProcesso',this.histListI);
    // this.buscaIdx(sol.solicitacao_id);
    this.proHistForm = pro;
    this.showHistorico = true;
    //this.showHistorico2 = true;
  }

  escondeHistoricoListar(histListI) {
    console.log(histListI);
  }

  /*onRowExpand(event): void {
    this.sub.push(this.dadosExpandidos = this.ps.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.ps.montaColunaExpandida(event.data);
  }*/

  /*onChangeSeletorColunas(changes): void {
    this.dtb.saveState();
    this.camposSelecionados = null;
    this.camposSelecionados = changes.value.map(
      function (val) { return { field: val.field, header: val.header }; });
  }*/

  /*hideSeletor(ev): void {
    if (this.selectedColumnsOld !== this.selectedColumns) {
      this.postProcessoBusca();
    }
    this.selectedColumnsOld = [];
  }*/

  /*onContextMenuSelect(event) {
    this.ps.Contexto = event.data;
    if (event.data.processo_status_nome.toString() !== 'EM ANDAMENTO') {
      this.contextoMenu3 = this.contextoMenu2;
    } else {
      this.contextoMenu3 = this.contextoMenu;
    }
  }*/

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mostraLoader(vf: boolean) {
    this.loading = vf;
  }

  mapeiaColunas() {
    let cp: string[] = [];
    const n = this.cols.length;
    let ct = 1
    this.cols.forEach(c => {
      if (c.field !== 'processo_id') {
        cp.push(c.field);
      }
      ct++;
      if (ct === n) {
        this.ps.montaTitulos(cp);
      }
    });
  }

  achaValor(pro: ProceListarI): number {
    return this.ps.processos.indexOf(pro);
  }



  // FUNCOES DE BUSCA ==========================================================



  // FUNCOES DE CRUD ===========================================================


  proceDetalheCompleto(pro: ProceListarI) {
    this.proceDetalhe = this.ps.parceDetalhe(pro);
    this.showDetalhe = true;
    /*this.sub.push(this.ps.getProceDetalhe(pr.processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.proceDetalhe = dados;
        },
        error: (err) => {
          console.log ('erro', err.toString ());
        },
        complete: () => {
          this.showDetalhe = true;
        }
      }));*/
  }


  processoApagar(pr: ProcessoListagemInterface) {
    /*if (this.aut.processo_apagar) {
      this.cs.mostraCarregador();
      this.dtb.saveState();
      sessionStorage.setItem('processo-busca', JSON.stringify(this.pbs.processoBusca));
      sessionStorage.setItem('processo-selectedColumns', JSON.stringify(this.selectedColumns));
      this.pbs.buscaStateSN = true;
      this.router.navigate(['/processo/excluir', pr.processo_id]);
    } else {
      console.log('SEM PERMISSAO');
    }*/
  }

  processoAnalisar(pr: ProcessoListagemInterface) {
    /*if (pr.processo_status_nome !== 'EM ANDAMENTO') {
      this.messageService.add(
        {
          key: 'processoToast',
          severity: 'warn',
          summary: 'ANALIISE',
          detail: pr.processo_status_nome.toString()}
      );
    }
    if (this.aut.usuario_responsavel_sn
      && (this.aut.processo_deferir
        || this.aut.processo_indeferir)
      && pr.processo_status_nome === 'EM ANDAMENTO') {
      // let proDetalhe: ProcessoDetalheInterface;
      this.cs.mostraCarregador();
      this.dtb.saveState();
      sessionStorage.setItem('processo-busca', JSON.stringify(this.pbs.processoBusca));
      sessionStorage.setItem('processo-selectedColumns', JSON.stringify(this.selectedColumns));
      this.pbs.buscaStateSN = true;
      this.router.navigate(['/processo/analisar', pr.processo_id]);
    }*/

  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    /*this.tmp = this.ps.busca.todos;
    this.pbs.busca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prPdf: ProcessoListagemInterface[];
      let totalPdf: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.ps.postProcessoBusca(this.pbs.processoBusca)
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
    this.pbs.processoBusca.todos = this.tmp;*/
    return true;
  }

  imprimirTabela(td: boolean = false) {
    /*this.tmp = this.pbs.processoBusca.todos;
    this.pbs.processoBusca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prprint: ProcessoListagemInterface[];
      let totalprint: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.ps.postProcessoBusca(this.pbs.processoBusca)
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
    this.pbs.processoBusca.todos = this.tmp;*/
    return true;
  }

  exportToCsv(td: boolean = false) {
    /*this.tmp = this.pbs.processoBusca.todos;
    this.pbs.processoBusca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prcsv: ProcessoListagemInterface[];
      let totalprint: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.ps.postProcessoBusca (this.pbs.processoBusca)
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
    this.pbs.processoBusca.todos = this.tmp;*/
    return true;
  }

  exportToXLSX(td: boolean = false) {
    /*this.tmp = this.pbs.processoBusca.todos;
    this.pbs.processoBusca.todos = td;
    if (this.pbs.processoBusca.todos === true) {
      let prcsv: ProcessoListagemInterface[];
      let totalprint: ProcessoTotalInterface;
      let numTotalRegs: number;
      this.pbs.processoBusca['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.ps.postProcessoBusca (this.pbs.processoBusca)
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
    this.pbs.processoBusca.todos = this.tmp;*/
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
    this.proceDetalhe = null;
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
