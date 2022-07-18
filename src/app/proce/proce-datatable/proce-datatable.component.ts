import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {HistFormI, HistI, HistListI} from "../../hist/_models/hist-i";
import {WindowsService} from "../../_layout/_service";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {ProceListarI} from "../_model/proce-listar-i";
import {ProceService} from "../_services/proce.service";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {ProceFormService} from "../_services/proce-form.service";
import {Stripslashes} from "../../shared/functions/stripslashes";


@Component({
  selector: 'app-proce-datatable',
  templateUrl: './proce-datatable.component.html',
  styleUrls: ['./proce-datatable.component.css']
})

export class ProceDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: any;
  altura = `${WindowsService.altura - 150}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  authAlterar = false;
  authAnalisar = false;
  authApagar = false;
  authIncluir = false;
  showDetalhe = false;
  proDetalhe?: ProceListarI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  histListI: HistListI;
  showHistorico = false;
  tituloHistoricoDialog = 'ANDAMENTOS';
  histAcao: string = '';
  histFormI?: HistFormI;
  cssMostra: string | null = null;
  permListHistSol: boolean = false;
  permInclHistSol: boolean = false;
  permListHist: boolean = false;
  permInclHist: boolean = false;
  permitirAcao: boolean = true;
  idx: number = 0;

  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    public md: MenuDatatableService,
    public ps: ProceService,
    public pfs: ProceFormService,
  ) {
  }

  ngOnInit() {
    this.permListHist = (this.aut.processo_listar || this.aut.historico_incluir || this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn);
    this.permInclHist = (this.aut.historico_incluir || this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn);
    this.permListHistSol  = (this.aut.processo_listar || this.aut.historico_incluir || this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || (this.aut.usuario_responsavel_sn || this.permListHist));
    this.permInclHistSol = (this.aut.historico_solicitacao_incluir || this.aut.historico_solicitacao_alterar || this.aut.solicitacao_analisar || (this.aut.usuario_responsavel_sn || this.permInclHist));

    this.montaColunas();

    if (!this.ps.stateSN) {
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
          this.ps.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.ps.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          ;
          this.ps.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.ps.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ps.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.ps.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.ps.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.ps.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ps.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.ps.exportToXLSX(3);
        }
      }
    ];

    this.montaMenuContexto();

    this.sub.push(this.ps.busca$.subscribe(() => {
        if (this.ps.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.ps.busca.todos = false;
      }
    ));

  }

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
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

  montaColunas() {
    this.cols = [
      {field: 'processo_id', header: 'ID', sortable: 'true', width: '60px'},
      {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', width: '150px'},
      {field: 'processo_status_nome', header: 'STATUS', sortable: 'true', width: '150px'},
      {field: 'solicitacao_situacao', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},

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
      {
        field: 'oficio_protocolante_funcionario',
        header: 'OF. ORG. PROT. FUNCIONÁRIO',
        sortable: 'true',
        width: '300px'
      },
      {field: 'oficio_prazo', header: 'OF. PRAZO', sortable: 'true', width: '200px'},
      {field: 'oficio_tipo_andamento_nome', header: 'OF. TIPO ANDAMENTO', sortable: 'true', width: '200px'},
      {field: 'oficio_status_nome', header: 'OF. SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'oficio_valor_solicitado', header: 'OF. VL. SOLICITADO', sortable: 'true', width: '200px'},
      {field: 'oficio_valor_recebido', header: 'OF. VL. RECEBIDO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_pagamento', header: 'OF. DT. PAGAMENTO', sortable: 'true', width: '200px'},
      {field: 'oficio_data_empenho', header: 'OF. DT. EMPENHO', sortable: 'true', width: '200px'},

      /*{field: 'oficio', header: 'OFÍCIOS', sortable: 'false', width: '300px'},*/

      {field: 'historico_data', header: 'HIST. PROC. DT.', sortable: 'true', width: '200px'},
      {field: 'historico_andamento', header: 'HIST. PROC. ANDAMENTO', sortable: 'false', width: '400px'},
      {field: 'historico_solicitacao_data', header: 'HIST. SOL.. DT.', sortable: 'true', width: '200px'},
      {field: 'historico_solicitacao_andamento', header: 'HIST. SOL. ANDAMENTO', sortable: 'false', width: '400px'},

    ];
  }

  resetSelectedColumns(): void {
    this.ps.criaTabela();
    this.ps.tabela.selectedColumns = [
      {field: 'processo_numero', header: 'Nº PROCESSO', sortable: 'true', width: '150px'},
      {field: 'processo_status_nome', header: 'STATUS', sortable: 'true', width: '150px'},
      {field: 'solicitacao_situacao', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
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

  resetColunas() {
    this.ps.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.ps.tabela.mostraSeletor = true;
  }

  hideSeletor(): void {
    this.ps.tabela.mostraSeletor = false;
  }

  rowColor(field: string, vl1: number, vl2: string, vl3: string | number): string | null {
    if (field !== 'processo_status_nome' && field !== 'solicitacao_status_nome' && field !== 'solicitacao_situacao') {
      return null;
    }
    if (field === 'processo_status_nome') {
      return (typeof vl1 === 'undefined' || vl1 === null || vl1 === 0) ? 'status-0' : 'status-' + vl1;
    }
    if (field === 'solicitacao_status_nome') {
      switch (vl2) {
        case 'EM ABERTO':
          return 'status-0';
        case 'EM ANDAMENTO':
          return 'status-1';
        case 'INDEFERIDO':
          return 'status-2';
        case 'DEFERIDO':
          return 'status-3';
        case 'SUSPENSO':
          return 'status-4';
        default:
          return null;
      }
    }
    switch (vl3) {
      case 'EM ABERTO':
        return 'situacao-0';
      case 'EM ANDAMENTO':
        return 'situacao-1';
      case 'CONCLUIDA':
        return 'situacao-2';
      case 'SUSPENSO':
        return 'situacao-3';
      default:
        return null;
    }
  }

  montaMenuContexto() {
    this.contextoMenu = [
      {
        label: 'DETALHES',
        icon: 'pi pi-eye',
        style: {'font-size': '1em'},
        command: () => {
          this.processoDetalheCompleto(this.ps.Contexto);
        },
        styleClass: 'context-menu-verde'
      }];
    if (this.aut.processo_deferir ||
      this.aut.processo_indeferir ||
      this.aut.usuario_responsavel_sn
    ) {
      this.authAnalisar = true;
      this.contextoMenu.push(
        {
          label: 'ANALISAR', icon: 'pi pi-check-square', style: {'font-size': '1em'},
          command: () => {
            this.processoAnalisarCtx();
          },
          styleClass: 'context-menu-amarelo'
        });
    }

    if (this.aut.processo_apagar || this.aut.usuario_responsavel_sn) {
      this.authApagar = true;
      this.contextoMenu.push(
        {
          label: 'APAGAR',
          icon: 'pi pi-trash',
          style: {'font-size': '1em'},
          command: () => {
            this.processoApagar(this.ps.Contexto);
          },
          styleClass: 'context-menu-vermelho',
        });
    }

  }

  // EVENTOS ===================================================================

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    if (this.ps.tabela.sortField !== event.sortField) {
      this.ps.tabela.sortField = event.sortField;
    }
    if (this.ps.tabela.first !== +event.first) {
      this.ps.tabela.first = +event.first;
    }
    if (event.rows !== undefined && this.ps.tabela.rows !== +event.rows) {
      this.ps.tabela.rows = +event.rows;
    }
    if (this.ps.tabela.sortOrder !== +event.sortOrder) {
      this.ps.tabela.sortOrder = +event.sortOrder;
    }
    this.ps.lazy = true;
    this.ps.proceBusca();
  }

  onStateSave(ev) {
    // this.ps.setState()
  }

  processoDetalheCompleto(pro) {
    this.showDetalhe = true;
    this.proDetalhe = pro;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.proDetalhe = null;
  }

  //  HISTIRICO - ANDAMENTO ***********************************************************

  historicoAcao(registro_id: number, acao: string, modulo: string, idx: number, permitirAcao: boolean = true, historicos?: HistI[]) {
    this.tituloHistoricoDialog = (modulo === 'solicitacao') ? 'SOLICITAÇÃO - ' : 'PROCESSO - ';
    this.tituloHistoricoDialog += acao.toUpperCase() + ' ANDAMENTOS';
    this.histAcao = acao;
    console.log('permitirAcao', permitirAcao);
    this.permitirAcao = permitirAcao;
    if (acao === 'listar') {
      this.histListI = {
        hist: historicos,
        idx: idx,
        registro_id: registro_id,
        modulo: modulo
      }
      this.ps.montaHistorico(modulo, idx);
    }
    if (acao === 'incluir') {
      this.histFormI = {
        idx: idx,
        acao: acao,
        modulo: modulo,
        hist: {
          historico_solicitacao_id: (modulo === 'solicitacao') ? registro_id : undefined,
          historico_processo_id: (modulo === 'processo') ? registro_id : undefined,
        }
      }
    }
    this.showHistorico = true;
    this.mostraDialog(true);
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'p-d-none';
  }

  recebeRegistro(h: HistFormI) {
    this.ps.recebeRegistro(h);
  }

  processoApagar(pro: ProceListarI) {
    if (this.aut.processo_apagar) {
      this.ps.procApagar = pro;
      this.ps.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/proce/apagar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  processoAnalisar(pro) {
    if (this.aut.processo_analisar) {
      this.ps.salvaState();
      this.dtb.saveState();
      this.pfs.acao = 'analisar';
      this.pfs.parseListagemAnalisarForm(pro);
      this.router.navigate(['/proce/analisar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  processoAnalisarCtx() {
    if (this.ps.Contexto.processo_status_id === 1 || this.ps.Contexto.processo_status_id === 4) {

    }
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
