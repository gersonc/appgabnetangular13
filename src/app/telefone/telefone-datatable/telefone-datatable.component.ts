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
  TelefoneArray,
  TelefoneBuscaCampoInterface,
  TelefoneDetalheInterface,
  TelefoneInterface,
  TelefonePaginacaoInterface,
  TelefoneTotalInterface
} from '../_models';
import { TelefoneBuscaService, TelefoneService } from '../_services';
import { TelefoneFormularioComponent } from '../telefone-formulario/telefone-formulario.component';
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
  selector: 'app-telefone-datatable',
  templateUrl: './telefone-datatable.component.html',
  styleUrls: ['./telefone-datatable.component.css'],
  providers: [ DialogService ]
})
export class TelefoneDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dttf', { static: true }) public dttf: any;
  @ViewChild('cm', { static: true }) cm: ElementRef | undefined;
  private alturas: number[] = [];
  private larguras: number[] = [];
  private campos: string[] = [];
  loading = false;
  cols?: any[];
  currentPage = 1;
  telefone?: TelefoneInterface[];
  ofContexto?: TelefoneInterface;
  total?: TelefoneTotalInterface;
  totalRecords = 0;
  numerodePaginas?: number;
  first?: number;
  rows = 50;
  selecionados: TelefoneInterface[] = [];
  sortCampo = 'telefone_status';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados?: TelefoneBuscaCampoInterface[]|null;
  altura = `${WindowsService.altura - 150}` + 'px'; // 171.41 = 10.71rem = 10.71 * 16px
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  numColunas = 3;
  expColunas = 0;
  dadosExpandidos?: Subscription;
  expandidoDados: any = false;
  dadosExp?: any[];
  itemsAcao?: MenuItem[];
  contextoMenu?: MenuItem[];
  tmp: boolean | null | undefined = false;
  sub: Subscription[] = [];
  authAlterar = false;
  authApagar = false;
  authIncluir = false;
  resp: any[] = [];
  btnInativo = false;
  mostraCtx = false;
  // buscaStateSN: boolean;
  // public mostraMenu$: boolean;

  constructor(
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    public dialogService: DialogService,
    private cf: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private telefoneService: TelefoneService,
    private tbs: TelefoneBuscaService,
    private cs: CarregadorService
  ) {
  }

  ngOnInit() {

    this.cols = [
      { field: 'telefone_id', header: 'ID', sortable: 'true', largura: '80px' },
      { field: 'telefone_data', header: 'DATA E HORA', sortable: 'true', largura: '200px' },
      { field: 'telefone_para', header: 'PARA', sortable: 'true', largura: '300px' },
      { field: 'telefone_de', header: 'DE', sortable: 'true', largura: '300px' },
      { field: 'telefone_assunto', header: 'ASSUNTO', sortable: 'true', largura: '300px' },
      { field: 'telefone_ddd', header: 'DDD', sortable: 'true', largura: '150px' },
      { field: 'telefone_telefone', header: 'TELEFONE', sortable: 'true', largura: '200px' },
      { field: 'telefone_local_nome', header: 'NÚCLEO', sortable: 'true', largura: '250px' },
      { field: 'telefone_resolvido', header: 'RESOLVIDO', sortable: 'true', largura: '150px' },
      { field: 'telefone_usuario_nome', header: 'ATENDENTE', sortable: 'true', largura: '200px' },
      { field: 'telefone_observacao', header: 'OBSERVAÇÃO', sortable: 'false', largura: '500px' }
    ];

    if (sessionStorage.getItem('telefone-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage?.getItem('telefone-selectedColumns')!);
      sessionStorage.removeItem('telefone-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [];

    if (this.authenticationService.telefone_incluir) {
      this.authIncluir = true;
      this.contextoMenu.push(
        {
          label: 'INCLUIR', icon: 'far fa-lg fa-address-card', style: { 'font-size': '1em' },
          command: () => {
            this.telefoneIncluir();
          }
        });
    }

    if (this.authenticationService.telefone_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'fas fa-lg fa-pen-fancy', style: { 'font-size': '1em' },
          command: () => {
            this.telefoneAlterar(this.ofContexto!);
          }
        });
    }

    if (this.authenticationService.telefone_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'far fa-lg fa-trash-alt', style: { 'font-size': '1em' },
          command: () => {
            this.telefoneApagar(this.ofContexto!);
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

    if (this.tbs.buscaStateSN) {
      this.getState();
    } else {
      this.tbs.tb.todos = false;
    }

    this.sub.push(this.tbs.busca$.subscribe(
      () => {
        this.tbs.tb.todos = false;
        this.dttf.reset();
        this.dttf.selectionKeys = [];
        this.selecionados = [];
      }
    ));
  }

  // EVENTOS ===================================================================

  onColReorder(event: any): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.tbs.tb.sortcampo !== event.sortField.toString()) {
        this.tbs.tb.sortcampo = event.sortField.toString();
      }
    }
    if (this.tbs.tb.inicio !== event?.first?.toString()) {
      this.tbs.tb.inicio = event?.first?.toString();
    }
    if (this.tbs.tb.numlinhas !== event?.rows?.toString()) {
      this.tbs.tb.numlinhas = event?.rows?.toString();
      this.rows = event?.rows!;
    }
    if (this.tbs.tb.sortorder !== event?.sortOrder?.toString()) {
      this.tbs.tb.sortorder = event?.sortOrder?.toString();
    }
    if (!this.tbs.buscaStateSN) {
      this.postTelefoneBusca();
    }
  }

  onRowExpand(event: any): void {
    this.telefoneService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.telefoneService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.telefoneService.montaColunaExpandida(this.telefoneService.expandidoDados);
  }

  onChangeSeletorColunas(changes: any): void {
    this.dttf.saveState();
    this.camposSelecionados = null;
    this.camposSelecionados = changes.value.map(
      function(val: any) {
        return { field: val.field, header: val.header };
      });
  }

  mostraSelectColunas(): void {
    this.selectedColumnsOld = this.selectedColumns;
    this.mostraSeletor = true;
  }

  hideSeletor(ev: any): void {
    if (this.selectedColumnsOld !== this.selectedColumns) {
      this.postTelefoneBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event: any) {
    this.ofContexto = event.data;
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
        { field: 'telefone_data', header: 'DATA E HORA', sortable: 'true', largura: '200px' },
        { field: 'telefone_para', header: 'PARA', sortable: 'true', largura: '300px' },
        { field: 'telefone_de', header: 'DE', sortable: 'true', largura: '300px' },
        { field: 'telefone_assunto', header: 'ASSUNTO', sortable: 'true', largura: '300px' },
        { field: 'telefone_ddd', header: 'DDD', sortable: 'true', largura: '150px' },
        { field: 'telefone_telefone', header: 'TELEFONE', sortable: 'true', largura: '200px' },
        { field: 'telefone_resolvido', header: 'RESOLVIDO', sortable: 'true', largura: '150px' }
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({ field: 'telefone_id', header: 'ID' });
    this.selectedColumns.forEach((c) => {
      this.camposSelecionados!.push({ field: c.field, header: c.header });
    });
  }

  // FUNCOES DE BUSCA ==========================================================

  postTelefoneBusca(): void {
    this.tbs.tb['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.telefoneService.postTelefoneBusca(this.tbs.tb)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.telefone = dados.telefone;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.tbs.tb.todos = this.tmp;
          this.currentPage = (
            parseInt(this.tbs?.tb?.inicio!, 10) +
            parseInt(this.tbs?.tb?.numlinhas!, 10)) /
            parseInt(this.tbs?.tb?.numlinhas!, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.tbs.criarTelefoneBusca();
    this.tbs.tb = JSON.parse(sessionStorage?.getItem('telefone-busca')!);
    if (this.tbs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados?: TelefonePaginacaoInterface }) => {
          this.telefone = data.dados?.telefone;
          this.total = data.dados?.total;
          this.totalRecords = this.total?.num ? this.total.num : 0;
          this.tbs.tb.todos = this.tmp;
          this.currentPage = (
              parseInt(this.tbs?.tb?.inicio!, 10) +
              parseInt(this.tbs?.tb?.numlinhas!, 10)) /
            parseInt(this.tbs?.tb?.numlinhas!, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.tbs.buscaStateSN = false;
          sessionStorage.removeItem('telefone-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================
  telefoneIncluir() {
    if (this.authenticationService.telefone_incluir) {
      const ref2 = this.dialogService.open(TelefoneFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'tabela'
        },
        header: 'INCLUIR TELEFONEMA',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });

      this.sub.push(ref2.onClose.subscribe((res?: boolean) => {
        if (res) {
          this.postTelefoneBusca();
        }
      }));
    }
  }

  telefoneAlterar(tel: TelefoneInterface) {
    if (this.authenticationService.telefone_alterar) {
      const ref = this.dialogService.open(TelefoneFormularioComponent, {
        data: {
          acao: 'alterar',
          telefone: tel,
          origem: 'tabela'
        },
        header: 'ALTERAR TELEFONEMA',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });

      this.sub.push(ref.onClose.subscribe((res?: TelefoneInterface) => {
        if (res) {
          const tmp = this.telefone?.find( i =>
            i.telefone_id === res.telefone_id
          );
          if (tmp !== undefined) {
            // @ts-ignore
            this.telefone[this.telefone!.indexOf(tmp)] = res;
          }
        }
      }));
    }
  }

  telefoneApagar(of: TelefoneInterface) {
    if (this.authenticationService.telefone_apagar) {
      this.btnInativo = true;
      this.cf.confirm({
        message: 'Confirma exclusão?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.cs.mostraCarregador();
          this.telefoneDelete(of);
        },
        reject: () => {
          this.btnInativo = false;
        }
      });
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  telefoneDelete(of: TelefoneInterface) {
    if (this.authenticationService.telefone_apagar) {
      this.telefoneService.deleteTelefoneId(of.telefone_id!)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => {
            this.cs.escondeCarregador();
            this.btnInativo = false;
            console.error('Erro->', err);
            this.messageService.add({ key: 'telefoneToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
          },
          complete: () => {
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.telefone!.splice(this.telefone!.indexOf(<TelefoneInterface>this.telefone!.find(i => i.telefone_id === of.telefone_id)), 1);
              // @ts-ignore
              this.total.num--;
              // @ts-ignore
              this.totalRecords = this.total.num;
              this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
              this.messageService.add({
                key: 'telefoneToast',
                severity: 'success',
                summary: 'EXCLUIR TELEFONEMA',
                detail: this.resp[2]
              });
              this.btnInativo = false;
            } else {
              this.cs.escondeCarregador();
              this.btnInativo = false;
              console.error('ERRO - EXCLUIR ', this.resp[2]);
              this.messageService.add({ key: 'telefoneToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
            }
          }
        });
    }
  }


  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofPdf: TelefoneInterface[];
      let totalPdf: TelefoneTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.telefoneService.postTelefoneBusca(this.tbs.tb)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ofPdf = dados.telefone;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('telefone', this.camposSelecionados!, ofPdf);
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('telefone', this.camposSelecionados!, this.selecionados);
      this.tbs.tb.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('telefone', this.camposSelecionados!, this.telefone!);
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofprint: TelefoneInterface[];
      let totalprint: TelefoneTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.telefoneService.postTelefoneBusca(this.tbs.tb)
        .subscribe({
          next: (dados) => {
            ofprint = dados.telefone;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados!, ofprint);
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados!, this.selecionados);
      this.tbs.tb.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados!, this.telefone!);
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofcsv: TelefoneInterface[];
      let totalprint: TelefoneTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.telefoneService.postTelefoneBusca(this.tbs.tb)
        .subscribe({
          next: (dados) => {
            ofcsv = dados.telefone;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv('telefone', this.camposSelecionados!, ofcsv);
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv('telefone', this.camposSelecionados!, this.selecionados);
      this.tbs.tb.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv('telefone', this.camposSelecionados!, this.telefone!);
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofcsv: TelefoneInterface[];
      let totalprint: TelefoneTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.telefoneService.postTelefoneBusca(this.tbs.tb)
        .subscribe({
          next: (dados) => {
            ofcsv = dados.telefone;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile('telefone', ofcsv, TelefoneArray.getArrayTitulo());
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile('telefone', this.selecionados, TelefoneArray.getArrayTitulo());
      this.tbs.tb.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile('telefone', this.telefone!, TelefoneArray.getArrayTitulo());
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  constroiExtendida() {
    const v = this.telefoneService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.telefoneService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.telefoneService.montaColunaExpandida(v);
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  getPdf(tel: TelefoneInterface, imprimir = false) {
    const headers = [
      ['titulo1', 'valor1', 'titulo2', 'valor2']
    ];

    const body = [
      ['ID', tel.telefone_id, 'DATA E HORA', tel.telefone_data ],
      ['PARA', tel.telefone_para, 'DE', tel.telefone_de ],
      ['ASSUNTO', tel.telefone_assunto, 'NÚCLEO',tel.telefone_local_nome ],
      ['DDD', tel.telefone_ddd, 'TELEFONE', tel.telefone_telefone ],
      ['RESOLVIDO', tel.telefone_id, 'ATENDENTE', tel.telefone_usuario_nome ],
      [{
        colSpan: 4,
        content: 'OBSERVAÇÕES',
      }],
      [{
        colSpan: 4,
        content: tel.telefone_observacao,
      }],
    ];

    setTimeout(() => {
      let doc = new jsPDF(
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );
      const fileName = `telefonema__${new Date().getTime()}.pdf`;
      doc.setFontSize(15);
      doc.text('TELEFONEMA', 15, 15);
      doc.setFontSize(8);
      autoTable (doc, {
        startY: 20,
        body: [
          ['ID', tel.telefone_id, 'DATA E HORA', tel.telefone_data ],
          ['PARA', tel.telefone_para, 'DE', tel.telefone_de ],
          ['ASSUNTO', tel.telefone_assunto, 'NÚCLEO',tel.telefone_local_nome ],
          ['DDD', tel.telefone_ddd, 'TELEFONE', tel.telefone_telefone ],
          ['RESOLVIDO', tel.telefone_id, 'ATENDENTE', tel.telefone_usuario_nome ],
          ['OBSERVAÇÕES',{ colSpan: 3, content: tel.telefone_observacao}]
        ],
        showHead: false,
        theme: 'grid',
        bodyStyles: {fontSize: 8},

      });

      const tempo = (this.campos.length * 500) + 500;
      setTimeout(() => {
        if (imprimir === false) {
          doc.save(fileName);
          doc = null;
        } else {
          const a: string = doc.output('bloburi').toString();
          window.open(a);
          doc.autoPrint();
          doc = null;
        }
      }, tempo);
    }, 2000);
  }
}
