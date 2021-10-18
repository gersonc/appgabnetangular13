import {Component, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { WindowsService } from '../../_layout/_service';
import { AuthenticationService, CarregadorService } from '../../_services';
import { EtiquetaSeletorComponent } from '../../etiqueta/etiqueta-seletor/';
import {
  CsvService,
  ExcelService,
  MostraMenuService,
  PrintJSService,
  TabelaPdfService
} from '../../util/_services';
import {
  CadastroArray,
  CadastroInterface,
  CadastroTotalInterface,
  CadastroBuscaCampoInterface,
  CadastroEtiquetaInterface,
  CadastroDetalheCompletoInterface,
  CadastroPaginacaoInterface
} from '../_models';
import { CadastroService, CadastroBuscaService } from '../_services';
import { CadastroDetalheComponent } from '../cadastro-detalhe';
import { ContextMenu } from 'primeng/contextmenu';


@Component({
  selector: 'app-cadastro-datatable',
  templateUrl: './cadastro-datatable.component.html',
  styleUrls: ['./cadastro-datatable.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ DialogService ]
})
export class CadastroDatatableComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('dt', { static: true }) public dt: any;
  @ViewChild('cn', { static: true }) public cm: ContextMenu;
  loading = false;
  cols: any[];
  currentPage = 1;
  cadastros: CadastroInterface[];
  cadContexto: CadastroInterface;
  total: CadastroTotalInterface = null;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: CadastroInterface[];
  sortCampo = 'cadastro_nome';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  camposSelecionados: CadastroBuscaCampoInterface[];
  // altura = `${WindowsService.altura - 180}` + 'rem';
  altura = `${WindowsService.altura - 171.41}` + 'px'; // 171.41 = 10.71rem = 10.71 * 16px
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  larguraExpandido = `${WindowsService.largura - 50}` + 'px';
  numColunas = 3;
  expColunas = 0;
  dadosExpandidos: Subscription;
  expandidoDados: any = false;
  dadosExp: any[];
  buscaStateSN: boolean;
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  tmp = false;
  sub: Subscription[] = [];

  // *** DETALHE ***
  mostraDetalhe = false;
  mostraImprimir = false;
  dadosImprimir: any;
  cadDetalhe: CadastroDetalheCompletoInterface = null;
  // *** ALTERAR ***

  camposTextos: string[];

  constructor(
    private mm: MostraMenuService,
    public authenticationService: AuthenticationService,
    public dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private cadastroService: CadastroService,
    private cbs: CadastroBuscaService,
    private cs: CarregadorService
    ) { }

  ngOnInit() {

    this.cols = [
      {field: 'cadastro_id', header: 'ID', sortable: 'true', largura: '80px'},
      {field: 'cadastro_tipo_nome', header: 'TIPO', sortable: 'true', largura: '200px'},
      {field: 'cadastro_tratamento_nome', header: 'TRATAMENTO', sortable: 'true', largura: '160px'},
      {field: 'cadastro_nome', header: 'NOME / RAZÃO SOCIAL', sortable: 'true', largura: '300px'},
      {field: 'cadastro_responsavel', header: 'EMPRESA / RESPONSÁVEL', sortable: 'true', largura: '250px'},
      {field: 'cadastro_cargo', header: 'CARGO', sortable: 'true', largura: '200px'},
      {field: 'cadastro_sigla', header: 'SIGLA', sortable: 'true', largura: '100px'},
      {field: 'cadastro_apelido', header: 'APELIDO', sortable: 'true', largura: '150px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '250px'},
      {field: 'cadastro_regiao_nome', header: 'REGIÃO', sortable: 'true', largura: '200px'},
      {field: 'cadastro_endereco', header: 'ENDEREÇO', sortable: 'false', largura: '250px'},
      {field: 'cadastro_endereco_numero', header: 'END. NÚMERO', sortable: 'false', largura: '160px'},
      {field: 'cadastro_endereco_complemento', header: 'END. COMPLEMENTO', sortable: 'false', largura: '210px'},
      {field: 'cadastro_bairro', header: 'BAIRRO', sortable: 'true', largura: '200px'},
      {field: 'cadastro_cep', header: 'CEP', sortable: 'false', largura: '150px'},
      {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', largura: '120px'},
      {field: 'cadastro_telefone', header: 'TELEFONE 1', sortable: 'false', largura: '150px'},
      {field: 'cadastro_telcom', header: 'TELEFONE 2', sortable: 'false', largura: '150px'},
      {field: 'cadastro_telefone2', header: 'TELEFONE 3', sortable: 'false', largura: '150px'},
      {field: 'cadastro_celular', header: 'CELULAR 1', sortable: 'false', largura: '150px'},
      {field: 'cadastro_celular2', header: 'CELULAR 2', sortable: 'false', largura: '150px'},
      {field: 'cadastro_fax', header: 'FAX', sortable: 'false', largura: '120px'},
      {field: 'cadastro_email', header: 'E-MAIL', sortable: 'true', largura: '250px'},
      {field: 'cadastro_email2', header: 'E-MAIL 2', sortable: 'true', largura: '250px'},
      {field: 'cadastro_rede_social', header: 'FACEBOOK', sortable: 'false', largura: '250px'},
      {field: 'cadastro_outras_midias', header: 'OUTRAS MÍDIAS', sortable: 'false', largura: '250px'},
      {field: 'cadastro_data_nascimento', header: 'DT. NASC. / FUNDAÇÃO', sortable: 'true', largura: '230px'},
      {field: 'cadastro_grupo_nome', header: 'GRUPO', sortable: 'true', largura: '250px'},
      {field: 'cadastro_profissao', header: 'PROFISSÃO', sortable: 'true', largura: '200px'},
      {field: 'cadastro_cpfcnpj', header: 'CPF/CNPJ', sortable: 'false', largura: '180px'},
      {field: 'cadastro_rg', header: 'RG', sortable: 'false', largura: '180px'},
      {field: 'cadastro_sexo', header: 'GENERO', sortable: 'true', largura: '120px'},
      {field: 'cadastro_estado_civil_nome', header: 'ESTADO CIVIL', sortable: 'true', largura: '200px'},
      {field: 'cadastro_conjuge', header: 'CONJUGE', sortable: 'false', largura: '200px'},
      {field: 'cadastro_escolaridade_nome', header: 'ESCOLARIDADE', sortable: '200px', largura: '200px'},
      {field: 'cadastro_zona', header: 'PARTIDO', sortable: 'true', largura: '120px'},
      {field: 'cadastro_jornal', header: 'BOLETIM', sortable: 'true', largura: '120px'},
      {field: 'cadastro_mala', header: 'MALA DIRETA', sortable: 'true', largura: '190px'},
      {field: 'cadastro_agenda', header: 'CONTATO', sortable: 'true', largura: '120px'},
      {field: 'cadastro_data_cadastramento', header: 'DT. CADASTRAMENTO', sortable: 'true', largura: '230px'},
      {field: 'cadastro_usuario', header: 'CADASTRANTE', sortable: 'true', largura: '200px'},
      {field: 'cadastro_campo1', header: 'CAMPO 1', sortable: 'true', largura: '150px'},
      {field: 'cadastro_campo2', header: 'CAMPO 2', sortable: 'false', largura: '200px'},
      {field: 'cadastro_campo3', header: 'CAMPO 3', sortable: 'false', largura: '200px'},
      {field: 'cadastro_campo4_nome', header: 'CAMPO 4', sortable: 'true', largura: '200px'},
      {field: 'arquivo_num', header: 'N ARQUIVOS', sortable: 'true', largura: '150px'}
    ];

    if (sessionStorage.getItem('cadastro-selectedColumns')) {
      this.selectedColumns = JSON.parse(sessionStorage.getItem('cadastro-selectedColumns'));
      this.mapeiaColunasSelecionadas();
      sessionStorage.removeItem('cadastro-selectedColumns');
    } else {
      this.resetSelectedColumns();
    }

    this.contextoMenu = [
      {
        label: 'DETALHES', icon: 'pi pi-eye',
        command: () => {this.cadastroDetalheCompleto(this.cadContexto); }
      }
    ];
    if (this.authenticationService.cadastro_alterar) {
      this.contextoMenu.push(
        {label: 'ALTERAR', icon: 'pi pi-pencil', styleClass: 'context-menu-alterar',
          command: () => { this.cadastroAlterar(this.cadContexto); }});
    }
    if (this.authenticationService.cadastro_apagar) {
      this.contextoMenu.push(
        {label: 'APAGAR', icon: 'pi pi-trash', styleClass: 'context-menu-apagar',
          command: () => { this.cadastroApagar(this.cadContexto); }});
    }
    if (this.authenticationService.cadastro_incluir) {
      this.contextoMenu.push(
        {label: 'INCLUIR', icon: 'pi pi-plus',
          command: () => { this.cadastroIncluir(); }});
    }

    this.itemsAcao = [
      {label: 'CSV', icon: 'fas fa-lg fa-file-csv', style: {'font-size': '.9em'}, command: () => { this.exportToCsv(); }},
      {label: 'CSV - TODOS', icon: 'fas fa-lg fa-file-csv', style: {'font-size': '.9em'}, command: () => { this.exportToCsv(true); }},
      {label: 'PDF', icon: 'fas fa-lg fa-file-pdf', style: {'font-size': '1em'}, command: () => { this.mostraTabelaPdf(); }},
      {label: 'PDF - TODOS', icon: 'far fa-lg fa-file-pdf', style: {'font-size': '.9em'}, command: () => { this.mostraTabelaPdf(true); }},
      {label: 'IMPRIMIR', icon: 'fas fa-lg fa-print', style: {'font-size': '1em'}, command: () => { this.imprimirTabela(); }},
      {label: 'IMPRIMIR - TODOS', icon: 'fas fa-lg fa-print', style: {'font-size': '.9em'}, command: () => { this.imprimirTabela(true); }},
      {label: 'EXCEL', icon: 'fas fa-lg fa-file-excel', style: {'font-size': '1em'}, command: () => { this.exportToXLSX(); }},
      {label: 'EXCEL - TODOS', icon: 'far fa-lg fa-file-excel', style: {'font-size': '.9em'}, command: () => { this.exportToXLSX(true); }},
      {label: 'ETIQUETAS', icon: 'fas fa-lg fa-tag', style: {'font-size': '1em'}, command: () => { this.exportToEtiquetas(); }},
      {label: 'ETIQ. - TODAS', icon: 'fas fa-lg fa-tags', style: {'font-size': '.9em'}, command: () => { this.exportToEtiquetas(true); }},

    ];
    if (this.authenticationService.sms && this.authenticationService.sms_incluir) {
      this.itemsAcao.push(
        {label: 'SMS', icon: 'fas fa-lg fa-sms', style: {'font-size': '.9em'}, command: () => { this.gerenciadorSMS(); }}
      );
    }

    this.constroiExtendida();

    this.getState();

    this.sub.push(this.cbs.busca$.subscribe(
      () => {
        this.cbs.cadastroBusca.todos = false;
        this.dt.reset();
        this.dt.selectionKeys = [];
        this.selecionados = [];
      }
    ));

  }

  // EVENTOS ===================================================================

  ngOnChanges() { }

  onColReorder(event): void {
    this.mapeiaColunasSelecionadas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    let bsc = false;
    if (event.sortField) {
      if (this.cbs.cadastroBusca.sortcampo !== event.sortField.toString ()) {
        this.cbs.cadastroBusca.sortcampo = event.sortField.toString ();
        bsc = true;
      }
    }
    if (this.cbs.cadastroBusca.inicio !== event.first.toString()) {
      this.cbs.cadastroBusca.inicio = event.first.toString();
      bsc = true;
    }
    if (this.cbs.cadastroBusca.numlinhas !== event.rows.toString()) {
      this.cbs.cadastroBusca.numlinhas = event.rows.toString();
      this.rows = event.rows;
      bsc = true;
    }
    if (this.cbs.cadastroBusca.sortorder !== event.sortOrder.toString()) {
      this.cbs.cadastroBusca.sortorder = event.sortOrder.toString();
      bsc = true;
    }
    if (bsc) {
      this.postCadastroBusca();
    }
  }

  onRowExpand(event): void {
    this.cadastroService.expandidoDados = event.data;
    console.log(event.data);
    this.dadosExpandidos = this.cadastroService.getColunaExtendida()
      .pipe(take(1))
      .subscribe(
        dados => {
          this.expColunas = dados.pop();
          this.dadosExp = dados;
          console.log('dadosExp', dados);
        }
      );
    this.cadastroService.montaColunaExpandida(this.cadastroService.expandidoDados);
  }

  onChangeSeletorColunas(changes): void {
    this.dt.saveState();
    this.camposSelecionados = null;
    this.camposSelecionados = changes.value.map(
      function (val) { return { field: val.field, header: val.header }; });
  }

  mostraSelectColunas(): void {
    this.selectedColumnsOld = this.selectedColumns;
    this.mostraSeletor = true;
  }

  hideSeletor(ev): void {
    if (this.selectedColumnsOld !== this.selectedColumns) {
      this.postCadastroBusca();
    }
    this.selectedColumnsOld = [];
  }

  onContextMenuSelect(event) {
    this.cadContexto = event.data;
  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mm.showMenu();
  }

  reset() {
    this.dt.reset();
  }

  resetSelectedColumns(): void {
    this.selectedColumns = [
      {field: 'cadastro_tipo_nome', header: 'TIPO', sortable: 'true', largura: '200px'},
      {field: 'cadastro_tratamento_nome', header: 'TRATAMENTO', sortable: 'true', largura: '160px'},
      {field: 'cadastro_nome', header: 'NOME / RAZÃO SOCIAL', sortable: 'true', largura: '300px'},
      {field: 'cadastro_responsavel', header: 'EMPRESA / RESPONSÁVEL', sortable: 'true', largura: '250px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '250px'},
      {field: 'cadastro_estado_nome', header: 'ESTADO', sortable: 'true', largura: '120px'},
      {field: 'cadastro_grupo_nome', header: 'GRUPO', sortable: 'true', largura: '250px'},
      {field: 'cadastro_profissao', header: 'PROFISSÃO', sortable: 'true', largura: '200px'}
    ];
    this.mapeiaColunasSelecionadas();
  }

  mapeiaColunasSelecionadas(): void {
    this.camposSelecionados = [];
    this.camposSelecionados.push({field: 'cadastro_id', header: 'ID'});
    this.selectedColumns.forEach( (c) => {
      this.camposSelecionados.push({field: c.field, header: c.header});
    });
  }

  recuperaIdsSelecionados() {
    this.cbs.cadastroBusca.ids = [];
    this.selecionados.forEach((n) => {
      this.cbs.cadastroBusca.ids.push(n.cadastro_id);
    });
  }

  // FUNCOES DE BUSCA ==========================================================

  postCadastroBusca(): void {
    this.cbs.cadastroBusca['campos'] = this.camposSelecionados;
    this.cs.mostraCarregador();
    this.sub.push(this.cadastroService.postCadastroBusca(this.cbs.cadastroBusca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.cadastros = dados.cadastros;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.cbs.cadastroBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.cbs.cadastroBusca.inicio, 10) +
            parseInt(this.cbs.cadastroBusca.numlinhas, 10)) /
            parseInt(this.cbs.cadastroBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cbs.buscaStateSN = true;
          this.cs.escondeCarregador();
        }
      })
    );
  }

  getState(): void {

    if (this.cbs.buscaStateSN && sessionStorage.getItem('cadastro-busca')) {
      this.cbs.criarCadastroBusca();
      this.cbs.cadastroBusca = JSON.parse(sessionStorage.getItem('cadastro-busca'));
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: CadastroPaginacaoInterface }) => {
          this.cadastros = data.dados.cadastros ? data.dados.cadastros : [];
          this.total = data.dados.total ? data.dados.total : null;
          this.totalRecords = data.dados.total.num ? data.dados.total.num : 0;
          this.cbs.cadastroBusca.todos = this.tmp !== null ? this.tmp : false;
          this.currentPage = (
            parseInt(this.cbs.cadastroBusca.inicio, 10) +
            parseInt(this.cbs.cadastroBusca.numlinhas, 10)) /
            parseInt(this.cbs.cadastroBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cbs.buscaStateSN = true;
          sessionStorage.removeItem('cadastro-busca');
          this.cs.escondeCarregador();
        }));
    }
  }

  escondeCarregador() {
    this.cs.mostraEsconde(false);
  }

  // FUNCOES DE CRUD ===========================================================

  cadastroIncluir(): void {
    if (this.authenticationService.cadastro_incluir) {
      this.cs.mostraCarregador();
      if (this.cbs.buscaStateSN) {
        this.dt.saveState();
        if (this.cadastroService.expandidoDados) {
          this.cadastroService.gravaColunaExpandida(this.cadastroService.expandidoDados);
        }
        sessionStorage.setItem('cadastro-busca', JSON.stringify(this.cbs.cadastroBusca));
        sessionStorage.setItem('cadastro-selectedColumns', JSON.stringify(this.selectedColumns));
      } else {
        this.cbs.buscaStateSN = false;
      }
      this.router.navigate(['/cadastro/incluir']);
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  cadastroAlterar(cad: CadastroInterface): void {
    if (this.authenticationService.cadastro_alterar) {
      this.cs.mostraCarregador();
      this.sub.push(this.cadastroService.alterarCadastroBusca(cad.cadastro_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.cadastroService.cadastro = dados;
          },
          error: (erro) => {
            this.cs.escondeCarregador();
            console.error(erro.toString());
          },
          complete: () => {
            this.dt.saveState();
            if (this.cadastroService.expandidoDados) {
              this.cadastroService.gravaColunaExpandida(this.cadastroService.expandidoDados);
            }
            sessionStorage.setItem('cadastro-busca', JSON.stringify(this.cbs.cadastroBusca));
            sessionStorage.setItem('cadastro-selectedColumns', JSON.stringify(this.selectedColumns));
            this.cbs.buscaStateSN = true;
            this.router.navigate(['/cadastro/alterar', 0]);
          }
        })
      );
    } else {
      console.log('SEM PERMISSAO');
    }
  }

  cadastroApagar(cad: CadastroInterface): void {
    if (this.authenticationService.cadastro_apagar) {
      this.cs.mostraCarregador();
      this.dt.saveState();
      if (this.cadastroService.expandidoDados) {
        this.cadastroService.gravaColunaExpandida(this.cadastroService.expandidoDados);
      }
      sessionStorage.setItem('cadastro-busca', JSON.stringify(this.cbs.cadastroBusca));
      sessionStorage.setItem('cadastro-selectedColumns', JSON.stringify(this.selectedColumns));
      this.cbs.buscaStateSN = true;
      this.router.navigate(['/cadastro/excluir', cad.cadastro_id]);
    } else {
      console.log('SEM PERMISSAO');
    }
  }


  cadastroDetalheCompleto(cad: CadastroInterface): void {
    this.cs.mostraCarregador();
    let cadDetalhe: CadastroDetalheCompletoInterface;
    this.sub.push(this.cadastroService.getDetalheCompleto(cad.cadastro_id)
      .pipe(take(1))
      .subscribe({
      next: (dados) => {
        cadDetalhe = dados;
        this.cadDetalhe = dados;
      },
      error: (err) => {
        console.error('erro', err.toString ());
      },
      complete: () => {
        this.cs.escondeCarregador();
        this.mostraDetalhe = true;
      }
    }));
  }

  // FUNCOES RELATORIOS=========================================================
  mostraTabelaPdf(td: boolean = false) {
    this.tmp = this.cbs.cadastroBusca.todos;
    this.cbs.cadastroBusca.todos = td;
    if (this.cbs.cadastroBusca.todos === true) {
      let cadPdf: CadastroInterface[];
      let totalPdf: CadastroTotalInterface[];
      let numTotalRegs: number;
      this.cbs['campos'] = this.camposSelecionados;
      // this.loading = true;
      this.sub.push(this.cadastroService.postCadastroBusca(this.cbs.cadastroBusca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            cadPdf = dados.cadastros;
            totalPdf = dados.total;
            numTotalRegs = totalPdf[0].num;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            TabelaPdfService.autoTabela('cadastro', this.camposSelecionados, cadPdf);
            this.cbs.cadastroBusca.todos = this.tmp;
          }
        })
      );
      return true;
    }
    if (this.selecionados && this.selecionados.length > 0) {
      TabelaPdfService.autoTabela('cadastro', this.camposSelecionados, this.selecionados);
      this.cbs.cadastroBusca.todos = this.tmp;
      return true;
    }
    TabelaPdfService.autoTabela('cadastro', this.camposSelecionados, this.cadastros);
    this.cbs.cadastroBusca.todos = this.tmp;
    return true;
  }

  imprimirTabela(td: boolean = false) {
    this.tmp = this.cbs.cadastroBusca.todos;
    this.cbs.cadastroBusca.todos = td;
    if (this.cbs.cadastroBusca.todos === true) {
      let cadprint: CadastroInterface[];
      let totalprint: CadastroTotalInterface[];
      let numTotalRegs: number;
      this.cbs['campos'] = this.camposSelecionados;
      this.loading = true;
      this.sub.push(this.cadastroService.postCadastroBusca(this.cbs.cadastroBusca)
        .subscribe({
          next: (dados) => {
            cadprint = dados.cadastros;
            totalprint = dados.total;
            numTotalRegs = totalprint[0].num;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            PrintJSService.imprimirTabela(this.camposSelecionados, cadprint);
            this.cbs.cadastroBusca.todos = this.tmp;
            this.loading = false;
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela(this.camposSelecionados, this.selecionados);
      this.cbs.cadastroBusca.todos = this.tmp;
      return true;
    }

    PrintJSService.imprimirTabela(this.camposSelecionados, this.cadastros);
    this.cbs.cadastroBusca.todos = this.tmp;
    return true;
  }

  exportToCsv(td: boolean = false) {
    this.tmp = this.cbs.cadastroBusca.todos;
    this.cbs.cadastroBusca.todos = td;
    if (this.cbs.cadastroBusca.todos === true) {
      let cadcsv: CadastroInterface[];
      let totalprint: CadastroTotalInterface[];
      let numTotalRegs: number;
      this.cbs['campos'] = this.camposSelecionados;
      this.loading = true;
      this.sub.push(this.cadastroService.postCadastroBusca (this.cbs.cadastroBusca)
        .subscribe ({
          next: (dados) => {
            cadcsv = dados.cadastros;
            totalprint = dados.total;
            numTotalRegs = totalprint[0].num;
          },
          error: err => console.error ('ERRO-->', err),
          complete: () => {
            CsvService.jsonToCsv ('cadastro', this.camposSelecionados, cadcsv);
            this.cbs.cadastroBusca.todos = this.tmp;
            this.loading = false;
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      CsvService.jsonToCsv ('cadastro', this.camposSelecionados, this.selecionados);
      this.cbs.cadastroBusca.todos = this.tmp;
      return true;
    }

    CsvService.jsonToCsv ('cadastro', this.camposSelecionados, this.cadastros);
    this.cbs.cadastroBusca.todos = this.tmp;
    return true;
  }

  exportToXLSX(td: boolean = false) {
    this.tmp = this.cbs.cadastroBusca.todos;
    this.cbs.cadastroBusca.todos = td;
    if (this.cbs.cadastroBusca.todos === true) {
      let cadcsv: CadastroInterface[];
      let numTotalRegs: number;
      this.cbs['campos'] = this.selectedColumns;
      this.loading = true;
      this.sub.push(this.cadastroService.postCadastroBuscaJson (this.cbs.cadastroBusca)
        .subscribe ({
          next: (dados) => {
            cadcsv = dados.cadastros;
            numTotalRegs = dados.total.num;
          },
          error: err => console.error ('ERRO-->', err),
          complete: () => {
            ExcelService.exportAsExcelFile ('cadastro', cadcsv, CadastroArray.getArrayTitulo());
            this.cbs.cadastroBusca.todos = this.tmp;
            this.loading = false;
          }
        })
      );
      return true;
    }

    if (this.selecionados && this.selecionados.length > 0) {
      ExcelService.exportAsExcelFile ('cadastro', this.selecionados, CadastroArray.getArrayTitulo());
      this.cbs.cadastroBusca.todos = this.tmp;
      return true;
    }
    ExcelService.exportAsExcelFile ('cadastro', this.cadastros, CadastroArray.getArrayTitulo());
    this.cbs.cadastroBusca.todos = this.tmp;
    return true;
  }

  exportToEtiquetas(td: boolean = false) {
    this.tmp = this.cbs.cadastroBusca.todos;
    this.cbs.cadastroBusca.todos = td;
    let etq: CadastroEtiquetaInterface[];
    this.loading = true;
    if (this.cbs.cadastroBusca.todos !== true && (this.selecionados && this.selecionados.length > 0)) {
      this.recuperaIdsSelecionados();
    } else {
      this.cbs.cadastroBusca.ids = [];
    }
    this.sub.push(this.cadastroService.postCadastroBuscaEtiqueta(this.cbs.cadastroBusca)
      .subscribe({
        next: (dados) => {
          etq = dados;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.loading = false;
          const ref = this.dialogService.open( EtiquetaSeletorComponent, {
            data: {
              cadastro: etq
            },
            header: 'Etiquetas',
            width: '300px',
            height: '500px',
            dismissableMask: true,
            showHeader: true
          });
          this.cbs.cadastroBusca.todos = this.tmp;
        }
      })
    );
  }

  gerenciadorSMS() {
    if (this.authenticationService.sms && this.authenticationService.sms_incluir) {
      this.cbs.smsSN = true;
      this.cbs.cadastroBusca.sms = true;
      this.cbs.cadastroBusca.inicio = '0';
      this.cbs.cadastroBusca.numlinhas = '50';
      // this.dt.saveState();
      sessionStorage.setItem('cadastro-busca', JSON.stringify(this.cbs.cadastroBusca));
      sessionStorage.setItem('cadastro-selectedColumns', JSON.stringify(this.selectedColumns));
      this.cbs.buscaStateSN = true;
      this.mm.mudaSmsVF(true);
      this.cadastros = null;
      this.router.navigate(['/cadastro/listar/sms/busca']);
    }
  }

  constroiExtendida() {
    const v = this.cadastroService.recuperaColunaExpandida();
    if (v) {
      this.sub.push(this.dadosExpandidos = this.cadastroService.getColunaExtendida()
        .pipe(take(1))
        .subscribe(
          dados => {
            this.expColunas = dados.pop();
            this.dadosExp = dados;
          }
        )
      );
      this.cadastroService.montaColunaExpandida(v);
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  onRowSelect(ev) {
    console.log(ev);
    console.log('selecionados', this.selecionados);
  }

  onFechar(ev: any = null): void {
    if (ev.acao) {
      if (ev.acao === 'detalhe') {
        this.mostraDetalhe = false;
      }
    }
  }

  imprimirFechar() {
    this.dadosImprimir = null;
    this.mostraImprimir = false;
  }


}

