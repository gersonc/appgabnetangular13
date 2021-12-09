import { Component, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, SelectItem, MenuItem, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { WindowsService } from '../../_layout/_service';
import { AuthenticationService, CarregadorService } from '../../_services';
import {
  CsvService,
  ExcelService,
  MostraMenuService,
  PrintJSService,
  TabelaPdfService
} from '../../_services';
import {
  ContaArray,
  ContaBuscaCampoInterface,
  ContaInterface,
  ContaPaginacaoInterface,
  ContaTotalInterface
} from '../_models';
import { ContaBuscaService, ContaService } from '../_services';
import { ContaFormularioComponent } from '../conta-formulario/conta-formulario.component';
import { ContaDropdown } from '../_models';
import {Editor} from "primeng/editor";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { applyPlugin, UserOptions } from 'jspdf-autotable';
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
declare var html2canvas: any;
declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component({
  selector: 'app-conta-datatable',
  templateUrl: './conta-datatable.component.html',
  styleUrls: ['./conta-datatable.component.css'],
  providers: [ DialogService ]
})
export class ContaDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtct', { static: true }) public dtct: any;
  @ViewChild('cm', { static: true }) cm: ElementRef;
  @ViewChild('edtor', { static: true }) public edtor: Editor;
  private alturas: number[] = [];
  private larguras: number[] = [];
  private campos: string[] = [];
  loading = false;
  cols: any[];
  currentPage = 1;
  conta: ContaInterface[];
  ctaContexto: ContaInterface;
  total: ContaTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: ContaInterface[] = [];
  sortCampo = 'conta_vencimento';
  // selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: ContaBuscaCampoInterface[];
  altura = `${WindowsService.altura - 150}` + 'px'; // 171.41 = 10.71rem = 10.71 * 16px
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  numColunas = 2;
  expColunas = 0;
  dadosExpandidos: Subscription;
  expandidoDados: any = false;
  dadosExp: any[];
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  tmp: boolean | number = false;
  sub: Subscription[] = [];
  authAlterar = false;
  authApagar = false;
  authIncluir = false;
  resp: any[];
  btnInativo = false;
  mostraSoma = false;
  soma: any = null;
  indexSoma = 0;
  indexAntes = 0;
  indexDepois = 0;
  mostraCtx = false;
  botaoEnviarVF: boolean;
  btnExpandirVF = true;
  coluna: any = null;
  valor: string | number = null;
  ptBr: any;
  editando = false;
  editLinhaOld: ContaInterface;
  editLinhaIdxOld: number;
  id: number = null;
  paga_id: number | boolean = null;
  pagamento: string = null;
  idx: number = null;
  _selectedColumns: any[];

  campoTexto: string = null;
  campoTitulo: string = null;
  showCampoTexto = false;
  deltaquill: any = null;
  showDetalhe = false;

  constructor(
    public mm: MostraMenuService,
    public aut: AuthenticationService,
    public dialogService: DialogService,
    private cf: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private contaService: ContaService,
    private cbs: ContaBuscaService,
    private cs: CarregadorService,
    private cd: ContaDropdown
  ) {
  }

  ngOnInit() {
    this.configuraCalendario();

    this.cols = [
      { field: 'conta_id', header: 'ID', sortable: 'true', largura: '7rem'},
      { field: 'conta_cedente', header: 'CEDENTE', sortable: 'true', largura: '300px'},
      { field: 'conta_vencimento', header: 'DT. VENC.', sortable: 'true', largura: '120px'},
      { field: 'conta_valor', header: 'VALOR', sortable: 'true', largura: '100px'},
      { field: 'conta_paga', header: 'PAGO', sortable: 'true', largura: '100px'},
      { field: 'conta_pagamento', header: 'DT. PGTO.', sortable: 'true', largura: '120px'},
      { field: 'conta_debito_automatico', header: 'DBTO. AUT.', sortable: 'true', largura: '120px'},
      { field: 'conta_tipo', header: 'TIPO', sortable: 'true', largura: '100px'},
      { field: 'conta_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '200px'},
      { field: 'conta_observacao', header: 'OBSERVAÇÃO', sortable: 'false', largura: '500px'}
    ];

    if (sessionStorage.getItem('conta-selectedColumns')) {
      this._selectedColumns = JSON.parse(sessionStorage.getItem('conta-selectedColumns'));
      sessionStorage.removeItem('conta-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [];

    if (this.aut.contabilidade_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {
          label: 'INCLUIR', icon: 'pi pi-plus', style: { 'font-size': '1em' },
          command: () => {
            this.contaIncluir();
          }
        });
    }

    if (this.aut.contabilidade_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: { 'font-size': '1em' },
          command: () => {
            this.contaAlterar(this.ctaContexto);
          }
        });
    }

    if (this.aut.contabilidade_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: { 'font-size': '1em' },
          command: () => {
            this.contaApagar(this.ctaContexto);
          }
        });
    }

    /*this.itemsAcao = [
      {
        label: 'CSV', icon: 'fas fa-lg fa-file-csv', style: { 'font-size': '.9em' }, command: () => {
          this.exportToCsv();
        }
      },
      {
        label: 'CSV - TODOS', icon: 'fas fa-lg fa-file-csv', style: { 'font-size': '.9em' }, command: () => {
          this.exportToCsv(true);
        }
      },
      {
        label: 'PDF', icon: 'fas fa-lg fa-file-pdf', style: { 'font-size': '1em' }, command: () => {
          this.mostraTabelaPdf();
        }
      },
      {
        label: 'PDF - TODOS', icon: 'far fa-lg fa-file-pdf', style: { 'font-size': '.9em' }, command: () => {
          this.mostraTabelaPdf(true);
        }
      },
      {
        label: 'IMPRIMIR', icon: 'fas fa-lg fa-print', style: { 'font-size': '1em' }, command: () => {
          this.imprimirTabela();
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'fas fa-lg fa-print', style: { 'font-size': '.9em' }, command: () => {
          this.imprimirTabela(true);
        }
      },
      {
        label: 'EXCEL', icon: 'fas fa-lg fa-file-excel', style: { 'font-size': '1em' }, command: () => {
          this.exportToXLSX();
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'far fa-lg fa-file-excel', style: { 'font-size': '.9em' }, command: () => {
          this.exportToXLSX(true);
        }
      }
    ];*/

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

    this.constroiExtendida();

    if (this.cbs.buscaStateSN) {
      this.getState();
    } else {
      this.cbs.cb.todos = false;
    }

    this.sub.push(this.cbs.busca$.subscribe(
      () => {
        this.cbs.cb.todos = false;
        this.dtct.reset();
        this.dtct.selectionKeys = [];
        this.selecionados = [];
      }
    ));
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = val;
  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.cbs.cb.sortcampo !== event.sortField.toString()) {
        this.cbs.cb.sortcampo = event.sortField.toString();
      }
    }
    if (this.cbs.cb.inicio !== event.first.toString()) {
      this.cbs.cb.inicio = event.first.toString();
    }
    if (this.cbs.cb.numlinhas !== event.rows.toString()) {
      this.cbs.cb.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.cbs.cb.sortorder !== event.sortOrder.toString()) {
      this.cbs.cb.sortorder = event.sortOrder.toString();
    }
    if (!this.cbs.buscaStateSN) {
      this.postContaBusca();
    }
  }

  onRowExpand(event): void {
    this.contaService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.contaService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.contaService.montaColunaExpandida(this.contaService.expandidoDados);
  }

  resetSelectedColumns(): void {
      this._selectedColumns = [
        /*{ field: 'conta_cedente', header: 'CEDENTE', sortable: 'true', largura: '300px'},
        { field: 'conta_vencimento', header: 'DT. VENC.', sortable: 'true', largura: '120px'},
        { field: 'conta_valor', header: 'VALOR', sortable: 'true', largura: '100px'},
        { field: 'conta_paga', header: 'PAGO', sortable: 'true', largura: '100px'},
        { field: 'conta_pagamento', header: 'DT. PGTO.', sortable: 'true', largura: '120px'},*/
        { field: 'conta_cedente', header: 'CEDENTE', sortable: 'true', largura: '300px'},
        { field: 'conta_vencimento', header: 'DT. VENC.', sortable: 'true', largura: '120px'},
        { field: 'conta_valor', header: 'VALOR', sortable: 'true', largura: '100px'},
        { field: 'conta_paga', header: 'PAGO', sortable: 'true', largura: '100px'},
        { field: 'conta_pagamento', header: 'DT. PGTO.', sortable: 'true', largura: '120px'},
        { field: 'conta_debito_automatico', header: 'DBTO. AUT.', sortable: 'true', largura: '120px'},
        { field: 'conta_tipo', header: 'TIPO', sortable: 'true', largura: '100px'},
        { field: 'conta_observacao', header: 'OBSERVAÇÃO', sortable: 'false', largura: '500px'}
      ];
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({ field: 'conta_id', header: 'ID' });
    this._selectedColumns.forEach((c) => {
      this.camposSelecionados.push({ field: c.field, header: c.header });
    });
  }

  mostraSelectColunas(): void {
    this.dtct.saveState();
    this.selectedColumnsOld = this._selectedColumns;
    this.mostraSeletor = true;
  }

  hideSeletor(ev): void {
    if (this.selectedColumnsOld !== this._selectedColumns) {
      // this.selectedColumns = this.selectedColumnsOld;
      this.mapeiaColunasSelecionadas();
      // this.postContaBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.ctaContexto = event.data;
  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mm.mudaMenu();
  }

  mostraLoader(vf: boolean) {
    this.loading = vf;
  }

  // FUNCOES DE BUSCA ==========================================================

  postContaBusca(): void {
    this.cbs.cb['campos'] = this.camposSelecionados;
    if (!this.cbs.cb.sortcampo) {
      this.cbs.cb.sortcampo = this.sortCampo;
    }
    this.cs.mostraCarregador();
    this.sub.push(this.contaService.postContaBusca(this.cbs.cb)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.conta = dados.conta;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.cbs.cb.todos = this.tmp;
          this.currentPage = (
            parseInt(this.cbs.cb.inicio, 10) +
            parseInt(this.cbs.cb.numlinhas, 10)) /
            parseInt(this.cbs.cb.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
          this.mostraCalculo();
        }
      })
    );
  }

  getState(): void {
    this.cbs.criarContaBusca();
    this.cbs.cb = JSON.parse(sessionStorage.getItem('conta-busca'));
    if (this.cbs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: ContaPaginacaoInterface }) => {
          this.conta = data.dados.conta;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.cbs.cb.todos = this.tmp;
          this.currentPage = (
            parseInt(this.cbs.cb.inicio, 10) +
            parseInt(this.cbs.cb.numlinhas, 10)) /
            parseInt(this.cbs.cb.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cbs.buscaStateSN = false;
          sessionStorage.removeItem('conta-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  contaIncluir() {
    if (this.aut.contabilidade_incluir) {
      const ref2 = this.dialogService.open(ContaFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'tabela'
        },
        header: 'INCLUIR LANÇAMENTO',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });

      this.sub.push(ref2.onClose.subscribe((res?: boolean) => {
        if (res) {
          this.postContaBusca();
        }
      }));
    }
  }

  contaAlterar(cta: ContaInterface) {
    if (this.aut.contabilidade_alterar) {
      const ref = this.dialogService.open(ContaFormularioComponent, {
        data: {
          acao: 'alterar',
          conta: cta,
          origem: 'tabela'
        },
        header: 'ALTERAR LANÇAMENTO',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });

      this.sub.push(ref.onClose.subscribe((res?: ContaInterface) => {
        if (res) {
          const tmp = this.conta.find( i =>
            i.conta_id === res.conta_id
          );
          if (tmp !== undefined) {
            this.conta[this.conta.indexOf(tmp)] = res;
            this.mostraCalculo();
          }
          this.cs.escondeCarregador();
        }
      }));
    }
  }

  contaApagar(ctb: ContaInterface) {
    if (this.aut.contabilidade_apagar) {
      this.btnInativo = true;
      this.cf.confirm({
        message: 'Confirma exclusão?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.cs.mostraCarregador();
          this.contaDelete(ctb);
        },
        reject: () => {
          this.btnInativo = false;
        }
      });
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  contaDelete(ctb: ContaInterface) {
    if (this.aut.contabilidade_apagar) {
      this.contaService.deleteContaId(ctb.conta_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => {
            this.cs.escondeCarregador();
            this.btnInativo = false;
            console.error('Erro->', err);
            this.messageService.add({ key: 'contaToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
          },
          complete: () => {
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.conta.splice(this.conta.indexOf(this.conta.find(i => i.conta_id === ctb.conta_id)), 1);
              this.total.num--;
              this.totalRecords = this.total.num;
              this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
              this.messageService.add({
                key: 'contaToast',
                severity: 'success',
                summary: 'EXCLUIR LANÇAMENTO',
                detail: this.resp[2]
              });
              this.btnInativo = false;
              this.mostraCalculo();
            } else {
              this.cs.escondeCarregador();
              this.btnInativo = false;
              console.error('ERRO - EXCLUIR ', this.resp[2]);
              this.messageService.add({ key: 'contaToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
            }
          }
        });
    }
  }

  setCurrentStyles(col: any, valor: string | number) {
    const tmp = ['conta_vencimento', 'conta_valor', 'conta_pagamento'];
    // CSS styles: set per current state of component properties
    return {
      'text-align': tmp.indexOf(col.field) > -1 ? 'right' : 'left',
      'background-color': col.field === 'conta_paga' && valor === 'NÃO' ? 'var(--atencao)' : 'inherit',
      'width':   col.largura,
      'padding-bottom': 0,
      'padding-top': '.3em'
    };
  }

  onRowEditInit(c: ContaInterface, rowIndex: number) {
    this.btnExpandirVF = false;
    if (this.editando === false) {
      this.id = c.conta_id;
      this.paga_id = c.conta_paga_id;
      this.pagamento = c.conta_pagamento;
      this.idx = rowIndex;
      this.editando = true;
    }
  }

  onRowEditSave(cta: ContaInterface, rowIndex: number) {
    this.btnExpandirVF = true;
    if ((cta.conta_paga_id !== this.paga_id && cta.conta_paga_id !== null) ||
      (cta.conta_pagamento !== this.pagamento) &&
      cta.conta_id === this.id && rowIndex === this.idx) {
      this.cs.mostraCarregador();
      this.sub.push(this.contaService.putContaAlterarDatatable(
        cta.conta_id, cta.conta_paga_id, cta.conta_pagamento)
        .pipe(take(1))
        .subscribe({
          next: (dados: any[]) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botaoEnviarVF = false;
            this.cs.escondeCarregador();
            this.messageService.add({
              key: 'contaToast',
              severity: 'warn',
              summary: 'ERRO ALTERAR',
              detail: this.resp[2]
            });
            console.log(err);
            this.editando = false;
            this.id = null;
            this.paga_id = null;
            this.pagamento = null;
            this.idx = null;
          },
          complete: () => {
            this.editando = false;
            if (this.resp[0]) {
              this.conta[rowIndex] = this.resp[3];
              this.messageService.add({
                key: 'contaToast',
                severity: 'success',
                summary: 'ALTERAR LANÇAMENTO',
                detail: this.resp[2]
              });
              this.botaoEnviarVF = false;
              this.cs.escondeCarregador();
            } else {
              this.botaoEnviarVF = false;
              this.cs.escondeCarregador();
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.messageService.add({
                key: 'contaToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
            this.id = null;
            this.paga_id = null;
            this.pagamento = null;
            this.idx = null;
          }
        })
      );
    }
  }

  onRowEditCancel(cta, rowIndex) {
    this.btnExpandirVF = true;
    this.editando = false;
    this.id = null;
    this.paga_id = null;
    this.pagamento = null;
    this.idx = null;
  }

  configuraCalendario() {
    this.ptBr = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'septembro',
        'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Wk'
    };
  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.cbs.cb.todos;
    this.cbs.cb.todos = td;
    if (this.cbs.cb.todos === true) {
      let ctb: ContaInterface[];
      let totalPdf: ContaTotalInterface;
      let numTotalRegs: number;
      this.cbs.cb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.contaService.postContaBusca(this.cbs.cb)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ctb = dados.conta;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('conta', this.camposSelecionados, ctb);
            this.cbs.cb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('conta', this.camposSelecionados, this.selecionados);
      this.cbs.cb.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('conta', this.camposSelecionados, this.conta);
    this.cbs.cb.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.cbs.cb.todos;
    this.cbs.cb.todos = td;
    if (this.cbs.cb.todos === true) {
      let ofprint: ContaInterface[];
      let totalprint: ContaTotalInterface;
      let numTotalRegs: number;
      this.cbs.cb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.contaService.postContaBusca(this.cbs.cb)
        .subscribe({
          next: (dados) => {
            ofprint = dados.conta;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, ofprint);
            this.cbs.cb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.cbs.cb.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.conta);
    this.cbs.cb.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.cbs.cb.todos;
    this.cbs.cb.todos = td;
    if (this.cbs.cb.todos === true) {
      let ofcsv: ContaInterface[];
      let totalprint: ContaTotalInterface;
      let numTotalRegs: number;
      this.cbs.cb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.contaService.postContaBusca(this.cbs.cb)
        .subscribe({
          next: (dados) => {
            ofcsv = dados.conta;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv('conta', this.camposSelecionados, ofcsv);
            this.cbs.cb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv('conta', this.camposSelecionados, this.selecionados);
      this.cbs.cb.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv('conta', this.camposSelecionados, this.conta);
    this.cbs.cb.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.cbs.cb.todos;
    this.cbs.cb.todos = td;
    if (this.cbs.cb.todos === true) {
      let ofcsv: ContaInterface[];
      let totalprint: ContaTotalInterface;
      let numTotalRegs: number;
      this.cbs.cb['campos'] = this._selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.contaService.postContaBusca(this.cbs.cb)
        .subscribe({
          next: (dados) => {
            ofcsv = dados.conta;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile('conta', ofcsv, ContaArray.getArrayTitulo());
            this.cbs.cb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile('conta', this.selecionados, ContaArray.getArrayTitulo());
      this.cbs.cb.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile('conta', this.conta, ContaArray.getArrayTitulo());
    this.cbs.cb.todos = this.tmp;
    return true;
  }

  constroiExtendida() {
    const v = ContaService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.contaService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.contaService.montaColunaExpandida(v);
    }
  }

  mostraCalculo() {
    if (this.mostraSoma) {
      this.indexSoma = this.achaColunaSoma();
      if (this.indexSoma > 0) {
        let valor = 0;
        if (this.selecionados.length > 0) {
          this.selecionados.forEach((d: ContaInterface) => {
            valor += +d.conta_valor2;
          });
        } else {
          this.conta.forEach((d: ContaInterface) => {
            valor += +d.conta_valor2;
          });
        }
        this.soma = 'R$ ' + valor.toLocaleString('pt-BR');
        this.altura = `${WindowsService.altura - 175}` + 'px';
      }
    }
  }

  showSoma() {
    this.mostraSoma = !this.mostraSoma;
    if (this.mostraSoma) {
      this.mostraCalculo();
    } else {
      this.indexSoma = 0;
      this.altura = `${WindowsService.altura - 150}` + 'px';
      this.soma = null;
    }
  }

  achaColunaSoma(): number {
    let a = 0;
    const b = this._selectedColumns.length;
    for (let i = 0; i < b; i++) {
      if (this._selectedColumns[i].field === 'conta_valor') {
        a = i + 1;
        break;
      }
    }
    if (a > 0) {
      this.indexAntes = a;
      this.indexDepois = b - a;
    }
    return a;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  getPdf(ctb: ContaInterface, imprimir = false) {
    const headers = [
      { titulo1: 'titulo1', valor1: 'valor1', titulo2: 'titulo2', valor2: 'valor2' }
    ];

    /*const body = [
      { titulo1: 'ID', valor1: ctb.conta_id, titulo2: 'PAGO', valor2: ctb.conta_paga },
      { titulo1: 'DT. VENC', valor1: ctb.conta_vencimento, titulo2: 'DT. PGTO.', valor2: ctb.conta_pagamento },
      { titulo1: 'CEDENTE', valor1: ctb.conta_cedente, titulo2: 'VALOR', valor2: ctb.conta_valor },
      { titulo1: 'NÚCLEO', valor1: ctb.conta_local_nome, titulo2: 'DBTO. AUT.', valor2: ctb.conta_debito_automatico },
      { titulo1: 'TIPO', valor1: ctb.conta_tipo },
      [{
        colSpan: 4,
        content: 'OBSERVAÇÕES',
        styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      }],
      [{
        colSpan: 4,
        content: ctb.conta_observacao,
        styles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'normal' }
      }],
    ];*/

    const body = [
      { titulo1: 'ID', valor1: ctb.conta_id, titulo2: 'PAGO', valor2: ctb.conta_paga },
      { titulo1: 'DT. VENC', valor1: ctb.conta_vencimento, titulo2: 'DT. PGTO.', valor2: ctb.conta_pagamento },
      { titulo1: 'CEDENTE', valor1: ctb.conta_cedente, titulo2: 'VALOR', valor2: ctb.conta_valor },
      { titulo1: 'NÚCLEO', valor1: ctb.conta_local_nome, titulo2: 'DBTO. AUT.', valor2: ctb.conta_debito_automatico },
      { titulo1: 'TIPO', valor1: ctb.conta_tipo },
      [{
        colSpan: 4,
        content: 'OBSERVAÇÕES',
        styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      }],
      [{
        colSpan: 4,
        content: ctb.conta_observacao,
        styles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'normal' }
      }],
    ];


    // this.mostraCtx = true;
    setTimeout(() => {
      const doc = new jsPDF(
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );
      const fileName = `lancamento__${new Date().getTime()}.pdf`;
      doc.setFontSize(15);
      doc.text('LANÇAMENTO', 15, 15);
      doc.setFontSize(8);
      autoTable (doc, {
        startY: 20,
        // html:  document.getElementById('ctx')
        head: headers,
        body: body,
        tableWidth: '100%',
        showHead: false,
        columnStyles: {
          titulo1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
          valor1: { cellWidth: 'wrap', fontSize: '10' },
          titulo2: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
          valor2: { cellWidth: 'wrap', fontSize: '10' },
        },
        theme: 'grid',
        bodyStyles: {fontSize: '8'},

      });


      if (imprimir === false) {
        doc.save(fileName);
        // this.mostraCtx = false;
      } else {
        doc.autoPrint();
        // doc.output('dataurlnewwindow');
        window.open(doc.output('bloburl'));
        // this.mostraCtx = false;
      }

    }, 2000);
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
  }

}
