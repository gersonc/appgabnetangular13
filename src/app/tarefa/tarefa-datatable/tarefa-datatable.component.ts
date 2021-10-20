import { Component, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, SelectItem, MenuItem, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { WindowsService } from '../../_layout/_service';
import {
  ColumnsInterface,
  CsvService,
  ExcelService,
  MostraMenuService,
  PrintJSService,
  TabelaPdfService
} from '../../_services';
import {
  TarefaArray,
  // TarefaArray,
  TarefaBuscaCampoInterface,
  // TarefaDetalheInterface,
  TarefaInterface, TarefaListarInterface,
  TarefaPaginacaoInterface,
  TarefaTotalInterface, TarefaUsuarioSituacaoInteface
} from '../_models';
import { TarefaBuscaService, TarefaService } from '../_services';
import { TarefaFormularioComponent } from '../tarefa-formulario/tarefa-formulario.component';
import { AuthenticationService, CarregadorService} from "../../_services";
import {TarefaAtualizarComponent} from "../tarefa-atualizar/tarefa-atualizar.component";
import {TarefaExibirComponent} from "../tarefa-exibir/tarefa-exibir.component";
declare var jsPDF: any;

@Component({
  selector: 'app-tarefa-datatable',
  templateUrl: './tarefa-datatable.component.html',
  styleUrls: ['./tarefa-datatable.component.css'],
  providers: [ DialogService ]
})
export class TarefaDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dttf', { static: true }) public dttf: any;
  @ViewChild('cm', { static: true }) cm: ElementRef;
  @ViewChild('autorSit', { static: true }) autorSit: any;
  @ViewChild('userSit', { static: true }) userSit: ElementRef;
  private alturas: number[] = [];
  private larguras: number[] = [];
  private campos: string[] = [];
  loading = false;
  cols: any[];
  currentPage = 1;
  tarefa: TarefaListarInterface[];
  tfContexto: TarefaListarInterface;
  total: TarefaTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: TarefaListarInterface[] = [];
  sortCampo = 'tarefa_situacao_nome';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: TarefaBuscaCampoInterface[];
  altura = `${WindowsService.altura - 180}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  numColunas = 3;
  expColunas = 0;
  dadosExpandidos: Subscription;
  expandidoDados: any = false;
  dadosExp: any[];
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  tmp = false;
  sub: Subscription[] = [];
  authAlterar = false;
  authApagar = false;
  authIncluir = false;
  resp: any[];
  btnInativo = false;
  mostraCtx = false;
  ddTarefa_usuario_situacao_id: SelectItem[] = [];
  tarefa_usuario_situacao = -1;
  // buscaStateSN: boolean;
  // public mostraMenu$: boolean;

  constructor(
    public mm: MostraMenuService,
    public dialogService: DialogService,
    private cf: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private tarefaService: TarefaService,
    private tbs: TarefaBuscaService,
    private cs: CarregadorService,
    public au: AuthenticationService
  ) { }

  ngOnInit() {
    this.ddTarefa_usuario_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-tarefa_situacao'));

    this.cols = [
      { field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', largura: '160px' },
      { field: 'tarefa_id', header: 'ID', sortable: 'true', largura: '80px' },
      { field: 'tarefa_titulo', header: 'TITULO', sortable: 'true', largura: '300px' },
      { field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'false', largura: '300px' },
      { field: 'tarefa_data', header: 'PRAZO', sortable: 'true', largura: '100px' },
      { field: 'tu_usuario_nome', header: 'DEMANDADO(S)', sortable: 'true', largura: '160px' },
      { field: 'tus_situacao_nome', header: 'SITUAÇÃO (demandados)', sortable: 'true', largura: '160px' },
      { field: 'tarefa_hora', header: 'HORA', sortable: 'false', largura: '100px' },
      { field: 'tarefa_usuario_autor_nome', header: 'AUTOR', sortable: 'true', largura: '200px' },
      { field: 'tarefa_datahora', header: 'DATA', sortable: 'true', largura: '150px' }
    ];

    if (sessionStorage.getItem('tarefa-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('tarefa-selectedColumns'));
      sessionStorage.removeItem('tarefa-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.mapeiaColunasSelecionadas();

    this.contextoMenu = [];
    this.contextoMenu.push({
      label: 'EXIBIR', icon: 'fas fa-lg fa-pen-fancy', style: { 'font-size': '1em' },
      command: () => {
        this.tarefaExibir(this.tfContexto);
      }
    });
    this.authIncluir = true;
    this.contextoMenu.push({
      label: 'INCLUIR', icon: 'far fa-lg fa-address-card', style: { 'font-size': '1em' },
      command: () => {
        this.tarefaIncluir();
      }
    });
    this.authAlterar = true;
    this.contextoMenu.push({
      label: 'ALTERAR', icon: 'fas fa-lg fa-pen-fancy', style: { 'font-size': '1em' },
      command: () => {
        this.tarefaAlterar(this.tfContexto);
      }
    });
    this.authAlterar = true;
    this.contextoMenu.push({
      label: 'ATUALIZAR', icon: 'pi pi-pencil', style: { 'font-size': '1em' },
      command: () => {
        this.tarefaAtualizar(this.tfContexto, 0);
      }
    });
    this.authApagar = true;
    this.contextoMenu.push({
      label: 'APAGAR', icon: 'far fa-lg fa-trash-alt', style: { 'font-size': '1em' },
      command: () => {
        this.tarefaApagar(this.tfContexto);
      }
    });

    this.itemsAcao = [
      /*
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
      */
      {
        label: 'PDF', icon: 'fas fa-lg fa-file-pdf', style: { 'font-size': '1em' }, command: () => {
          this.mostraTabelaPdf(false);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'far fa-lg fa-file-pdf', style: { 'font-size': '.9em' }, command: () => {
          this.getPdf(this.tarefa,false);
        }
      },
      {
        label: 'IMPRIMIR', icon: 'fas fa-lg fa-print', style: { 'font-size': '1em' }, command: () => {
          // this.imprimirTabela();
          this.mostraTabelaPdf(true);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'fas fa-lg fa-print', style: { 'font-size': '.9em' }, command: () => {
          // this.imprimirTabela(true);
          this.getPdf(this.tarefa,true);
        }
      },
      /*
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
      */
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

  mostraCol(srch: string): boolean {
    const z = this.selectedColumns.findIndex(cpo =>  cpo.field === srch );
    return z > -1;
  }

  getRowSpan(sitNum: number): number {
    let r = 1;
    if ((this.mostraCol('tu_usuario_nome') || this.mostraCol('tus_situacao_nome')) && sitNum > 1) {
      r = sitNum;
    }
    return r;
  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (event.sortField) {
      if (this.tbs.tb.sortcampo !== event.sortField.toString()) {
        this.tbs.tb.sortcampo = event.sortField.toString();
      }
    }
    if (this.tbs.tb.inicio !== event.first.toString()) {
      this.tbs.tb.inicio = event.first.toString();
    }
    if (this.tbs.tb.numlinhas !== event.rows.toString()) {
      this.tbs.tb.numlinhas = event.rows.toString();
      this.rows = event.rows;
    }
    if (this.tbs.tb.sortorder !== event.sortOrder.toString()) {
      this.tbs.tb.sortorder = event.sortOrder.toString();
    }
    if (!this.tbs.buscaStateSN) {
      this.postTarefaBusca();
    }
  }

  onRowExpand(event): void {
    /*
    this.tarefaService.expandidoDados = event.data;
    this.sub.push(this.dadosExpandidos = this.tarefaService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
        }
      ));
    this.tarefaService.montaColunaExpandida(this.tarefaService.expandidoDados);
    */
  }

  onChangeSeletorColunas(changes): void {
    this.dttf.saveState();
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
    // if (this.selectedColumnsOld !== this.selectedColumns) {
    //   this.postTarefaBusca();
    // }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.tfContexto = event.data;
  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mm.mudaMenu();
  }

  mostraLoader(vf: boolean) {
    this.loading = vf;
  }

  resetSelectedColumns(): void {
    if (this.selectedColumns.length <= 1) {
      this.selectedColumns = [
        { field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', largura: '110px' },
        { field: 'tarefa_titulo', header: 'TITULO', sortable: 'true', largura: '300px' },
        { field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'false', largura: '300px' },
        { field: 'tu_usuario_nome', header: 'DEMANDADO(S)', sortable: 'true', largura: '160px' },
        { field: 'tus_situacao_nome', header: 'SITUAÇÃO (demandados)', sortable: 'true', largura: '160px' },
        { field: 'tarefa_data', header: 'PRAZO', sortable: 'true', largura: '100px' },
        { field: 'tarefa_usuario_autor_nome', header: 'AUTOR', sortable: 'true', largura: '200px' },
        { field: 'tarefa_datahora', header: 'DATA', sortable: 'true', largura: '150px' }
      ];
    }
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({ field: 'tarefa_id', header: 'ID' });
    this.selectedColumns.forEach((c) => {
      this.camposSelecionados.push({ field: c.field, header: c.header });
    });
  }

  montaRowSpan(field: string, nlinha: number): number {
    if (field !== 'tu_usuario_nome') {
      return nlinha;
    }
    return 1;
  }

  montaLinhaVf(field: string): boolean {
    return field !== 'tu_usuario_nome';
  }

  fcor(x: number) {
    let cor: string;
    switch(x)
    {
      case 1:
        cor = '#FF8C8C';
        break;
      case 2:
        cor = '#F3F198';
        break;
      case 3:
        cor = '#BBEABE';
        break;
      default:
        cor = '#BBEABE';
    }
    return cor;
  }

  // FUNCOES DE BUSCA ==========================================================

  postTarefaBusca(): void {
    this.tbs.tb['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.tarefaService.postTarefaBusca(this.tbs.tb)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.tarefa = dados.tarefa_listar;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.tbs.tb.todos = this.tmp;
          this.currentPage = (
            parseInt(this.tbs.tb.inicio, 10) +
            parseInt(this.tbs.tb.numlinhas, 10)) /
            parseInt(this.tbs.tb.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {
    this.tbs.criarTarefaBusca();
    this.tbs.tb = JSON.parse(sessionStorage.getItem('tarefa-busca'));
    if (this.tbs.buscaStateSN) {
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: TarefaPaginacaoInterface }) => {
          this.tarefa = data.dados.tarefa_listar;
          this.total = data.dados.total;
          this.totalRecords = this.total.num;
          this.tbs.tb.todos = this.tmp;
          this.currentPage = (
            parseInt(this.tbs.tb.inicio, 10) +
            parseInt(this.tbs.tb.numlinhas, 10)) /
            parseInt(this.tbs.tb.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.tbs.buscaStateSN = false;
          sessionStorage.removeItem('tarefa-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================
  tarefaIncluir() {
      const ref2 = this.dialogService.open(TarefaFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'tabela',
          tpBusca: this.tbs.tb.tipo_listagem
        },
        header: 'INCLUIR TAREFA',
        width: '60%',
        height: '80vh',
        dismissableMask: false,
        showHeader: true
      });

      this.sub.push(ref2.onClose.subscribe((res?: boolean) => {
        if (res) {
          this.postTarefaBusca();
        }
      }));
  }

  tarefaAlterar(tar: TarefaListarInterface) {
    if (this.au.usuario_id === tar.tarefa_usuario_autor_id || this.au.usuario_principal_sn || this.au.usuario_responsavel_sn) {
      const ref = this.dialogService.open(TarefaFormularioComponent, {
        data: {
          acao: 'alterar',
          tarefa: tar,
          origem: 'tabela',
          tpBusca: this.tbs.tb.tipo_listagem
        },
        header: 'ALTERAR TAREFA',
        width: '60%',
        height: '90vh',
        dismissableMask: false,
        showHeader: true
      });

      this.sub.push(ref.onClose.subscribe((res?: TarefaListarInterface) => {
        if (res) {
          const tmp = this.tarefa.find(i =>
            i.tarefa_id === res.tarefa_id
          );
          if (tmp !== undefined) {
            this.tarefa[this.tarefa.indexOf(tmp)] = res;
          }
        }
      }));
    }
  }

  tarefaExibir(tar: TarefaListarInterface) {
    const ref = this.dialogService.open(TarefaExibirComponent, {
      data: {
        acao: 'Detalhe',
        tarefa: tar,
        origem: 'tabela',
        tpBusca: this.tbs.tb.tipo_listagem
      },
      header: 'TAREFA DETALHE',
      width: '60%',
      height: '90vh',
      dismissableMask: false,
      showHeader: true
    });
  }

  tarefaApagar(tar: TarefaInterface) {
    if (this.au.usuario_id === tar.tarefa_usuario_autor_id || this.au.usuario_principal_sn || this.au.usuario_responsavel_sn) {
      this.btnInativo = true;
      this.cf.confirm({
        message: 'Confirma exclusão?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.cs.mostraCarregador();
          this.sub.push(this.tarefaService.deleteTarefa(tar.tarefa_id)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                this.resp = res;
              },
              error: err => {
                console.error('ERRO-->', err);
                this.tarefa_usuario_situacao = -1;
                this.cs.escondeCarregador();
              },
              complete: () => {
                if (this.resp[0]) {
                  const tmp = this.tarefa.find(i =>
                    i.tarefa_id === tar.tarefa_id
                  );
                  if (tmp !== undefined) {
                    const idx = this.tarefa.indexOf(tmp);
                    this.tarefa.splice(idx, 1);
                  }
                  this.cs.escondeCarregador();
                  this.messageService.add({
                    key: 'tarefaToast',
                    severity: 'success',
                    summary: 'EXCLUIR TAREFA',
                    detail: this.resp[2]
                  });
                }
              }
            })
          );
        },
        reject: () => {
          this.btnInativo = false;
        }
      });
    }
  }

  tarefaAtualizar(tar: TarefaListarInterface, rowIndex: number) {
    console.log('tarefaAtualizar', tar, rowIndex);
    const ref = this.dialogService.open(TarefaAtualizarComponent, {
      data: {
        acao: 'atualizar',
        tarefa: tar,
        origem: 'tabela',
        tpBusca: this.tbs.tb.tipo_listagem
      },
      width: '65%',
      height: '90vh',
      header: 'ATUALIZAR TAREFA',
      dismissableMask: false,
      showHeader: true
    });

    this.sub.push(ref.onClose.subscribe((res?: TarefaListarInterface) => {
      if (res) {
        const tmp = this.tarefa.find(i =>
          i.tarefa_id === res.tarefa_id
        );
        if (tmp !== undefined) {
          this.tarefa[this.tarefa.indexOf(tmp)] = res;
        }
      }
    }));
  }

  onEditInit(ev) {
    if (ev.field === 'tarefa_situacao_id') {
      const tf: TarefaListarInterface = ev.data;
      this.tarefa_usuario_situacao = tf.tarefa_situacao_id;
    }
    if (ev.field === 'tus_situacao_id') {
      const tf: TarefaUsuarioSituacaoInteface = ev.data;
      if (tf.tus_usuario_id === this.au.usuario_id) {
        this.tarefa_usuario_situacao = tf.tus_situacao_id;
      } else {
        this.tarefa_usuario_situacao = -1;
      }
    }
  }

  onEditComplete(ev) {
    if (ev.field === 'tarefa_situacao_id') {
      let tf: TarefaListarInterface = ev.data;
      if (tf.tarefa_usuario_autor_id !== this.au.usuario_id || this.tarefa_usuario_situacao === tf.tarefa_situacao_id) {
        this.tarefa_usuario_situacao = -1;
      }
      if (tf.tarefa_usuario_autor_id === this.au.usuario_id &&
        this.tarefa_usuario_situacao !== tf.tarefa_situacao_id &&
        this.tarefa_usuario_situacao !== -1
      ) {
        this.cs.mostraCarregador();
        this.sub.push(this.tarefaService.putTarefaSituacao(tf.tarefa_id, this.tarefa_usuario_situacao, this.tbs.tb.tipo_listagem)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.resp = res;
              tf = this.resp[3][0];
              this.tarefa_usuario_situacao = -1;
            },
            error: err => {
              console.error('ERRO-->', err);
              this.tarefa_usuario_situacao = -1;
              this.cs.escondeCarregador();
            },
            complete: () => {
              if (tf) {
                const tmp = this.tarefa.find(i =>
                  i.tarefa_id === tf.tarefa_id
                );
                if (tmp !== undefined) {
                  this.tarefa[this.tarefa.indexOf(tmp)] = tf;
                }
                this.cs.escondeCarregador();
                this.messageService.add({
                  key: 'tarefaToast',
                  severity: 'success',
                  summary: 'ATUALIZAR TAREFA',
                  detail: this.resp[2]
                });
              }
            }
          })
        );
      }
    }

    if (ev.field === 'tus_situacao_id' && this.tarefa_usuario_situacao !== -1) {
      const tmpTus: TarefaUsuarioSituacaoInteface = ev.data;
      if (tmpTus.tus_situacao_id !== this.tarefa_usuario_situacao) {
        this.cs.mostraCarregador();
        let tf: TarefaListarInterface = null;
        this.sub.push(this.tarefaService.putTarefaUsusarioSituacao(tmpTus.tu_tarefa_id, tmpTus.tus_id, this.tarefa_usuario_situacao, this.tbs.tb.tipo_listagem)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.resp = res;
              tf = this.resp[3][0];
              this.tarefa_usuario_situacao = -1;},
            error: err => {
              console.error('ERRO-->', err);
              this.tarefa_usuario_situacao = -1;
              this.cs.escondeCarregador();
              },
            complete: () => {
              if (tf) {
                const tmp = this.tarefa.find(i =>
                  i.tarefa_id === tf.tarefa_id
                );
                if (tmp !== undefined) {
                  this.tarefa[this.tarefa.indexOf(tmp)] = tf;
                }
                this.cs.escondeCarregador();
                this.messageService.add({
                  key: 'tarefaToast',
                  severity: 'success',
                  summary: 'ATUALIZAR TAREFA',
                  detail: this.resp[2]
                });
              }
            }
          })
        );
      }


      /*
      if (tf.tarefa_usuario_autor_id !== this.au.usuario_id || this.tarefa_usuario_situacao === tf.tarefa_situacao_id) {
        this.tarefa_usuario_situacao = -1;
      }
      if (tf.tarefa_usuario_autor_id === this.au.usuario_id &&
        this.tarefa_usuario_situacao !== tf.tarefa_situacao_id &&
        this.tarefa_usuario_situacao !== -1
      ) {
        this.sub.push(this.tarefaService.putTarefaSituacao(tf.tarefa_id, this.tarefa_usuario_situacao, this.tbs.tb.tipo_listagem)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.resp = res;
              tf = this.resp[3][0];
            },
            error: err => console.error('ERRO-->', err),
            complete: () => {
              if (tf) {
                const tmp = this.tarefa.find(i =>
                  i.tarefa_id === tf.tarefa_id
                );
                if (tmp !== undefined) {
                  this.tarefa[this.tarefa.indexOf(tmp)] = tf;
                }
                this.messageService.add({
                  key: 'tarefaToast',
                  severity: 'success',
                  summary: 'ATUALIZAR TAREFA',
                  detail: this.resp[2]
                });
              }
            }
          })
        );
      }

      */
    }


  }

  onEditCancel(ev) {
    console.log('onEditCancel', ev);
    this.tarefa_usuario_situacao = -1;
  }

  /*
  tarefaDelete(of: TarefaInterface) {
      this.tarefaService.deleteTarefaId(of.tarefa_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => {
            this.cs.escondeCarregador();
            this.btnInativo = false;
            console.error('Erro->', err);
            this.messageService.add({ key: 'tarefaToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
          },
          complete: () => {
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.tarefa.splice(this.tarefa.indexOf(this.tarefa.find(i => i.tarefa_id === of.tarefa_id)), 1);
              this.total.num--;
              this.totalRecords = this.total.num;
              this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
              this.messageService.add({
                key: 'tarefaToast',
                severity: 'success',
                summary: 'EXCLUIR TAREFAMA',
                detail: this.resp[2]
              });
              this.btnInativo = false;
            } else {
              this.cs.escondeCarregador();
              this.btnInativo = false;
              console.error('ERRO - EXCLUIR ', this.resp[2]);
              this.messageService.add({ key: 'tarefaToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
            }
          }
        });
  }
  */

  // FUNCOES RELATORIOS=========================================================

  mostraTabelaPdf2(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofPdf: TarefaInterface[];
      let totalPdf: TarefaTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.tarefaService.postTarefaBusca(this.tbs.tb)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ofPdf = dados.tarefa_listar;
            totalPdf = dados.total;
            numTotalRegs = totalPdf.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            TabelaPdfService.autoTabela('tarefa', this.camposSelecionados, ofPdf);
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('tarefa', this.camposSelecionados, this.selecionados);
      this.tbs.tb.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('tarefa', this.camposSelecionados, this.tarefa);
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  mostraTabelaPdf(td: boolean = false) {
    if (this.selecionados && this.selecionados.length > 0) {
      this.getPdf(this.selecionados, td);
    }
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofprint: TarefaInterface[];
      let totalprint: TarefaTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.tarefaService.postTarefaBusca(this.tbs.tb)
        .subscribe({
          next: (dados) => {
            ofprint = dados.tarefa_listar;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, ofprint);
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.tbs.tb.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.tarefa);
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofcsv: TarefaInterface[];
      let totalprint: TarefaTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.camposSelecionados;
      this.cs.mostraCarregador();
      this.sub.push(this.tarefaService.postTarefaBusca(this.tbs.tb)
        .subscribe({
          next: (dados) => {
            ofcsv = dados.tarefa_listar;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            CsvService.jsonToCsv('tarefa', this.camposSelecionados, ofcsv);
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv('tarefa', this.camposSelecionados, this.selecionados);
      this.tbs.tb.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv('tarefa', this.camposSelecionados, this.tarefa);
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.tbs.tb.todos;
    this.tbs.tb.todos = td;
    if (this.tbs.tb.todos === true) {
      let ofcsv: TarefaInterface[];
      let totalprint: TarefaTotalInterface;
      let numTotalRegs: number;
      this.tbs.tb['campos'] = this.selectedColumns;
      this.cs.mostraCarregador();
      this.sub.push(this.tarefaService.postTarefaBusca(this.tbs.tb)
        .subscribe({
          next: (dados) => {
            ofcsv = dados.tarefa_listar;
            totalprint = dados.total;
            numTotalRegs = totalprint.num;
          },
          error: err => {
            console.error('ERRO-->', err);
            this.cs.escondeCarregador();
          },
          complete: () => {
            ExcelService.exportAsExcelFile('tarefa', ofcsv, TarefaArray.getArrayTitulo());
            this.tbs.tb.todos = this.tmp;
            this.cs.escondeCarregador();
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile('tarefa', this.selecionados, TarefaArray.getArrayTitulo());
      this.tbs.tb.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile('tarefa', this.tarefa, TarefaArray.getArrayTitulo());
    this.tbs.tb.todos = this.tmp;
    return true;
  }

  constroiExtendida() {
    /*
    const v = this.tarefaService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.tarefaService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.tarefaService.montaColunaExpandida(v);
    }

    */
  }

  getPdf(tar: TarefaListarInterface[], imprimir = false) {

    const titulos = [];
    const campos = [];

    this.camposSelecionados.forEach((c) => {
      if (c.field.toString() !== 'tarefa_id') {
        titulos.push(c.header.toString());
        campos.push(c.field.toString());
      }
    });

    const linhasVf: boolean = (campos.indexOf('tu_usuario_nome') !== -1 || campos.indexOf('tus_situacao_nome') !== -1);

    let corpo: any[] = [];

    tar.forEach((t) => {
      let linhas = 1;
      if (linhasVf) {
        linhas = +t['usuario_situacao_num'];
      }

      const row = [];

      campos.forEach( (cpo) => {
        switch (cpo) {
          case 'tu_usuario_nome': {
            row.push(t.usuario_situacao[0].tu_usuario_nome);
            break;
          }
          case 'tus_situacao_nome': {
            row.push(t.usuario_situacao[0].tus_situacao_nome);
            break;
          }
          default: {
            row.push(t[cpo]);
            break;
          }
        }
      });
      corpo.push(row);

      if (linhas > 1) {
        for (let j = 1; j < linhas; j++) {
          const row2 = [];
          campos.forEach( (cpo) => {
            switch (cpo) {
              case 'tu_usuario_nome': {
                row2.push(t.usuario_situacao[j].tu_usuario_nome);
                break;
              }
              case 'tus_situacao_nome': {
                row2.push(t.usuario_situacao[j].tus_situacao_nome);
                break;
              }
              default: {
                row2.push('');
                break;
              }
            }
          });
          corpo.push(row2);
        }
      }
    });




    // this.mostraCtx = true;
    setTimeout(() => {
      const doc = new jsPDF(
        {
          orientation: 'l',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );
      const fileName = `tarefa_${new Date().getTime()}.pdf`;
      doc.setFontSize(12);
      doc.text('TAREFA', 15, 15);
      doc.setFontSize(9);
      doc.autoTable ({
        startY: 20,
        // html:  document.getElementById('ctx')
        head: [titulos],
        body: corpo,
        tableWidth: '100%',
        showHead: true,
        styles: { cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8 },
        theme: 'grid',
        bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 }

      });



      if (imprimir === false) {
        doc.save(fileName);
        //window.open(doc.output('bloburl'));
        // this.mostraCtx = false;
      } else {
        doc.autoPrint();
        doc.output('dataurlnewwindow');
        // window.open(doc.output('bloburl'));
        // this.mostraCtx = false;
      }

    }, 2000);


  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
