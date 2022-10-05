import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewChecked,
  ContentChild,
  AfterContentInit,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { WindowsService } from '../../_layout/_service';
import {AuthenticationService, MenuInternoService} from '../../_services';
import {Stripslashes} from "../../shared/functions/stripslashes";
import {CadastroFormService} from "../_services/cadastro-form.service";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {CadastroService} from "../_services/cadastro.service";
import {CadastroI} from "../_models/cadastro-i";
import {ColunasI} from "../../_models/colunas-i";
import {Table} from "primeng/table/table";



@Component({
  selector: 'app-cadastro-datatable',
  templateUrl: './cadastro-datatable.component.html',
  styleUrls: ['./cadastro-datatable.component.css'],
  providers: [ DialogService ]
})
export class CadastroDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtb', {static: true}) public dtb: Table;
  // @ContentChild('dtb', {static: false}) public dtb: Table;
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  showDetalhe = false;
  mostraDetalhe= false;
  cadastroDetalhe?: CadastroI;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  mostraSeletor = false;
  cols: any[] = [];
  idx = -1;
  cssMostra: string | null = null;

  constructor(
    //private mm: MostraMenuService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public cfs: CadastroFormService,
    public cs: CadastroService,
    public md: MenuDatatableService,
    ) { }

  ngOnInit() {
    if (this.cs.selecionados === undefined || this.cs.selecionados === null || !Array.isArray(this.cs.selecionados)) {
      this.cs.selecionados = [];
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
          this.cs.exportToCsvTodos(true);
        }
      },
      {
        label: 'PDF - SELECIONADOS', icon: 'pi pi-file-pdf', style: {'font-size': '1em'}, command: () => {
          this.cs.tabelaPdf(1);
        }
      },
      {
        label: 'PDF - PÁGINA', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.cs.tabelaPdf(2);
        }
      },
      {
        label: 'PDF - TODOS', icon: 'pi pi-file-pdf', style: {'font-size': '.9em'}, command: () => {
          this.cs.tabelaPdf(3);
        }
      },
      {
        label: 'IMPRIMIR - SELECIONADOS', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.cs.imprimirTabela(1);
        }
      },
      {
        label: 'IMPRIMIR - PÁGINA', icon: 'pi pi-print', style: {'font-size': '1em'}, command: () => {
          this.cs.imprimirTabela(2);
        }
      },
      {
        label: 'IMPRIMIR - TODOS', icon: 'pi pi-print', style: {'font-size': '.9em'}, command: () => {
          this.cs.imprimirTabela(3);
        }
      },
      {
        label: 'EXCEL - SELECIONADOS', icon: 'pi pi-file-excel', style: {'font-size': '1em'}, command: () => {
          this.cs.exportToXLSX(1);
        }
      },
      {
        label: 'EXCEL - PÁGINA', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.cs.exportToXLSX(2);
        }
      },
      {
        label: 'EXCEL - TODOS', icon: 'pi pi-file-excel', style: {'font-size': '.9em'}, command: () => {
          this.cs.exportToXLSX(3);
        }
      }
    ];

    if (!this.cs.stateSN) {
      this.resetSelectedColumns();
    }

    this.montaMenuContexto();

    this.sub.push(this.cs.busca$.subscribe(
      () => {
        if (this.cs.tabela.titulos === undefined) {
          this.mapeiaColunas();
        }
        this.cs.busca.todos = false;
      }
    ));
    this.getColunas();
  }

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  mapeiaColunas() {
    if (this.cs.titulos === undefined || this.cs.titulos === null || (Array.isArray(this.cs.titulos) && this.cs.titulos.length === 0)) {
      this.cs.montaTitulos(this.cols.map(cl => {
        return cl.field
      }).slice(1));
    }
  }

  montaColunas() {
    this.cols = [
      {field: 'cadastro_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'cadastro_tipo_nome', header: 'TIPO', sortable: 'true', width: '200px'},
      {field: 'cadastro_tratamento_nome', header: 'TRATAMENTO', sortable: 'true', width: '160px'},
      {field: 'cadastro_nome', header: 'NOME / RAZÃO SOCIAL', sortable: 'true', width: '300px'},
      {field: 'cadastro_responsavel', header: 'EMPRESA / RESPONSÁVEL', sortable: 'true', width: '250px'},
      {field: 'cadastro_cargo', header: 'CARGO', sortable: 'true', width: '200px'},
      {field: 'cadastro_sigla', header: 'SIGLA', sortable: 'true', width: '100px'},
      {field: 'cadastro_apelido', header: 'APELIDO', sortable: 'true', width: '150px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '250px'},
      {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', width: '200px'},
      {field: 'cadastro_endereco', header: 'ENDEREÇO', sortable: 'false', width: '250px'},
      {field: 'cadastro_endereco_numero', header: 'END. NÚMERO', sortable: 'false', width: '160px'},
      {field: 'cadastro_endereco_complemento', header: 'END. COMPLEMENTO', sortable: 'false', width: '210px'},
      {field: 'cadastro_bairro', header: 'BAIRRO', sortable: 'true', width: '200px'},
      {field: 'cadastro_cep', header: 'CEP', sortable: 'false', width: '150px'},
      {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', width: '120px'},
      {field: 'cadastro_telefone', header: 'TELEFONE 1', sortable: 'false', width: '150px'},
      {field: 'cadastro_telefone2', header: 'TELEFONE 2', sortable: 'false', width: '150px'},
      {field: 'cadastro_telcom', header: 'TEL. COM.', sortable: 'false', width: '150px'},
      {field: 'cadastro_celular', header: 'CELULAR 1', sortable: 'false', width: '150px'},
      {field: 'cadastro_celular2', header: 'CELULAR 2', sortable: 'false', width: '150px'},
      {field: 'cadastro_fax', header: 'WHATSAPP', sortable: 'false', width: '120px'},
      {field: 'cadastro_email', header: 'E-MAIL', sortable: 'true', width: '250px'},
      {field: 'cadastro_email2', header: 'E-MAIL 2', sortable: 'true', width: '250px'},
      {field: 'cadastro_rede_social', header: 'FACEBOOK', sortable: 'false', width: '250px'},
      {field: 'cadastro_outras_midias', header: 'OUTRAS MÍDIAS', sortable: 'false', width: '250px'},
      {field: 'cadastro_data_nascimento', header: 'DT. NASC. / FUNDAÇÃO', sortable: 'true', width: '230px'},
      {field: 'cadastro_grupo_nome', header: 'GRUPO', sortable: 'true', width: '250px'},
      {field: 'cadastro_profissao', header: 'PROFISSÃO', sortable: 'true', width: '200px'},
      {field: 'cadastro_cpfcnpj', header: 'CPF/CNPJ', sortable: 'false', width: '180px'},
      {field: 'cadastro_rg', header: 'RG', sortable: 'false', width: '180px'},
      {field: 'cadastro_sexo', header: 'GENERO', sortable: 'true', width: '120px'},
      {field: 'cadastro_estado_civil_nome', header: 'ESTADO CIVIL', sortable: 'true', width: '200px'},
      {field: 'cadastro_conjuge', header: 'CONJUGE', sortable: 'false', width: '200px'},
      {field: 'cadastro_escolaridade_nome', header: 'ESCOLARIDADE', sortable: '200px', width: '200px'},
      {field: 'cadastro_zona', header: 'PARTIDO', sortable: 'true', width: '120px'},
      {field: 'cadastro_jornal', header: 'BOLETIM', sortable: 'true', width: '120px'},
      {field: 'cadastro_mala', header: 'MALA DIRETA', sortable: 'true', width: '190px'},
      {field: 'cadastro_agenda', header: 'CONTATO', sortable: 'true', width: '120px'},
      {field: 'cadastro_data_cadastramento', header: 'DT. CADASTRAMENTO', sortable: 'true', width: '230px'},
      {field: 'cadastro_usuario', header: 'CADASTRANTE', sortable: 'true', width: '200px'},
      {field: 'cadastro_campo1', header: 'CAMPO 1', sortable: 'true', width: '150px'},
      {field: 'cadastro_campo2', header: 'CAMPO 2', sortable: 'false', width: '200px'},
      {field: 'cadastro_campo3', header: 'CAMPO 3', sortable: 'false', width: '200px'},
      {field: 'cadastro_campo4_nome', header: 'CAMPO 4', sortable: 'true', width: '200px'},
    ];
  }

  // EVENTOS ===================================================================



  // FUNCOES DO COMPONENTE =====================================================


  resetSelectedColumns(): void {
    this.cs.criaTabela();
    this.cs.tabela.selectedColumns = [
      {field: 'cadastro_tipo_nome', header: 'TIPO', sortable: 'true', width: '200px'},
      {field: 'cadastro_tratamento_nome', header: 'TRATAMENTO', sortable: 'true', width: '160px'},
      {field: 'cadastro_nome', header: 'NOME / RAZÃO SOCIAL', sortable: 'true', width: '300px'},
      {field: 'cadastro_responsavel', header: 'EMPRESA / RESPONSÁVEL', sortable: 'true', width: '250px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', width: '250px'},
      {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', width: '120px'},
      {field: 'cadastro_grupo_nome', header: 'GRUPO', sortable: 'true', width: '250px'},
      {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', width: '200px'},
    ];
  }

  resetColunas() {
    this.cs.tabela.mostraSeletor = false;
    this.resetSelectedColumns();
  }

  mostraSelectColunas(): void {// this
    this.cs.tabela.mostraSeletor = true;
  }

  mudaSeletor(ev: ColunasI[]) {
    this.dtb.columns = ev;
  }

  hideSeletor(): void {
    this.cs.tabela.mostraSeletor = false;
  }

  /*rowColor(field: string, vl1: number): string | null {
    if (field !== 'cadastro_situacao_nome') {
      return null;
    }

    if (field === 'cadastro_situacao_nome') {
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
  }*/

  montaMenuContexto() {
    this.contextoMenu = [
      {
        label: 'DETALHES', icon: 'pi pi-eye', style: {'font-size': '1em'},
        command: () => {
          this.cadastroDetalheCompleto(this.cs.Contexto);
        }
      }];

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.cadastro_alterar) {
      this.contextoMenu.push(
        {
          label: 'ALTERAR', icon: 'pi pi-pencil', style: {'font-size': '1em'},
          command: () => {
            this.cadastroAlterar(this.cs.idx, 'contexto', this.cs.Contexto);
          }
        });
    }

    if (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.cadastro_apagar) {
      this.contextoMenu.push(
        {
          label: 'APAGAR', icon: 'pi pi-trash', style: {'font-size': '1em'},
          command: () => {
            this.cadastroApagar(this.cs.Contexto);
          }
        });
    }
  }

  onColReorder(event): void {
    this.mapeiaColunas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.cs.tabela.sortField !== event.sortField) {
      this.cs.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.cs.tabela.first !== +event.first) {
      this.cs.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.cs.tabela.rows !== +event.rows) {
      this.cs.tabela.rows = +event.rows;
      ct++;
    }
    if (this.cs.tabela.sortOrder !== +event.sortOrder) {
      this.cs.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.cs.lazy = true;
      this.cs.cadastroBusca();
    }
  }

  // FUNCOES DE BUSCA ==========================================================

  // FUNCOES DE CRUD ===========================================================

  cadastroIncluir(): void {
    if (this.aut.cadastro_incluir || this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) {
      this.cfs.acao = 'incluir';
      this.cs.salvaState();
      this.dtb.saveState();
      this.cfs.resetCadastro();
      this.cfs.criaFormIncluir();
      this.mi.mudaMenuInterno(false);
      this.router.navigate(['/cadastro/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  cadastroDetalheCompleto(cad: CadastroI) {
    this.showDetalhe = true;
    this.cadastroDetalhe = cad;
  }

  escondeDetalhe() {
    this.showDetalhe = false;
    this.cadastroDetalhe = null;
  }

  cadastroAlterar(index: number, origem: 'menu'|'listagem'|'contexto'|'expandido'| null, cad: CadastroI) {
    if (this.aut.cadastro_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      this.cs.salvaState();
      this.dtb.saveState();
      this.cfs.idx = +index;
      this.cfs.acao = 'alterar';
      this.cfs.origem = origem;
      this.cfs.parceForm(cad);
      this.router.navigate(['/cadastro/alterar']);
    } else {
      console.log('SEM PERMISSAO');
    }

  }

  cadastroApagar(cad: CadastroI) {
    if ((this.aut.cadastro_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn ) && this.permissaoApagarArquivo(cad)) {
      this.cs.cadastroApagar = cad;
      this.cs.salvaState();
      this.dtb.saveState();
      this.router.navigate(['/cadastro/apagar']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  permissaoApagarArquivo(cad: CadastroI): boolean {
    if (this.aut.arquivos_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn) {
      return true
    }
    return !(cad.cadastro_arquivos !== undefined && cad.cadastro_arquivos !== null && Array.isArray(cad.cadastro_arquivos) && cad.cadastro_arquivos.length > 0);
  }

  mostraDialog(ev: boolean) {
    this.cssMostra = (ev) ? null : 'p-d-none';
  }

  recebeRegistro(p: CadastroI) {
    this.cs.cadastros[this.idx] = p;
    const a: any = {
      data: p
    }
    this.cs.onRowExpand(a);
  }

  ngOnDestroy(): void {
    this.cs.expandido = undefined;
    this.cs.expandidoSN = false;
    this.cs.selecionados = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  getColunas() {
    this.cs.colunas = this.cols.map(t => {
      return t.field;
    });

  }

}
