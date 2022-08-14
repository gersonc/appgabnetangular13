import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { WindowsService } from '../../_layout/_service';
import {AuthenticationService, MenuInternoService} from '../../_services';
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {ContaService} from "../_services/conta.service";
import {ContaDropdown} from "../_models/conta-dropdown";
import {ContaI} from "../_models/conta-i";
import {ContaFormService} from "../_services/conta-form.service";
import {DateTime} from "luxon";

@Component({
  selector: 'app-conta-datatable',
  templateUrl: './conta-datatable.component.html',
  styleUrls: ['./conta-datatable.component.css'],
  providers: [ MessageService ]
})
export class ContaDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: any;
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





  botaoEnviarVF = false;
  btnExpandirVF = true;
  editando = false;
  conta_id: number | null = null;
  conta_paga_id: number | null = null;
  conta_pagamento3: Date | null = null;
  conta_pagamento2: string | null = null;
  conta_pagamento: string | null = null;
  idx: number | null = null;
  mostraSoma = false;
  indexSoma: number | null = null;
  soma: string | null = null;
  indexAntes: number | null = null;
  indexDepois: number | null = null;
  btnInativo = false;
  contaEdit?: ContaI = {};

  liberaGravar = false;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private cf: ConfirmationService,
    public md: MenuDatatableService,
    private messageService: MessageService,
    public ct: ContaService,
    private cfs: ContaFormService,
    private cd: ContaDropdown
  ) {
  }

  ngOnInit() {
    if (this.ct.selecionados === undefined || this.ct.selecionados === null || !Array.isArray(this.ct.selecionados)) {
      this.ct.selecionados = [];
    }

    this.montaColunas();

    if (!this.ct.stateSN) {
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
      { field: 'conta_id', header: 'ID', sortable: 'true', width: '7rem'},
      { field: 'conta_cedente', header: 'CEDENTE', sortable: 'true', width: '300px'},
      { field: 'conta_vencimento', header: 'DT. VENC.', sortable: 'true', width: '120px'},
      { field: 'conta_valor', header: 'VALOR', sortable: 'true', width: '100px'},
      { field: 'conta_paga', header: 'PAGO', sortable: 'true', width: '10rem'},
      { field: 'conta_pagamento', header: 'DT. PGTO.', sortable: 'true', width: '10rem'},
      { field: 'conta_debito_automatico', header: 'DBTO. AUT.', sortable: 'true', width: '120px'},
      { field: 'conta_tipo', header: 'TIPO', sortable: 'true', width: '100px'},
      { field: 'conta_local_nome', header: 'NÚCLEO', sortable: 'true', width: '200px'},
      { field: 'conta_observacao', header: 'OBSERVAÇÃO', sortable: 'false', width: '500px'}
    ];
  }

  resetSelectedColumns(): void {
    this.ct.criaTabela();
    this.ct.tabela.selectedColumns = [
      { field: 'conta_cedente', header: 'CEDENTE', sortable: 'true', width: '300px'},
      { field: 'conta_vencimento', header: 'DT. VENC.', sortable: 'true', width: '120px'},
      { field: 'conta_valor', header: 'VALOR', sortable: 'true', width: '100px'},
      { field: 'conta_paga', header: 'PAGO', sortable: 'true', width: '10rem'},
      { field: 'conta_pagamento', header: 'DT. PGTO.', sortable: 'true', width: '10rem'},
      { field: 'conta_debito_automatico', header: 'DBTO. AUT.', sortable: 'true', width: '120px'},
      { field: 'conta_tipo', header: 'TIPO', sortable: 'true', width: '100px'},
      { field: 'conta_observacao', header: 'OBSERVAÇÃO', sortable: 'false', width: '500px'}
    ];
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
          this.contaDetalheCompleto(this.ct.Contexto);
        }
      }];

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.solicitacao_alterar) {
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.contaAlterar(this.ct.Contexto, this.ct.idx);
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.solicitacao_apagar) {
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.contaApagar(this.ct.idx, this.ct.Contexto);
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
      this.cfs.acao = 'incluir';
      this.cfs.criaFormIncluir()
      this.ct.showForm = true;
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  contaDetalheCompleto(tel: ContaI) {
    this.showDetalhe = true;
    this.contaDetalhe = tel;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.contaDetalhe = null;
  }

  contaAlterar(tel: ContaI, idx: number) {
    if (this.aut.contabilidade_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.ct.idx = idx;
      this.cfs.acao = 'alterar';
      this.cfs.parceContaForm(tel);
      this.ct.showForm = true;
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  contaApagar(idx: number, cta: ContaI) {
    this.ct.idx = idx;
    if (this.aut.contabilidade_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {

      this.cf.confirm({
        message: '<b>Você confirma apagar este registro?</b>',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.sub.push(this.ct.excluirConta(cta.conta_id)
            .pipe(take(1))
            .subscribe({
              next: (dados) => {
                this.resp = dados;
              },
              error: (err) => {
                this.messageService.add({severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
                console.error(err);
              },
              complete: () => {
                if (this.resp[0]) {
                  this.ct.contas.splice(this.ct.idx, 1);
                  this.messageService.add({
                    severity: 'info',
                    summary: 'TELEFONEMA',
                    detail: 'Registro apagado com sucesso.'
                  });
                } else {
                  this.messageService.add({severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
                }
              }
            })
          );
        },
        reject: (type) => {
        }
      });

    } else {
      console.log('SEM PERMISSAO');
    }

  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'p-d-none';
  }



  getColunas() {
    this.ct.colunas = this.cols.map(t => {
      return t.field;
    });
  }











  setCurrentStyles(col: any, valor: string | number) {
    const tmp = ['conta_vencimento', 'conta_valor', 'conta_pagamento'];
    // CSS styles: set per current state of component properties
    return {
      'text-align': tmp.indexOf(col.field) > -1 ? 'right' : 'left',
      'background-color': col.field === 'conta_paga' && valor === 'NÃO' ? 'var(--atencao)' : 'inherit',
      'width':   col.width,
      'padding-bottom': 0,
      'padding-top': '.3em'
    };
  }

  onEditInit(ev) {
    console.log('bbbbbb', ev);
  }

  onRowEditInit(c: any, rowIndex: number) {
    this.contaEdit = {...c};
    console.log('onRowEditInit', this.contaEdit, rowIndex);
    this.btnExpandirVF = false;
    if (this.editando === false) {
      this.idx = rowIndex;
      this.conta_id = c.conta_id;
      this.conta_paga_id = c.conta_paga_id;
      this.conta_pagamento3 = c.conta_pagamento3


      this.editando = true;
    }
  }


  onRowEditSave(cta: ContaI, rowIndex: number) {
    console.log('onRowEditSave', cta);
    console.log('this.contaEdit', this.contaEdit);
    console.log('conta_paga_id', this.conta_paga_id);
    console.log('conta_pagamento3', this.conta_pagamento3);
    console.log('conta_pagamento', this.conta_pagamento);
    console.log('conta_paga_id', this.conta_paga_id);
    console.log('conta_id', this.conta_id);
    console.log('idx', this.idx);
    if ((this.conta_paga_id !== null && this.conta_pagamento3 !== null) && (+this.conta_paga_id !== +this.contaEdit.conta_paga_id || this.conta_pagamento3 !== this.contaEdit.conta_pagamento3)) {
      if (this.conta_pagamento3 !== null && this.conta_pagamento3 !== this.contaEdit.conta_pagamento3) {
        this.conta_pagamento = DateTime.fromJSDate(this.conta_pagamento3).setZone('America/Sao_Paulo').toFormat('dd/LL/yyyy');
        cta.conta_pagamento = this.conta_pagamento;
        cta.conta_paga = (+this.conta_paga_id === 0) ? 'NÃO' : 'SIM';
        this.conta_pagamento2 = DateTime.fromJSDate(this.conta_pagamento3).setZone('America/Sao_Paulo').toSQLDate();
      }
      this.sub.push(this.ct.putContaAlterarDatatable(
        this.conta_id, this.conta_paga_id, this.conta_pagamento)
        .pipe(take(1))
        .subscribe({
          next: (dados: any[]) => {
            this.resp = dados;
          },
          error: (err) => {
            this.btnExpandirVF = true;
            this.botaoEnviarVF = false;
            this.messageService.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ERRO ALTERAR',
              detail: this.resp[2]
            });
            console.log(err);
            this.editando = false;
            this.conta_id = null;
            this.conta_paga_id = null;
            this.conta_pagamento3 = null;
            this.conta_pagamento = null;
            this.idx = null;
          },
          complete: () => {
            this.editando = false;
            if (this.resp[0]) {
              this.contaEdit.conta_paga_id = this.conta_paga_id;
              this.contaEdit.conta_paga = (+this.conta_paga_id === 0) ? 'NÃO' : 'SIM';
              this.contaEdit.conta_pagamento3 = this.conta_pagamento3;
              this.contaEdit.conta_pagamento2 = this.conta_pagamento2;
              this.ct.contas[this.idx] = this.contaEdit;
              this.messageService.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'ALTERAR LANÇAMENTO',
                detail: this.resp[2]
              });
              this.btnExpandirVF = true;
              this.botaoEnviarVF = false;
            } else {
              this.botaoEnviarVF = false;
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.messageService.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
            this.conta_id = null;
            this.conta_paga_id = null;
            this.conta_pagamento3 = null;
            this.conta_pagamento2 = null;
            this.conta_pagamento = null;
            this.idx = null;
          }
        })
      );
    }
  }

  onRowEditCancel(cta, rowIndex) {
    this.btnExpandirVF = true;
    this.editando = false;
    this.conta_id = null;
    this.conta_paga_id = null;
    this.conta_pagamento3 = null;
    this.conta_pagamento2 = null;
    this.conta_pagamento = null;
    this.idx = null;
  }



  // FUNCOES RELATORIOS=========================================================





  mostraCalculo() {
    if (this.mostraSoma) {
      this.indexSoma = this.achaColunaSoma();
      if (this.indexSoma > 0) {
        let valor = 0;
        if (this.ct.selecionados.length > 0) {
          this.ct.selecionados.forEach((d: ContaI) => {
            valor += +d.conta_valor2;
          });
        } else {
          this.ct.contas.forEach((d: ContaI) => {
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
    const b = this.ct.tabela.selectedColumns.length;
    for (let i = 0; i < b; i++) {
      if (this.ct.tabela.selectedColumns[i].field === 'conta_valor') {
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




  /*escondeDetalhe() {
    this.showDetalhe = false;
  }*/

  ngOnDestroy(): void {
    this.ct.selecionados = [];
    this.sub.forEach(s => s.unsubscribe());
  }

}
