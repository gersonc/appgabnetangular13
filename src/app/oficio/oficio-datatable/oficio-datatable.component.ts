import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {OficioListarI} from "../_models/oficio-listar-i";
import {WindowsService} from "../../_layout/_service";
import {OficioFormService} from "../_services/oficio-form.service";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {OficioService} from "../_services/oficio.service";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";

@Component({
  selector: 'app-oficio-datatable',
  templateUrl: './oficio-datatable.component.html',
  styleUrls: ['./oficio-datatable.component.css']
})
export class OficioDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: any;
  altura = `${WindowsService.altura - 150}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  authAlterar = false;
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;
  showDetalhe = false;
  ofiDetalhe?: OficioListarI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  showGrafico = false;


  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    public md: MenuDatatableService,
    public os: OficioService,
    private ofs: OficioFormService
  ) { }

  ngOnInit() {

    this.montaColunas();

    if (!this.os.stateSN) {
      this.resetSelectedColumns();
    }

    this.itemsAcao = [
      {
        label: 'Graficos', icon: 'pi pi-chart-line', style: {'font-size': '.9em'}, command: () => {
          this.showGrafico = true;
        }
      },
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
          this.os.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.os.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.os.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.os.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.os.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.os.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.os.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.os.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.os.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.os.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.os.busca$.subscribe(
      () => {
        if (this.os.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.os.busca.todos = false;
      }
    ));
  }

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    if (this.os.titulos === undefined || this.os.titulos === null || (Array.isArray(this.os.titulos) && this.os.titulos.length === 0)) {
      this.os.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaColunas() {
    this.cols = [
      {field: 'oficio_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'oficio_processo_numero', header: 'Nº PROCESSO', sortable: 'true', width: '150px'},
      {field: 'oficio_codigo', header: 'CODIGO', sortable: 'true', width: '150px'},
      {field: 'oficio_convenio', header: 'CONVENIO', sortable: 'true', width: '150px'},
      {field: 'oficio_status_nome', header: 'SITUAÇÃO', sortable: 'true', width: '200px'},
      {field: 'oficio_numero', header: 'NÚMERO', sortable: 'true', width: '150px'},
      {field: 'solicitacao_reponsavel_analize_nome', header: 'RESP. ANALISE', sortable: 'true', width: '200px'},
      {field: 'oficio_data_emissao', header: 'DT. EMISSÃO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_empenho', header: 'DT. EMPENHO', sortable: 'true', width: '200px'},
      {field: 'oficio_tipo_solicitante_nome', header: 'TP. SOLICITANTE', sortable: 'true', width: '250px'},
      {field: 'oficio_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '300px'},
      {field: 'oficio_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '300px'},
      {field: 'oficio_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '300px'},
      {field: 'oficio_area_interesse_nome', header: 'ÁREA DE INTERESSE', sortable: 'true', width: '300px'},
      {field: 'oficio_orgao_solicitado_nome', header: 'ORG. SOLICITADO', sortable: 'true', width: '300px'},
      {field: 'oficio_orgao_protocolante_nome', header: 'ORG. PROTOCOLANTE', sortable: 'true', width: '300px'},
      {field: 'oficio_protocolo_numero', header: 'Nº PROTOCOLO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_protocolo', header: 'DT. PROTOCOLO', sortable: 'true', width: '200px'},
      {field: 'oficio_protocolante_funcionario', header: 'PROTOCOLO FUNCIONÁRIO', sortable: 'true', width: '300px'},
      {field: 'oficio_descricao_acao', header: 'DESCRIÇÃO DA AÇÃO', sortable: 'true', width: '400px'},
      {field: 'oficio_solicitacao_descricao', header: 'DESCRIÇÃO DA SOLICITAÇÃO', sortable: 'true', width: '400px'},
      {field: 'solicitacao_local_nome', header: 'NÚCLEO', sortable: 'true', width: '250px'},
      {field: 'oficio_valor_solicitado', header: 'VL. SOLICITADO', sortable: 'true', width: '200px'},
      {field: 'oficio_valor_recebido', header: 'VL. RECEBIDO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_pagamento', header: 'DT. PAGAMENTO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_recebimento', header: 'DT. RECEBIMENTO', sortable: 'true', width: '200px'},
      {field: 'oficio_prazo', header: 'PRAZO', sortable: 'true', width: '200px'},
      {field: 'oficio_prioridade_nome', header: 'PRIORIDADE', sortable: 'true', width: '230px'},
      {field: 'oficio_tipo_andamento_nome', header: 'TP. ANDAMENTO', sortable: 'true', width: '150px'},
      {field: 'oficio_tipo_recebimento_nome', header: 'TP. RECEBIMENTO', sortable: 'true', width: '150px'}
    ];
  }

  resetSelectedColumns(): void {
    this.os.criaTabela();
    this.os.tabela.selectedColumns = [
      {field: 'oficio_processo_numero', header: 'Nº PROCESSO', sortable: 'true', width: '150px'},
      {field: 'oficio_status_nome', header: 'SITUAÇÃO', sortable: 'true', width: '200px'},
      {field: 'oficio_codigo', header: 'CODIGO', sortable: 'true', width: '150px'},
      {field: 'oficio_numero', header: 'NÚMERO', sortable: 'true', width: '150px'},
      {field: 'oficio_cadastro_nome', header: 'SOLICITANTE', sortable: 'true', width: '300px'},
      {field: 'oficio_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '300px'},
      {field: 'oficio_assunto_nome', header: 'ASSUNTO', sortable: 'true', width: '300px'}
    ];
  }

  resetColunas() {
    this.os.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.os.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.os.tabela.mostraSeletor = false;
  }

  rowColor(field: string, vl1: number): string | null {
    if (field !== 'oficio_status_nome') {
      return null;
    }

    if (field === 'oficio_status_nome') {
      switch (vl1) {
        case 0:
          return 'status-1';
        case 1:
          return 'status-3';
        case 2:
          return 'status-2';
        default:
          return 'status-1';
      }
    }
  }

  montaMenuContexto() {
    this.contextoMenu = [
      {
        label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {
          this.oficioDetalheCompleto(this.os.Contexto);
        }
      }];

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.oficio_deferir || this.aut.oficio_indeferir) {
      this.authAnalisar = true;
      this.contextoMenu.push(
        {
          label: 'ANALISAR', icon: 'pi pi-exclamation-circle', style: {'font-size': '1em'},
          command: () => {
            this.oficioAnalisar(this.os.Contexto);
            console.log(this.os.Contexto);
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.oficio_alterar) {
      this.authAlterar = true;
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.oficioAlterar(this.os.Contexto);
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.oficio_apagar) {
      this.authApagar = true;
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.oficioApagar(this.os.Contexto);
          }
        });
    }
  }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.os.tabela.sortField !== event.sortField) {
      this.os.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.os.tabela.first !== +event.first) {
      this.os.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.os.tabela.rows !== +event.rows) {
      this.os.tabela.rows = +event.rows;
      ct++;
    }
    if (this.os.tabela.sortOrder !== +event.sortOrder) {
      this.os.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.os.lazy = true;
      this.os.oficioBusca();
    }
  }

  // FUNCOES DE BUSCA ==========================================================

  // FUNCOES DE CRUD ===========================================================

  oficioIncluir(): void {
    if (this.aut.oficio_incluir || this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) {
      this.ofs.acao = 'incluir';
      this.os.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/oficio/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  oficioDetalheCompleto(ofi: OficioListarI) {
    this.showDetalhe = true;
    this.ofiDetalhe = ofi;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.ofiDetalhe = null;
  }

  oficioAlterar(ofi: OficioListarI) {
    if (this.aut.oficio_alterar) {
      this.os.salvaState();
      this.dtb.saveState();
      this.ofs.acao = 'alterar';
      this.ofs.ofiListar = ofi;
      this.ofs.parceOficioFormulario(ofi);
      this.router.navigate(['/oficio/alterar']);
    } else {
      console.log('SEM PERMISSAO');
    }

  }

  oficioApagar(ofi: OficioListarI) {
    if (this.aut.solicitacao_apagar) {
      this.os.oficioApagar = ofi;
      this.ofs.acao = 'alterar';
      this.os.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/oficio/apagar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  oficioAnalisar(ofi: OficioListarI) {
    if (this.aut.solicitacao_analisar) {
      this.os.salvaState();
      this.dtb.saveState();
      this.os.oficioAnalisar = ofi;
      this.router.navigate(['/oficio/analisar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  hideGrafico(ev: boolean) {
    this.showGrafico = ev;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }





}
