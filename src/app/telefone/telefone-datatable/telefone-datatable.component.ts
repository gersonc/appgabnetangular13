import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConfirmationService, LazyLoadEvent, MenuItem, MessageService} from 'primeng/api';
import {WindowsService} from '../../_layout/_service';
import {TelefoneFormService} from "../_services/telefone-form.service";
import {TelefoneService} from "../_services/telefone.service";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {take} from "rxjs/operators";
import {TelefoneInterface} from "../_models/telefone";


@Component({
  selector: 'app-telefone-datatable',
  templateUrl: './telefone-datatable.component.html',
  styleUrls: ['./telefone-datatable.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class TelefoneDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: any;
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  showDetalhe = false;
  telefoneDetalhe?: TelefoneInterface;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  idx = -1;
  acaoTelefone = '';
  cssMostra: string | null = null;
  resp: any[] = [];

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private cf: ConfirmationService,
    public md: MenuDatatableService,
    private messageService: MessageService,
    public ts: TelefoneService,
    public tfs: TelefoneFormService,

  ) {
  }

  ngOnInit() {
    if (this.ts.selecionados === undefined || this.ts.selecionados === null || !Array.isArray(this.ts.selecionados)) {
      this.ts.selecionados = [];
    }

    this.montaColunas();

    if (!this.ts.stateSN) {
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
          this.ts.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.ts.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ts.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ts.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ts.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ts.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.ts.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.ts.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ts.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ts.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.ts.busca$.subscribe(
      () => {
        if (this.ts.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.ts.busca.todos = false;
      }
    ));

    this.getColunas();
  }

  montaColunas() {
    this.cols = [
      {field: 'telefone_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'telefone_data', header: 'DATA E HORA', sortable: 'true', width: '200px'},
      {field: 'telefone_para', header: 'PARA', sortable: 'true', width: '300px'},
      {field: 'telefone_de', header: 'DE', sortable: 'true', width: '300px'},
      {field: 'telefone_assunto', header: 'ASSUNTO', sortable: 'true', width: '300px'},
      {field: 'telefone_ddd', header: 'DDD', sortable: 'true', width: '150px'},
      {field: 'telefone_telefone', header: 'TELEFONE', sortable: 'true', width: '200px'},
      {field: 'telefone_local_nome', header: 'NÚCLEO', sortable: 'true', width: '250px'},
      {field: 'telefone_tipo_nome', header: 'TIPO', sortable: 'true', width: '150px'},
      {field: 'telefone_resolvido', header: 'RESOLVIDO', sortable: 'true', width: '150px'},
      {field: 'telefone_usuario_nome', header: 'ATENDENTE', sortable: 'true', width: '200px'},
      {field: 'telefone_observacao', header: 'OBSERVAÇÃO', sortable: 'false', width: '500px'}
    ];
  }

  resetSelectedColumns(): void {
    this.ts.criaTabela();
    this.ts.tabela.selectedColumns = [
      {field: 'telefone_data', header: 'DATA E HORA', sortable: 'true', width: '200px'},
      {field: 'telefone_para', header: 'PARA', sortable: 'true', width: '300px'},
      {field: 'telefone_de', header: 'DE', sortable: 'true', width: '300px'},
      {field: 'telefone_assunto', header: 'ASSUNTO', sortable: 'true', width: '300px'},
      {field: 'telefone_ddd', header: 'DDD', sortable: 'true', width: '150px'},
      {field: 'telefone_telefone', header: 'TELEFONE', sortable: 'true', width: '200px'},
      {field: 'telefone_resolvido', header: 'RESOLVIDO', sortable: 'true', width: '150px'}
    ];
  }

  resetColunas() {
    this.ts.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.ts.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.ts.tabela.mostraSeletor = false;
  }


  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    if (this.ts.titulos === undefined || this.ts.titulos === null || (Array.isArray(this.ts.titulos) && this.ts.titulos.length === 0)) {
      this.ts.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaMenuContexto() {
    this.contextoMenu = [
      {
        label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {
          this.telefoneDetalheCompleto(this.ts.Contexto);
        }
      }];

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.solicitacao_alterar) {
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.telefoneAlterar(this.ts.Contexto, this.ts.idx);
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.solicitacao_apagar) {
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.telefoneApagar(this.ts.idx, this.ts.Contexto);
          }
        });
    }
  }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.ts.tabela.sortField !== event.sortField) {
      this.ts.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.ts.tabela.first !== +event.first) {
      this.ts.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.ts.tabela.rows !== +event.rows) {
      this.ts.tabela.rows = +event.rows;
      ct++;
    }
    if (this.ts.tabela.sortOrder !== +event.sortOrder) {
      this.ts.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.ts.lazy = true;
      this.ts.telefoneBusca();
    }
  }

  telefoneIncluir(): void {
    if (this.aut.telefone_incluir || this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) {
      this.tfs.acao = 'incluir';
      this.tfs.criaFormIncluir()
      this.ts.showForm = true;
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  telefoneDetalheCompleto(tel: TelefoneInterface) {
    this.showDetalhe = true;
    this.telefoneDetalhe = tel;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.telefoneDetalhe = null;
  }

  telefoneAlterar(tel: TelefoneInterface, idx: number) {
    if (this.aut.telefone_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.ts.idx = idx;
      this.tfs.acao = 'alterar';
      this.tfs.parceTelefoneForm(tel);
      this.ts.showForm = true;
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  telefoneApagar(idx: number, tel: TelefoneInterface) {
    this.ts.idx = idx;
    if (this.aut.telefone_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {

      this.cf.confirm({
        message: '<b>Você confirma apagar este registro?</b>',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.sub.push(this.ts.excluirTelefone(tel.telefone_id)
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
                  this.ts.telefones.splice(this.ts.idx, 1);
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

  ngOnDestroy(): void {
    this.ts.selecionados = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  getColunas() {
    this.ts.colunas = this.cols.map(t => {
      return t.field;
    });
  }


}
