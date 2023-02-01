import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/api';
import { WindowsService } from '../../_layout/_service';
import {AuthenticationService, MenuInternoService} from '../../_services';
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {ContaService} from "../_services/conta.service";
import {ContaDropdown} from "../_models/conta-dropdown";
import {ContaI} from "../_models/conta-i";
import {ContaFormService} from "../_services/conta-form.service";
import {DateTime} from "luxon";
import {MsgService} from "../../_services/msg.service";
import {Table} from "primeng/table/table";
import { DispositivoService } from "../../_services/dispositivo.service";

@Component({
  selector: 'app-conta-datatable',
  templateUrl: './conta-datatable.component.html',
  styleUrls: ['./conta-datatable.component.css'],
  providers: [ ConfirmationService ]
})
export class ContaDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: Table;
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  showDetalhe = false;
  contaDetalhe?: ContaI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  // idx = -1;
  acaoConta = '';
  cssMostra: string | null = null;
  resp: any[] = [];


  formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  botaoEnviarVF = false;
  btnExpandirVF = true;
  formValido = false;
  editando = false;
  idx: number | null = null;
  mostraSoma = false;
  indexSoma: number | null = null;
  soma: string | null = null;
  indexAntes: number | null = null;
  indexDepois: number | null = null;
  btnInativo = false;
  contaEdit?: ContaI = {};
  hoje = new Date();
  testeCss= ['conta_vencimento', 'conta_valor', 'conta_pagamento'];
  pagaWidth = '';
  valorWidth = '';
  pagamentoWidth = '';
  pagaIdx = 0;
  valorIdx = 0;
  pagamentoIdx = 0;
  liberaGravar = false;
  showApagar = false;
  apagarTipo = 1;
  apagarId = 0;
  apagarParceleas = 1;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private cf: ConfirmationService,
    public md: MenuDatatableService,
    private ms: MsgService,
    public ct: ContaService,
    public cfs: ContaFormService,
    private cd: ContaDropdown,
    public ds: DispositivoService,
  ) {
  }

  ngOnInit() {
    if (this.ct.selecionados === undefined || this.ct.selecionados === null || !Array.isArray(this.ct.selecionados)) {
      this.ct.selecionados = [];
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
          this.ct.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.ct.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ct.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ct.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ct.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ct.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.ct.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.ct.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ct.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ct.exportToXLSX(3);
        }
      }
    ];

    if (!this.ct.stateSN) {
      this.resetSelectedColumns();
    }


    this.montaMenuContexto();

    this.sub.push(this.ct.busca$.subscribe(
      () => {
        if (this.ct.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.ct.busca.todos = false;
      }
    ));

    this.getColunas();
  }

  montaColunas() {
    this.cols = [
      { field: 'conta_id', header: '', sortable: 'false', width: '2rem'},
      { field: 'conta_cedente', header: 'CREDOR', sortable: 'true', width: '250px'},
      { field: 'conta_vencimento', header: 'DT. VENC.', sortable: 'true', width: '7rem'},
      { field: 'conta_valor', header: 'VALOR', sortable: 'true', width: '8rem'},
      { field: 'conta_paga', header: 'PAGO', sortable: 'true', width: '5rem'},
      { field: 'conta_pagamento', header: 'DT. PGTO.', sortable: 'true', width: '6rem'},
      { field: 'conta_tipo', header: 'TIPO', sortable: 'true', width: '100px'},
      { field: 'conta_observacao', header: 'OBSERVAÇÃO', sortable: 'false', width: '500px'}
    ];
    if (this.aut.solicitacaoVersao < 3) {
      this.cols.push({ field: 'conta_local_nome', header: 'NÚCLEO', sortable: 'true', width: '200px'})
    }
  }

  resetSelectedColumns(): void {
    this.ct.criaTabela();
    this.ct.tabela.selectedColumns = [
      { field: 'conta_id', header: '', sortable: 'false', width: '2rem'},
      { field: 'conta_cedente', header: 'CREDOR', sortable: 'true', width: '250px'},
      { field: 'conta_vencimento', header: 'DT. VENC.', sortable: 'true', width: '7rem'},
      { field: 'conta_valor', header: 'VALOR', sortable: 'true', width: '8rem'},
      { field: 'conta_paga', header: 'PAGO', sortable: 'true', width: '5rem'},
      { field: 'conta_pagamento', header: 'DT. PGTO.', sortable: 'true', width: '6rem'},
      { field: 'conta_tipo', header: 'TIPO', sortable: 'true', width: '100px'},
      { field: 'conta_observacao', header: 'OBSERVAÇÃO', sortable: 'false', width: '500px'}
    ];
    if (this.aut.solicitacaoVersao < 3) {
      this.ct.tabela.selectedColumns.push({ field: 'conta_local_nome', header: 'NÚCLEO', sortable: 'true', width: '200px'})
    }
  }

  resetColunas() {
    this.ct.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.ct.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.ct.tabela.mostraSeletor = false;
  }

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    if (this.ct.titulos === undefined || this.ct.titulos === null || (Array.isArray(this.ct.titulos) && this.ct.titulos.length === 0)) {
      this.ct.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaMenuContexto() {
    this.contextoMenu = [
      {
        label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {
          if (this.btnExpandirVF && !this.ct.expandidoSN) {
            this.contaDetalheCompleto(this.ct.Contexto);
          }
        }
      }];

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.contabilidade_alterar) {
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            if (this.btnExpandirVF && !this.ct.expandidoSN) {
              this.contaAlterar(this.ct.Contexto, this.ct.idx);
            }
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.contabilidade_apagar) {
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            if (this.btnExpandirVF && !this.ct.expandidoSN) {
              this.contaApagar(this.ct.idx, this.ct.Contexto);
            }
          }
        });
    }
  }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.ct.tabela.sortField !== event.sortField) {
      this.ct.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.ct.tabela.first !== +event.first) {
      this.ct.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.ct.tabela.rows !== +event.rows) {
      this.ct.tabela.rows = +event.rows;
      ct++;
    }
    if (this.ct.tabela.sortOrder !== +event.sortOrder) {
      this.ct.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.ct.lazy = true;
      this.ct.contaBusca();
    }
  }

  contaIncluir(): void {
    if (this.aut.contabilidade_incluir || this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) {
      this.cfs.acao = 'incluir2';
      this.cfs.criaFormIncluir()
      this.ct.showForm = true;
    }
  }

  contaDetalheCompleto(cta: ContaI) {
    this.showDetalhe = true;
    this.contaDetalhe = cta;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.contaDetalhe = null;
  }

  contaAlterar(cta: ContaI, idx: number) {
    if (this.aut.contabilidade_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.ct.idx = idx;
      this.cfs.acao = 'alterar';
      this.cfs.parceContaForm(cta);
      this.ct.showForm = true;
    }
  }

  contaApagar(idx: number, cta: ContaI) {
    this.ct.idx = idx;
    if (this.permissaoArquivo(cta.conta_arquivos.length) || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      if (cta.conta_parcelas !== undefined && cta.conta_parcelas !== null && cta.conta_parcelas > 1) {
        this.apagarParceleas = cta.conta_parcelas - 1;
        this.apagarTipo = 2;
      } else {
        this.apagarTipo = 1;
      }
      this.apagarId = cta.conta_id;
      this.showApagar = true;
    }
  }

  acaoApagar(n: number) {
      this.sub.push(this.ct.excluirConta(this.apagarId, (n === 2))
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal',severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
            console.error(err);
            this.showApagar = false;
            this.apagarTipo = 1;
            this.apagarId = 0;
          },
          complete: () => {
            if (this.resp[0]) {
              if (n === 1) {
                this.ct.contas = this.ct.contas.filter(val => val.conta_id !== this.apagarId);
              }
              if (n === 2) {
                this.ct.contas = this.ct.contas.filter(val => val.conta_id !== this.resp[2].includes(val.conta_id));
              }
              this.dtb.toggleRow(this.ct.tabela.dadosExpandidosRaw.data, this.ct.tabela.dadosExpandidosRaw.originalEvent);
              this.ms.add({
                key: 'toastprincipal',
                severity: 'info',
                summary: 'LANÇAMENTO',
                detail: 'Registro apagado com sucesso.'
              });
              this.showApagar = false;
              this.apagarTipo = 1;
              this.apagarId = 0;
              this.apagarParceleas = 1;
              this.resp = [];
            } else {
              this.ms.add({key: 'toastprincipal',severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
              this.showApagar = false;
              this.apagarTipo = 1;
              this.apagarId = 0;
              this.apagarParceleas = 1;
              this.resp = [];
            }
          }
        })
      );

  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'hidden';
  }

  getColunas() {
    this.ct.colunas = this.cols.map(t => {
      return t.field;
    });
  }

  setCurrentClass(col: any, valor: string | number, conta_paga_id: number, conta_vencimento3: Date) {
    const esqdir: string = this.testeCss.indexOf(col.field) > -1 ? ' text-right' : ' text-left';
    const classe: string = (col.field === 'conta_paga') ? (+conta_paga_id === 2) ? 'status-1' : (+conta_paga_id === 0) ? (this.hoje > conta_vencimento3) ? 'status-2' : 'status-0 ' : 'status-3' : 'inherit';
    return classe + ' ' + esqdir;
  }

  setCurrentStyles(col: any) {
      return {
        'width': col.width,
        'padding-bottom': 0,
        'padding-top': '.3em',
        'text-align': (col.field === 'conta_id') ? 'center' : null
      }
  }

  contaIdVF(col: any): boolean {
    return (col.field === 'conta_id');
  }

  onRowEditInit(c: any, idx: number) {
    this.idx = idx;
    this.getWidth();
    this.contaEdit = {...c};
    this.editando = true;
    this.btnExpandirVF = false;
    this.botaoEnviarVF = false;
  }

  onNao(cta: ContaI) {
    cta.conta_pagamento3 = null;
    cta.conta_pagamento2 = null;
    cta.conta_pagamento = null;
    cta.conta_paga = 'NÃO';
  }

  onSim(cta: ContaI) {
    if (this.contaEdit.conta_pagamento === null) {
      const dt: DateTime = DateTime.now();
      cta.conta_pagamento3 = dt.toJSDate();
      cta.conta_pagamento2 = dt.toSQLDate();
      cta.conta_pagamento = dt.toFormat('dd/MM/yyyy');
    } else {
      cta.conta_pagamento = this.contaEdit.conta_pagamento;
      cta.conta_pagamento2 = this.contaEdit.conta_pagamento2;
      cta.conta_pagamento3 = this.contaEdit.conta_pagamento3;
    }
    cta.conta_paga = 'SIM';
  }

  onDa(cta: ContaI) {
    cta.conta_pagamento3 = cta.conta_vencimento3;
    cta.conta_pagamento2 = cta.conta_vencimento2;
    cta.conta_pagamento = cta.conta_vencimento;
    cta.conta_paga = 'DEBT. AUT.';
  }

  onRowEditSave(cta: ContaI) {
    if (!this.validaBtnVf(cta)) {
      this.botaoEnviarVF = true;
      this.btnExpandirVF = false;
      if (cta.conta_pagamento !== undefined && cta.conta_pagamento !== null) {
        cta.conta_pagamento3 = DateTime.fromFormat(cta.conta_pagamento, 'dd/MM/yyyy').toJSDate();
        cta.conta_pagamento2 = DateTime.fromFormat(cta.conta_pagamento, 'dd/MM/yyyy').toSQLDate();
      } else {
        cta.conta_pagamento = null;
        cta.conta_pagamento3 = null;
        cta.conta_pagamento2 = null;
      }
      if (+this.contaEdit.conta_valor !== +cta.conta_valor) {
        cta.conta_valor2 = +cta.conta_valor;
      }
      const conta: ContaI = cta;
      if (this.contaEdit.conta_pagamento !== conta.conta_pagamento || +this.contaEdit.conta_paga_id !== +conta.conta_paga_id || +this.contaEdit.conta_valor2 !== +conta.conta_valor) {
        this.sub.push(this.ct.putContaAlterarDatatable(
          conta.conta_id, conta.conta_valor2, conta.conta_paga_id, conta.conta_pagamento2)
          .pipe(take(1))
          .subscribe({
            next: (dados: any[]) => {
              this.resp = dados;
            },
            error: (err) => {
              this.ms.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ERRO ALTERAR',
                detail: this.resp[2]
              });
              console.error(err);
              this.onRowEditCancel(cta);
            },
            complete: () => {
              this.editando = false;
              if (this.resp[0]) {
                this.ct.contas[this.idx] = {...conta};
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'ALTERAR LANÇAMENTO',
                  detail: this.resp[2]
                });
                this.contaEdit = {};
                this.btnExpandirVF = true;
                this.botaoEnviarVF = false;
                this.idx = null;
                this.editando = false;
                this.setWidth();
                if (this.mostraSoma) {
                  this.mostraCalculo();
                }
              } else {
                console.error('ERRO - ALTERAR ', this.resp[2]);
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'warn',
                  summary: 'ATENÇÃO - ERRO',
                  detail: this.resp[2]
                });
                this.onRowEditCancel(cta);
              }
            }
          })
        );
      } else {
        this.onRowEditCancel(cta);
      }
    } else {
      this.onRowEditCancel(cta);
    }
  }

  onRowEditCancel(cta) {
    this.ct.contas[this.idx] = {...this.contaEdit};
    this.contaEdit = {};
    this.btnExpandirVF = true;
    this.botaoEnviarVF = false;
    this.idx = null;
    this.editando = false;
    this.setWidth();
  }

  formataValor(n: number): string {
    return this.formatterBRL.format(n);
  }

  // FUNCOES RELATORIOS=========================================================

  getWidth() {
    this.ct.tabela.selectedColumns[0].width = '7rem';

    this.valorIdx = this.ct.tabela.selectedColumns.findIndex(l => l.field === 'conta_valor');
    this.valorWidth = this.ct.tabela.selectedColumns[this.valorIdx].width;
    this.ct.tabela.selectedColumns[this.valorIdx].width = '13rem';

    this.pagaIdx = this.ct.tabela.selectedColumns.findIndex(l => l.field === 'conta_paga');
    this.pagaWidth = this.ct.tabela.selectedColumns[this.pagaIdx].width;
    this.ct.tabela.selectedColumns[this.pagaIdx].width = '15rem';

    this.pagamentoIdx = this.ct.tabela.selectedColumns.findIndex(l => l.field === 'conta_pagamento');
    this.pagamentoWidth = this.ct.tabela.selectedColumns[this.pagamentoIdx].width;
    this.ct.tabela.selectedColumns[this.pagamentoIdx].width = '13rem';
  }

  setWidth() {
    this.ct.tabela.selectedColumns[0].width = '2rem';
    this.ct.tabela.selectedColumns[this.valorIdx].width = this.valorWidth;
    this.ct.tabela.selectedColumns[this.pagaIdx].width = this.pagaWidth;
    this.ct.tabela.selectedColumns[this.pagamentoIdx].width = this.pagamentoWidth;

    this.pagaWidth = '';
    this.valorWidth = '';
    this.pagamentoWidth = '';
    this.pagaIdx = 0;
    this.valorIdx = 0;
    this.pagamentoIdx = 0;
  }

  mostraCalculo() {
    if (this.mostraSoma) {
      this.indexSoma = this.achaColunaSoma();
      if (this.indexSoma > 0) {
        let valor = 0;
        if (this.ct.selecionados.length > 0) {
          valor = this.ct.selecionados.reduce((a: number, b) => { return a + b.conta_valor2}, 0);
        } else {
          valor = this.ct.contas.reduce((a: number, b) => { return a + b.conta_valor2}, 0);
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
    this.indexAntes = this.ct.tabela.selectedColumns.findIndex(l => l.field  === 'conta_valor') + 1;
    this.indexDepois = (this.indexAntes > 0) ? this.ct.tabela.selectedColumns.length - this.indexAntes : this.ct.tabela.selectedColumns.length;
    return this.indexAntes;
  }

  valido() {
    const b = document.getElementById('btncancel');
    b.focus();
  }

  validaBtnVf(cta: ContaI): boolean {
    if (+cta.conta_paga_id === +this.contaEdit.conta_paga_id && cta.conta_pagamento === this.contaEdit.conta_pagamento && +cta.conta_valor === +this.contaEdit.conta_valor) {
      return true;
    }
    if (+cta.conta_paga_id === 1 && (cta.conta_valor === null || cta.conta_valor === 0)) {
      return true;
    }
    if (+cta.conta_paga_id === 1 && cta.conta_pagamento === null) {
      return true;
    }
    if (+cta.conta_paga_id === 2 && (cta.conta_valor === null || cta.conta_valor === 0)) {
      return true;
    }
    if (+cta.conta_paga_id === 2 && cta.conta_pagamento === null) {
      return true;
    }
    if (+cta.conta_paga_id === 0 && cta.conta_valor === null) {
      return true;
    }
    if (+cta.conta_paga_id === 0 && cta.conta_pagamento !== null) {
      return true;
    }
    return false;
  }

  permissaoArquivo(n: number): boolean {
    if (n > 0) {
      return this.aut.contabilidade_apagar && this.aut.arquivos_apagar;
    }
    if (n === 0) {
      return this.aut.contabilidade_apagar;
    }
  }

  ngOnDestroy(): void {
    this.ct.selecionados = [];
    this.sub.forEach(s => s.unsubscribe());
  }

}
