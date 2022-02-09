import { Component, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, SelectItem, MenuItem, ConfirmationService } from 'primeng/api';
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
  PassagemArray,
  PassagemBuscaCampoInterface,
  PassagemInterface,
  PassagemPaginacaoInterface,
  PassagemTotalInterface
} from '../_models';
import { PassagemBuscaService, PassagemService } from '../_services';
import { PassagemFormularioComponent } from '../passagem-formulario/passagem-formulario.component';
declare var jsPDF: any;

@Component({
  selector: 'app-passagem-datatable',
  templateUrl: './passagem-datatable.component.html',
  styleUrls: ['./passagem-datatable.component.css'],
  providers: [ DialogService ]
})
export class PassagemDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtpa', { static: true }) public dtpa: any;
  @ViewChild('cm', { static: true }) cm: ElementRef;
  private alturas: number[] = [];
  private larguras: number[] = [];
  private campos: string[] = [];
  loading = false;
  cols: any[];
  currentPage = 1;
  passagem: PassagemInterface[];
  psgContexto: PassagemInterface;
  total: PassagemTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: PassagemInterface[] = [];
  sortCampo = 'passagem_data';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: PassagemBuscaCampoInterface[];
  altura = `${WindowsService.altura - 180}` + 'px';
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
  botaoEnviarVF: boolean;
  btnExpandirVF = true;
  coluna: any = null;
  valor: string | number = null;
  ptBr: any;
  editando = false;
  editLinhaOld: PassagemInterface;
  editLinhaIdxOld: number;
  id: number = null;
  voado_id: number | boolean = null;
  pagamento: string = null;
  idx: number = null;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    public dialogService: DialogService,
    private cf: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private passagemService: PassagemService,
    private pss: PassagemBuscaService,
    private cs: CarregadorService,
  ) {
  }

  ngOnInit() {

    this.cols = [
      { field: 'passagem_id', header: 'ID', sortable: 'true', largura: '80px'},
      { field: 'passagem_data', header: 'DATA', sortable: 'true', largura: '80px'},
      { field: 'passagem_hora', header: 'HORÁRIO', sortable: 'false', largura: '80px'},
      { field: 'passagem_beneficiario', header: 'BENEFICIÁRIO', sortable: 'true', largura: '300px'},
      { field: 'passagem_aerolinha_nome', header: 'COMPANHIA', sortable: 'true', largura: '200px'},
      { field: 'passagem_trecho', header: 'TRECHO', sortable: 'true', largura: '300px'},
      { field: 'passagem_voo', header: 'VOO', sortable: 'true', largura: '200px'},
      { field: 'passagem_localizador', header: 'LOCALIZADOR', sortable: 'true', largura: '150px'},
      { field: 'passagem_valor', header: 'VALOR', sortable: 'true', largura: '100px'},
      { field: 'passagem_voado_sn', header: 'VOADO', sortable: 'true', largura: '100px'},
      { field: 'passagem_observacao', header: 'OBSERVAÇÃO', sortable: 'false', largura: '500px'}
    ];

    if (sessionStorage.getItem('passagem-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('passagem-selectedColumns'));
      sessionStorage.removeItem('passagem-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [];

    if (this.aut.passagemaerea_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {
          label: 'INCLUIR', icon: 'far fa-lg fa-address-card', style: { 'font-size': '1em' },
          command: () => {
            this.passagemIncluir();
          }
        });
    }

    if (this.aut.passagemaerea_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'fas fa-lg fa-pen-fancy', style: { 'font-size': '1em' },
          command: () => {
            this.passagemAlterar(this.psgContexto);
          }
        });
    }

    if (this.aut.passagemaerea_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'far fa-lg fa-trash-alt', style: { 'font-size': '1em' },
          command: () => {
            this.passagemApagar(this.psgContexto);
          }
        });
    }

    this.itemsAcao = [
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
    ];

    this.constroiExtendida();

    if (this.pss.buscaStateSN) {
      this.getState();
    } else {
      this.pss.ps.todos = false;
    }

    this.sub.push(this.pss.busca$.subscribe(
      () => {
        this.pss.ps.todos = false;
        this.dtpa.reset();
        this.dtpa.selectionKeys = [];
        this.selecionados = [];
      }
    ));
  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.pss.ps.sortcampo !== event.sortField.toString()) {
        this.pss.ps.sortcampo = event.sortField.toString();
      }
    }
    if (this.pss.ps.inicio !== event.first.toString()) {
      this.pss.ps.inicio = event.first.toString();
    }
    if (this.pss.ps.numlinhas !== event.rows.toString()) {
      this.pss.ps.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.pss.ps.sortorder !== event.sortOrder.toString()) {
      this.pss.ps.sortorder = event.sortOrder.toString();
    }
    if (!this.pss.buscaStateSN) {
      this.postPassagemBusca();
    }
  }

  onRowExpand(event): void {
    this.passagemService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.passagemService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.passagemService.montaColunaExpandida(this.passagemService.expandidoDados);
  }

  onChangeSeletorColunas(changes): void {
    this.dtpa.saveState();
    this.camposSelecionados = null;
    this.camposSelecionados = changes.value.map(
      function(val) {
        return { field: val.field, header: val.header };
      });
  }

  mostraSelectColunas(): void {
    this.selectedColumnsOld = this.selectedColumns;
    this.mostraSeletor = true;
  }

  hideSeletor(ev): void {
    if (this.selectedColumnsOld !== this.selectedColumns) {
      this.postPassagemBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.psgContexto = event.data;
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
        { field: 'passagem_data', header: 'DATA', sortable: 'true', largura: '80px'},
        { field: 'passagem_hora', header: 'HORÁRIO', sortable: 'false', largura: '80px'},
        { field: 'passagem_beneficiario', header: 'BENEFICIÁRIO', sortable: 'true', largura: '300px'},
        { field: 'passagem_aerolinha_nome', header: 'COMPANHIA', sortable: 'true', largura: '200px'},
        { field: 'passagem_trecho', header: 'TRECHO', sortable: 'true', largura: '300px'},
        { field: 'passagem_voado_sn', header: 'VOADO', sortable: 'true', largura: '150px'}
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({ field: 'passagem_id', header: 'ID' });
    this.selectedColumns.forEach((c) => {
      this.camposSelecionados.push({ field: c.field, header: c.header });
    });
  }

  // FUNCOES DE BUSCA ==========================================================

  postPassagemBusca(): void {
    this.pss.ps['campos'] = this.camposSelecionados;
    if (!this.pss.ps.sortcampo) {
      this.pss.ps.sortcampo = this.sortCampo;
    }
    this.cs.mostraCarregador();
    this.sub.push(this.passagemService.postPassagemBusca(this.pss.ps)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.passagem = dados.passagem;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.pss.ps.todos = this.tmp;
          this.currentPage = (
            parseInt(this.pss.ps.inicio, 10) +
            parseInt(this.pss.ps.numlinhas, 10)) /
            parseInt(this.pss.ps.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.pss.criarPassagemBusca();
    this.pss.ps = JSON.parse(sessionStorage.getItem('passagem-busca'));
    if (this.pss.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: PassagemPaginacaoInterface }) => {
          this.passagem = data.dados.passagem;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.pss.ps.todos = this.tmp;
          this.currentPage = (
            parseInt(this.pss.ps.inicio, 10) +
            parseInt(this.pss.ps.numlinhas, 10)) /
            parseInt(this.pss.ps.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.pss.buscaStateSN = false;
          sessionStorage.removeItem('passagem-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  passagemIncluir() {
    if (this.aut.passagemaerea_incluir) {
      const ref2 = this.dialogService.open(PassagemFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'tabela'
        },
        header: 'INCLUIR PASSAGEM',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });

      this.sub.push(ref2.onClose.subscribe((res?: boolean) => {
        if (res) {
          this.postPassagemBusca();
        }
      }));
    }
  }

  passagemAlterar(pass: PassagemInterface) {
    if (this.aut.passagemaerea_alterar) {
      const ref = this.dialogService.open(PassagemFormularioComponent, {
        data: {
          acao: 'alterar',
          passagem: pass,
          origem: 'tabela'
        },
        header: 'ALTERAR PASSAGEM',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });

      this.sub.push(ref.onClose.subscribe((res?: PassagemInterface) => {
        if (res) {
          const tmp = this.passagem.find( i =>
            i.passagem_id === res.passagem_id
          );
          if (tmp !== undefined) {
            this.passagem[this.passagem.indexOf(tmp)] = res;
          }
          this.cs.escondeCarregador();
        }
      }));
    }
  }

  passagemApagar(psg: PassagemInterface) {
    if (this.aut.passagemaerea_apagar) {
      this.btnInativo = true;
      this.cf.confirm({
        message: 'Confirma exclusão?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.cs.mostraCarregador();
          this.passagemDelete(psg);
        },
        reject: () => {
          this.btnInativo = false;
        }
      });
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  passagemDelete(psg: PassagemInterface) {
    if (this.aut.passagemaerea_apagar) {
      this.passagemService.deletePassagemId(psg.passagem_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => {
            this.cs.escondeCarregador();
            this.btnInativo = false;
            console.error('Erro->', err);
            this.messageService.add({ key: 'passagemToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
          },
          complete: () => {
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.passagem.splice(this.passagem.indexOf(this.passagem.find(i => i.passagem_id === psg.passagem_id)), 1);
              this.total.num--;
              this.totalRecords = this.total.num;
              this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
              this.messageService.add({
                key: 'passagemToast',
                severity: 'success',
                summary: 'EXCLUIR PASSAGEM',
                detail: this.resp[2]
              });
              this.btnInativo = false;
            } else {
              this.cs.escondeCarregador();
              this.btnInativo = false;
              console.error('ERRO - EXCLUIR ', this.resp[2]);
              this.messageService.add({ key: 'passagemToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
            }
          }
        });
    }
  }

  setCurrentStyles(col: any, valor: string | number) {
    const test = ['passagem_data', 'passagem_valor', 'passagem_hora'];
    // CSS styles: set per current state of component properties
    return {
      'text-align': test.indexOf(col.field) > -1 ? 'right' : 'left',
      'background-color': col.teste && col.field === 'passagem_voado_sn' && valor === 'NÃO' ? 'var(--atencao)' : 'inherit',
      'width':   col.largura,
      'padding-bottom': 0,
      'padding-top': '.3em'
    };
  }

  onRowEditInit(c: PassagemInterface, rowIndex: number) {
    this.btnExpandirVF = false;
    if (this.editando === false) {
      this.id = c.passagem_id;
      this.voado_id = c.passagem_voado_id;
      this.idx = rowIndex;
      this.editando = true;
    }
  }

  onRowEditSave(cta: PassagemInterface, rowIndex: number) {
    this.btnExpandirVF = true;
    if ((cta.passagem_voado_id !== this.voado_id && cta.passagem_voado_id !== null) &&
      cta.passagem_id === this.id && rowIndex === this.idx) {
      this.cs.mostraCarregador();
      this.sub.push(this.passagemService.putPassagemAlterarDatatable(
        cta.passagem_id, cta.passagem_voado_id)
        .pipe(take(1))
        .subscribe({
          next: (dados: any[]) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botaoEnviarVF = false;
            this.cs.escondeCarregador();
            this.messageService.add({
              key: 'passagemToast',
              severity: 'warn',
              summary: 'ERRO ALTERAR',
              detail: this.resp[2]
            });
            console.log(err);
            this.editando = false;
            this.id = null;
            this.voado_id = null;
            this.pagamento = null;
            this.idx = null;
          },
          complete: () => {
            this.editando = false;
            if (this.resp[0]) {
              this.passagem[rowIndex] = this.resp[3];
              this.messageService.add({
                key: 'passagemToast',
                severity: 'success',
                summary: 'ALTERAR PASSAGEM',
                detail: this.resp[2]
              });
              this.botaoEnviarVF = false;
              this.cs.escondeCarregador();
            } else {
              this.botaoEnviarVF = false;
              this.cs.escondeCarregador();
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.messageService.add({
                key: 'passagemToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
            this.id = null;
            this.voado_id = null;
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
    this.voado_id = null;
    this.idx = null;
  }

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.pss.ps.todos;
    this.pss.ps.todos = td;
    if (this.pss.ps.todos === true) {
      let psg: PassagemInterface[];
      let totalPdf: PassagemTotalInterface;
      let numTotalRegs: number;
      this.pss.ps['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.passagemService.postPassagemBusca(this.pss.ps)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            psg = dados.passagem;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('passagem', this.camposSelecionados, psg);
            this.pss.ps.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('passagem', this.camposSelecionados, this.selecionados);
      this.pss.ps.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('passagem', this.camposSelecionados, this.passagem);
    this.pss.ps.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.pss.ps.todos;
    this.pss.ps.todos = td;
    if (this.pss.ps.todos === true) {
      let passprint: PassagemInterface[];
      let totalprint: PassagemTotalInterface;
      let numTotalRegs: number;
      this.pss.ps['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.passagemService.postPassagemBusca(this.pss.ps)
        .subscribe({
          next: (dados) => {
            passprint = dados.passagem;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, passprint);
            this.pss.ps.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.pss.ps.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.passagem);
    this.pss.ps.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.pss.ps.todos;
    this.pss.ps.todos = td;
    if (this.pss.ps.todos === true) {
      let passcsv: PassagemInterface[];
      let totalprint: PassagemTotalInterface;
      let numTotalRegs: number;
      this.pss.ps['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.passagemService.postPassagemBusca(this.pss.ps)
        .subscribe({
          next: (dados) => {
            passcsv = dados.passagem;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv('passagem', this.camposSelecionados, passcsv);
            this.pss.ps.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv('passagem', this.camposSelecionados, this.selecionados);
      this.pss.ps.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv('passagem', this.camposSelecionados, this.passagem);
    this.pss.ps.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.pss.ps.todos;
    this.pss.ps.todos = td;
    if (this.pss.ps.todos === true) {
      let passcsv: PassagemInterface[];
      let totalprint: PassagemTotalInterface;
      let numTotalRegs: number;
      this.pss.ps['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.passagemService.postPassagemBusca(this.pss.ps)
        .subscribe({
          next: (dados) => {
            passcsv = dados.passagem;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile('passagem', passcsv, PassagemArray.getArrayTitulo());
            this.pss.ps.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile('passagem', this.selecionados, PassagemArray.getArrayTitulo());
      this.pss.ps.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile('passagem', this.passagem, PassagemArray.getArrayTitulo());
    this.pss.ps.todos = this.tmp;
    return true;
  }

  constroiExtendida() {
    const v = this.passagemService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.passagemService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.passagemService.montaColunaExpandida(v);
    }
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  getPdf(psg: PassagemInterface, imprimir = false) {
    const headers = [
      { titulo1: 'titulo1', valor1: 'valor1', titulo2: 'titulo2', valor2: 'valor2' }
    ];

    const body = [
      { titulo1: 'ID', valor1: psg.passagem_id, titulo2: 'VOADO', valor2: psg.passagem_voado_sn },
      { titulo1: 'DATA', valor1: psg.passagem_data, titulo2: 'HORÁRIO', valor2: psg.passagem_hora },
      { titulo1: 'BENEFICIÁRIO', valor1: psg.passagem_beneficiario, titulo2: 'VALOR', valor2: psg.passagem_valor },
      { titulo1: 'COMPANHIA', valor1: psg.passagem_aerolinha_nome, titulo2: 'LOCALIZADOR', valor2: psg.passagem_localizador },
      { titulo1: 'TRECHO', valor1: psg.passagem_trecho },
      [{
        colSpan: 4,
        content: 'OBSERVAÇÕES',
        styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      }],
      [{
        colSpan: 4,
        content: psg.passagem_observacao,
        styles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'normal' }
      }],
    ];


    setTimeout(() => {
      const doc = new jsPDF(
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );
      const fileName = `passagem_aerea__${new Date().getTime()}.pdf`;
      doc.setFontSize(15);
      doc.text('PASSAGEM AEREA', 15, 15);
      doc.setFontSize(8);
      doc.autoTable ({
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
      } else {
        doc.autoPrint();
        // doc.output('dataurlnewwindow');
        window.open(doc.output('bloburl'));
      }

    }, 2000);
  }

}
