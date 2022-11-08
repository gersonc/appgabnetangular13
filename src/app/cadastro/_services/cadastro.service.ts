import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {TituloI} from "../../_models/titulo-i";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {cadastrocampostexto, CadastroI, CadastroPaginacaoI, CadastroVinculosI} from "../_models/cadastro-i";
import {TitulosService} from "../../_services/titulos.service";
import {CelulaI} from "../../_models/celula-i";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {CelulaService} from "../../_services/celula.service";
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from "../../_services";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {limpaCampoTexto} from "../../shared/functions/limpa-campo-texto";
import {CadastroBuscaI} from "../_models/cadastro-busca-i";
import {take} from "rxjs/operators";
import {ColunasI} from "../../_models/colunas-i";
import {CadastroDuplicadoBuscaInterface} from "../_models/cadastro-duplicado-busca.interface";
import {CadastroDuplicadoI} from "../_models/cadastro-duplicado-i";
import {CadastroFormI} from "../_models/cadastro-form-i";
import {CadastroEtiquetaI, CadastroEtiquetaListI} from "../../etiqueta/_models/cadastro-etiqueta-i";
import {EtiquetaCadastroService} from "../../etiqueta/_services/etiqueta-cadastro.service";


@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  cadastroUrl = this.url.cadastro;
  sub: Subscription[] = [];
  cadastros: CadastroI[] = [];
  selecionados: CadastroI[] = [];
  Contexto?: CadastroI;
  cadastroVinculos: CadastroVinculosI | null = null;
  busca?: CadastroBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: CadastroI;
  expandidoSN = false;
  cadastroApagar: CadastroI | null = null;
  permissaoVinculos = false;
  sortField = 'cadastro_nome';
  //sortField = 'cadastro_cep';
  sortOrder = 1;
  // sortOrder = -1;
  lazy = false;
  acao: string | null = null;
  colunas: string[] = [];
  cadastro_campo1_sn = false;
  cadastro_campo1_nome: string | null = null;
  cadastro_campo2_sn = false;
  cadastro_campo2_nome: string | null = null;
  cadastro_campo3_sn = false;
  cadastro_campo3_nome: string | null = null;
  cadastro_campo4_sn = false;
  cadastro_campo4_nome: string | null = null;
  // totais: CadastroI[] = [];
  titulos: TituloI[] | null = null;
  mudaRows = 50;
  rowsPerPageOptions = [50];
  showEtiquetas = false;
  cadastroEtiqueta: CadastroEtiquetaI[] = [];
  numEtiquetas = 0;


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private celulaService: CelulaService,
    private ecs: EtiquetaCadastroService
  ) {
    this.cadastroUrl = this.url.cadastro;
    this.celulaService.modulo = 'Cadastro'
  }

  getCampoCadastro() {
    const tmp: any = JSON.parse(localStorage.getItem('currentUser'));
    this.cadastro_campo1_sn = tmp.cadastro_campo1_sn === 1;
    this.cadastro_campo1_nome = tmp.cadastro_campo1_sn === 1 ? tmp.cadastro_campo1_nome : null;
    this.cadastro_campo2_sn = tmp.cadastro_campo2_sn === 1;
    this.cadastro_campo2_nome = tmp.cadastro_campo2_sn === 1 ? tmp.cadastro_campo2_nome : null;
    this.cadastro_campo3_sn = tmp.cadastro_campo3_sn === 1;
    this.cadastro_campo3_nome = tmp.cadastro_campo3_sn === 1 ? tmp.cadastro_campo3_nome : null;
    this.cadastro_campo4_sn = tmp.cadastro_campo4_sn === 1;
    this.cadastro_campo4_nome = tmp.cadastro_campo4_sn === 1 ? tmp.cadastro_campo4_nome : null;
  }

  buscaMenu() {
    this.cadastroBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'cadastro_nome';
        this.tabela.camposTexto = cadastrocampostexto;
        if (this.busca === undefined) {
          this.criaBusca();
        }

      }
    }
  }

  resetTabela() {
    this.tabela = undefined;
    this.criaTabela();
  }

  criaBusca() {
    if (this.busca === undefined) {
      this.busca = {
        todos: this.tabela.todos,
        rows: this.tabela.rows,
        sortField: this.tabela.sortField,
        first: this.tabela.first,
        sortOrder: this.tabela.sortOrder,
        etiqueta: 0
      };
    }
  }

  novaBusca(busca: CadastroBuscaI) {
    if (busca === undefined) {
      this.busca = {
        todos: this.tabela.todos,
        rows: this.tabela.rows,
        sortField: this.tabela.sortField,
        first: this.tabela.first,
        sortOrder: this.tabela.sortOrder
      };
    } else {
      this.busca = undefined;
      this.busca = busca;
      this.busca.todos = this.tabela.todos;
      this.busca.rows = this.tabela.rows;
      this.busca.first = 0;
      this.busca.sortOrder = 1;
      this.busca.sortField = 'cadastro_nome';
      this.busca.etiqueta = 0;
    }
  }

  resetCadastroBusca() {
    this.mudaRows = 50;
    this.busca = undefined;
    this.tabela.first = 0;
    this.tabela.sortOrder = 1;
    this.tabela.todos = false;
    this.tabela.rows = 50;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
  }

  onContextMenuSelect(event) {
    this.idx = this.cadastros.findIndex(c => +event.data.cadastro_id === +c.cadastro_id);
    this.Contexto = event.data;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.titulos = this.ts.buscaTitulos('cadastro', cps);
  }

  onRowExpand(evento) {
    if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
      this.titulos = this.ts.mTitulo['cadastro'];
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    let ev = this.expandido;
    this.titulos.forEach(t => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].length > 0) {
          let celula: CelulaI = {
            header: t.titulo,
            field: t.field,
            valor: ev[t.field],
            txtVF: false,
            cphtml: ev[t.field]
          }
          const m = this.tabela.camposTexto.findIndex(c => t.field === c);
          if (m > -1 && ev[t.field].length > 40) {
            const d = t.field + '_delta';
            const tx = t.field + '_texto';
            celula.txtVF = true;
            if (ev[d] !== undefined && ev[d] !== null) {
              celula.cpdelta = ev[d];
            }
            if (ev[tx] !== undefined && ev[tx] !== null) {
              celula.cptexto = ev[tx];
              celula.valor = ev[tx];
            }
          }
          if (m > -1 && ev[t.field].length <= 40) {
            celula.valor = limpaTexto(ev[t.field]);
          }
          cl.push(celula);
        }
      }
    });
    this.tabela.celulas = cl;
    this.expandidoSN = true;
  }

  onRowCollapse(ev) {
    this.tabela.celulas = [];
    this.expandidoSN = false;
    delete this.expandido;
  }

  onColResize(ev) {
  }

  testaCampoTexto(field: string): boolean {
    return (this.tabela.camposTexto.indexOf(field) > -1);
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      if (sessionStorage.getItem('cadastro-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('cadastro-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('cadastro-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: CadastroBuscaI) {
    sessionStorage.removeItem('cadastro-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.cadastro_tipo_id = (b.cadastro_tipo_id !== undefined) ? b.cadastro_tipo_id : undefined;
    this.busca.cadastro_id = (b.cadastro_id !== undefined) ? +b.cadastro_id : undefined;
    this.busca.cadastro_nome = (b.cadastro_nome !== undefined) ? b.cadastro_nome : undefined;
    this.busca.cadastro_sigla = (b.cadastro_sigla !== undefined) ? b.cadastro_sigla : undefined;
    this.busca.cadastro_apelido = (b.cadastro_apelido !== undefined) ? b.cadastro_apelido : undefined;
    this.busca.cadastro_responsavel = (b.cadastro_responsavel !== undefined) ? b.cadastro_responsavel : undefined;
    this.busca.cadastro_cargo = (b.cadastro_cargo !== undefined) ? b.cadastro_cargo : undefined;
    this.busca.cadastro_estado_id = (b.cadastro_estado_id !== undefined) ? +b.cadastro_estado_id : undefined;
    this.busca.cadastro_municipio_id = (b.cadastro_municipio_id !== undefined) ? +b.cadastro_municipio_id : undefined;
    this.busca.cadastro_regiao_id = (b.cadastro_regiao_id !== undefined) ? +b.cadastro_regiao_id : undefined;
    this.busca.cadastro_grupo_id = (b.cadastro_grupo_id !== undefined) ? +b.cadastro_grupo_id : undefined;
    this.busca.cadastro_data_nascimento1 = (b.cadastro_data_nascimento1 !== undefined) ? b.cadastro_data_nascimento1 : undefined;
    this.busca.cadastro_data_nascimento2 = (b.cadastro_data_nascimento2 !== undefined) ? b.cadastro_data_nascimento2 : undefined;
    this.busca.cadastro_anidia = (b.cadastro_anidia !== undefined) ? +b.cadastro_anidia : undefined;
    this.busca.cadastro_animes = (b.cadastro_animes !== undefined) ? +b.cadastro_animes : undefined;
    this.busca.quinzena = (b.quinzena !== undefined) ? +b.quinzena : undefined;
    this.busca.cadastro_estado_civil_id = (b.cadastro_estado_civil_id !== undefined) ? +b.cadastro_estado_civil_id : undefined;
    this.busca.cadastro_escolaridade_id = (b.cadastro_escolaridade_id !== undefined) ? +b.cadastro_escolaridade_id : undefined;
    this.busca.cadastro_profissao = (b.cadastro_profissao !== undefined) ? b.cadastro_profissao : undefined;
    this.busca.cadastro_sexo2 = (b.cadastro_sexo2 !== undefined) ? b.cadastro_sexo2 : undefined;
    this.busca.cadastro_zona = (b.cadastro_zona !== undefined) ? b.cadastro_zona : undefined;
    this.busca.cadastro_data_cadastramento = (b.cadastro_data_cadastramento !== undefined) ? b.cadastro_data_cadastramento : undefined;
    this.busca.cadastro_jornal = (b.cadastro_jornal !== undefined) ? +b.cadastro_jornal : undefined;
    this.busca.cadastro_mala = (b.cadastro_mala !== undefined) ? +b.cadastro_mala : undefined;
    this.busca.cadastro_agenda = (b.cadastro_agenda !== undefined) ? +b.cadastro_agenda : undefined;
    this.busca.cadastro_sigilo2 = (b.cadastro_sigilo2 !== undefined) ? +b.cadastro_sigilo2 : undefined;
    this.busca.cadastro_cpfcnpj = (b.cadastro_cpfcnpj !== undefined) ? b.cadastro_cpfcnpj : undefined;
    this.busca.telefone = (b.telefone !== undefined) ? b.telefone : undefined;
    this.busca.cadastro_campo1 = (b.cadastro_campo1 !== undefined) ? b.cadastro_campo1 : undefined;
    this.busca.cadastro_campo2 = (b.cadastro_campo2 !== undefined) ? b.cadastro_campo2 : undefined;
    this.busca.cadastro_campo3 = (b.cadastro_campo3 !== undefined) ? b.cadastro_campo3 : undefined;
    this.busca.cadastro_campo4_id = (b.cadastro_campo4_id !== undefined) ? +b.cadastro_campo4_id : undefined;
    this.cadastroBusca();
  }

  imprimirTabela(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'CADASTRO');
    }

    if (n === 2 && this.cadastros.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.cadastros, 'CADASTRO');
    }

    if (n === 3) {
      let busca: CadastroBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let cadastroRelatorio: CadastroPaginacaoI;
      this.sub.push(this.postCadastroRelatorio(busca)
        .subscribe({
          next: (dados) => {
            cadastroRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            PrintJSService.imprimirTabela2(this.tabela.selectedColumns, cadastroRelatorio.cadastros, 'CADASTROS');
          }
        })
      );
    }


  }

  tabelaPdf(n: number): void {
    // 1 - selecionados
    // 2 - pagina
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (n === 1) {
        TabelaPdfService.tabelaPdf(
          'cadastros',
          'PROPOSIÇÃO',
          this.tabela.selectedColumns,
          this.selecionados,
          cadastrocampostexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'cadastros',
          'PROPOSIÇÃO',
          this.tabela.selectedColumns,
          this.cadastros,
          cadastrocampostexto
        );
      }
      if (n === 3) {
        let busca: CadastroBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns, busca.todos = true;
        busca.first = undefined;
        let cadastroRelatorio: CadastroPaginacaoI;
        this.sub.push(this.postCadastroRelatorio(busca)
          .subscribe({
            next: (dados) => {
              cadastroRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'cadastros',
                'PROPOSIÇÃO',
                this.tabela.selectedColumns,
                cadastroRelatorio.cadastros,
                cadastrocampostexto
              );
            }
          })
        );
      }
    }
  }

  exportToXLSX(td: number = 1) {
    if (td === 3) {
      if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
        let busca: CadastroBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let cadastroRelatorio: CadastroPaginacaoI;

        if (this.tabela.totalRecords > 5000) {
          this.sub.push(this.postCadastroRelatorioGrande(busca)
            .subscribe({
              next: (dados) => {
                cadastroRelatorio = dados

              },
              error: err => {
                console.error('ERRO-->', err);
              },
              complete: () => {
                ExcelService.exportAsExcelFileBig('cadastro', cadastroRelatorio.cadastros, this.tabela.selectedColumns);
              }
            })
          );
        } else {

          this.sub.push(this.postCadastroRelatorio(busca)
            .subscribe({
              next: (dados) => {
                cadastroRelatorio = dados
              },
              error: err => {
                console.error('ERRO-->', err);
              },
              complete: () => {
                ExcelService.criaExcelFile('cadastro', limpaCampoTexto(cadastrocampostexto, cadastroRelatorio.cadastros), this.tabela.selectedColumns);
              }
            })
          );

        }


      }
    }
    if (this.cadastros.length > 0 && td === 2) {
      ExcelService.criaExcelFile('cadastro', limpaTabelaCampoTexto(this.tabela.selectedColumns, this.tabela.camposTexto, this.cadastros), this.tabela.selectedColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('cadastro', limpaTabelaCampoTexto(this.tabela.selectedColumns, this.tabela.camposTexto, this.selecionados), this.tabela.selectedColumns);
      return true;
    }
  }

  exportToCsvTodos(td: boolean = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        let busca: CadastroBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let slolicRelatorio: CadastroPaginacaoI;
        this.sub.push(this.postCadastroRelatorio(busca)
          .subscribe({
            next: (dados) => {
              slolicRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('cadastro', this.tabela.selectedColumns, slolicRelatorio.cadastros);

            }
          })
        );
      }
    }
  }

  exportToEtiquetas(n: number) {
    this.ecs.tplistagem = n;
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      this.ecs.parceEtiquetas(this.selecionados);
      this.showEtiquetas = true;
    }

    if (n === 2 && this.cadastros.length > 0) {
      this.ecs.parceEtiquetas(this.cadastros);
      this.showEtiquetas = true;
    }


      if (n === 3) {
        if(+this.tabela.totalRecords > +this.cadastros.length) {
          let busca: CadastroBuscaI = this.busca;
          busca.rows = undefined;
          busca.campos = undefined;
          busca.todos = true;
          busca.first = undefined;
          busca.etiqueta = 1;
          this.ecs.busca = busca;
          this.showEtiquetas = true;
        } else {
          this.ecs.tplistagem = 2;
          this.ecs.parceEtiquetas(this.cadastros);
          this.showEtiquetas = true;
        }
      }

  }

  hideEtiqueta(ev) {
    this.showEtiquetas = false;
  }

  customSort(ev) {
  }

  cadastroBusca(): void {
    if (this.lazy &&
      this.tabela.totalRecords <= +this.tabela.rows &&
      this.busca.ids === this.tabela.ids &&
      this.busca.first === this.tabela.first &&
      +this.tabela.rows === +this.mudaRows) {
      this.tabela.sortField = (this.tabela.sortField === 'cadastro_data_nascimento') ? 'cadastro_data_nascimento3' : (this.tabela.sortField === 'cadastro_data_cadastramento') ? 'cadastro_data_cadastramento3' : this.tabela.sortField;
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        let tmp = this.cadastros;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          // if (+this.busca.sortOrder !== +this.tabela.sortOrder) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.cadastros = tmp;
            this.lazy = true;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.cadastros = tmp;
            this.lazy = true;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.cadastros = tmp;
            this.tabela.sortOrder = 1;
            this.lazy = true;
          }
        }
      }
    } else {
      this.tabela.sortField = (this.tabela.sortField === 'cadastro_data_nascimento') ? 'cadastro_data_nascimento2' : this.tabela.sortField;
      this.tabela.sortField = (this.tabela.sortField === 'cadastro_data_cadastramento') ? 'cadastro_data_cadastramento2' : this.tabela.sortField;
      this.busca.rows = this.tabela.rows;
      this.busca.first = this.tabela.first;
      this.busca.sortOrder = this.tabela.sortOrder;
      this.busca.sortField = this.tabela.sortField;
      if (this.busca.todos === undefined && this.tabela.todos === undefined) {
        this.busca.todos = false;
        this.tabela.todos = false;
      }
      this.busca.ids = this.tabela.ids;
      this.sub.push(this.postCadastroBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.cadastros = dados.cadastros.map((t) => {
              let p: CadastroI = t;
              p.cadastro_data_nascimento3 = new Date(t.cadastro_data_nascimento2);
              p.cadastro_data_cadastramento3 = new Date(t.cadastro_data_cadastramento2);
              return p;
            });
            this.tabela.total = dados.total;
          },
          error: err => console.log('ERRO-->', err),
          complete: () => {
            this.lazy = false;
            if (+this.tabela.totalRecords !== +this.tabela.total.num) {
              this.tabela.totalRecords = +this.tabela.total.num;
              this.mudaRowsPerPageOptions(this.tabela.totalRecords);
            }
            const n = (this.tabela.first + this.tabela.rows) / this.tabela.rows;
            if (+this.tabela.currentPage !== n) {
              this.tabela.currentPage = n;
            }
            const m = Math.ceil(this.tabela.totalRecords / this.tabela.rows);
            if (+this.tabela.pageCount !== m) {
              this.tabela.pageCount = m
            }
            this.stateSN = false;
            this.lazy = this.tabela.totalRecords > this.tabela.rows;
          }
        })
      );
    }
  }

  postCadastroBusca(busca: CadastroBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.cadastro + '/listar';
    return this.http.post<CadastroPaginacaoI>(url, busca, httpOptions);
  }

  postCadastroRelatorio(busca: CadastroBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.cadastro + '/relatorio';
    return this.http.post<CadastroPaginacaoI>(url, busca, httpOptions);
  }

  postCadastroRelatorioGrande(busca: CadastroBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.cadastro + '/relatoriogrande';
    return this.http.post<CadastroPaginacaoI>(url, busca, httpOptions);
  }

  incluirCadastro(dados: CadastroFormI) {
    const url: string = this.url.cadastro + '/incluir';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterarCadastro(dados: CadastroFormI) {
    let url: string;
    url = this.url.cadastro + '/alterar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  getCadastroVinculos(id: number): Observable<CadastroVinculosI> {
    let url: string;
    url = this.url.cadastro + '/vinculos/' + id;
    return this.http.get<CadastroVinculosI>(url);
  }

  postCadastroBuscaEtiqueta(busca: CadastroBuscaI) {
    const url = this.cadastroUrl + '/listaretiqueta';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<CadastroEtiquetaListI>(url, busca, httpOptions);
  }

  atualizarCadastro(dados: CadastroI): Observable<any> {
    let url: string;
    url = this.url.cadastro + '/atualizar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  excluirCadastro(id: number): Observable<any> {
    const url = this.url.cadastro + '/' + id;
    return this.http.delete<any>(url);
  }

  procurarCadastroDuplicado (nome: string){
    const url = this.url.cadastro + '/verificanome';
    const n: any = {
      nome: nome
    }
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<CadastroDuplicadoI[]>(url, n, httpOptions);
  }

  verificaDuplicados(ev) {

  }


  rowsChange(ev) {
    this.mudaRows = this.tabela.rows;
    if (+ev <= this.tabela.rows) {
      this.tabela.rows = +ev;
      this.tabela.pageCount = this.tabela.totalRecords / +ev;
    } else {
      const n = this.cadastros.length;
      if (+ev > n) {
        this.tabela.rows = +ev;
        this.cadastroBusca();
      } else {
        const pgt = this.tabela.currentPage * +ev;
        if (pgt > n) {
          this.cadastroBusca();
        } else {
          this.tabela.rows = +ev;
          this.tabela.pageCount = this.tabela.totalRecords / +ev;
        }

      }
    }
  }

  mudaRowsPerPageOptions(t: number) {
    let anterior = 50;
    let teste = [50];
    while (anterior < t) {
      anterior = anterior * 2;
      teste.push(anterior);
    }
    this.rowsPerPageOptions = teste;
  }

  onDestroy(): void {
    sessionStorage.removeItem('cadastro-busca');
    sessionStorage.removeItem('cadastro-tabela');
    sessionStorage.removeItem('cadastro-table');
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.expandidoSN = false;
    if (!this.stateSN) {
      this.cadastros = [];
      delete this.expandido;
      sessionStorage.removeItem('cadastro-table');
    }
    // this.stateSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }


}
