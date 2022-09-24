import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {SelectItem, SelectItemGroup} from 'primeng/api';
import {UrlService} from './url.service';
// import {SolicitacaoDropdownMenuListarInterface} from "../solicitacao/_models";
// import {CadastroMenuDropdown} from "../cadastro/_models";
import {take} from "rxjs/operators";


@Injectable({
  providedIn: 'root' // just before your class
})
export class DropdownService {

  private sub: Subscription[] = [];
  private dropdownSimples$: Observable<SelectItem[]> | undefined;
  private dropdownAgrupado$: Observable<SelectItemGroup> | undefined;
  private dropdownAgrupados$: Observable<SelectItemGroup[]> | undefined;
  private dropdownArray$: Observable<any[]> | undefined;
  meses: SelectItem[] = [
    { label: 'JANEIRO', value: '01' },
    { label: 'FEVEREIRO', value: '02' },
    { label: 'MARÇO', value: '03' },
    { label: 'ABRIL', value: '04' },
    { label: 'MAIO', value: '05' },
    { label: 'JUNHO', value: '06' },
    { label: 'JULHO', value: '07' },
    { label: 'AGOSTO', value: '08' },
    { label: 'SETEMBRO', value: '09' },
    { label: 'OUTUBRO', value: '10' },
    { label: 'NOVEMBRO', value: '11' },
    { label: 'DEZEMBRO', value: '12' }
  ];
  dias: SelectItem[] = [
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' }
  ];
  quinzena: SelectItem[] = [
    { label: '1' + decodeURI('\xAA'), value: '15' },
    { label: '2' + decodeURI('\xAA'), value: '31' }
  ];
  sexo: SelectItem[] = [
    { label: 'MASCULINO', value: 'M' },
    { label: 'FEMININO', value: 'F' },
    { label: 'OUTROS', value: 'O' },
    { label: 'PJ', value: 'P' }
  ];
  snTodos: SelectItem[] = [
    { label: 'TODOS', value: '0' },
    { label: 'SIM', value: '1' },
    { label: 'NÃO', value: '2' }
  ];

  constructor(
    private http: HttpClient,
    private url: UrlService
  ) {
  }

  public getDropdownSimple(tabela: string, campo_id: string, campo_nome: string, campo_sort: string): Observable<SelectItem[]> {
    let dd: string;
    dd = this.url.dropdown + '/simples'
      + '/' + tabela
      + '/' + campo_id
      + '/' + campo_nome
      + '/' + campo_sort;
    this.dropdownSimples$ = this.http.get<SelectItem[]>(dd);
    return this.dropdownSimples$;
  }

  public getDropdown3campos(tabela: string, campo_id: string, campo_nome: string, campo_pesquisa: string, valor: any, params?: string) {
    let dd: string;
    dd = this.url.dropdown + '/dd3campos'
      + '/' + tabela
      + '/' + campo_id
      + '/' + campo_nome
      + '/' + campo_pesquisa
      + '/' + valor;
    if (params) {
      dd += '/' + params;
    }
    this.dropdownAgrupado$ = this.http.get<SelectItemGroup>(dd);
    return this.dropdownAgrupado$;
  }

  public getDropdownCadastroTipoIncluir() {
    let dd: string;
    dd = this.url.dropdown + '/cadtipoincluir';
    return this.http.get<SelectItemGroup[]>(dd);
    // const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
    // this.dropdownAgrupados$ = this.http.get<SelectItemGroup[]>(dd);
    // return this.dropdownSimples$;
  }

  public getDropdownSolCadTipo() {
    let dd: string;
    dd = this.url.dropdown + '/solcadtipo';
    return this.http.get<SelectItemGroup[]>(dd);
    // const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
    // this.dropdownAgrupados$ = this.http.get<any[]>(dd);
    // return this.dropdownSimples$;
  }

  public postDropdown3campos(dados: any): Observable<SelectItem[]> {
    let dd: string;
    dd = this.url.dropdown + '/dd3campos';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownSimples$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownSimples$;
  }

  public getDropdownSoNomeAgrupado(tabela: string, campo: string, params?: string) {
    let dd: string;
    dd = this.url.dropdown + '/sonomeagrupado'
      + '/' + tabela
      + '/' + campo;
    if (params) {
      dd += '/' + params;
    }
    this.dropdownSimples$ = this.http.get<SelectItem[]>(dd);
    // console.log(this.dropdownSimples$);
    return this.dropdownSimples$;
  }

  public getDropdownNomeId(tabela: string, campo_id: string, campo_nome: string, params?: string): Observable<SelectItem[]> {
    let dd: string;
    dd = this.url.dropdown + '/nomeid'
      + '/' + tabela
      + '/' + campo_id
      + '/' + campo_nome;
    if (params) {
      dd += '/' + params;
    }
    this.dropdownSimples$ = this.http.get<SelectItem[]>(dd);
    return this.dropdownSimples$;
  }

  public postDropdownNomeId(dados: any): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/nomeid';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(dd, dados, httpOptions);
  }

  public postDropdownNomeIdArray(dados: any[]): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/nomeidarray';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public postDropdownNomeIdJoinArray(dados: any[]): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/nomeidjoinarray';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public postDropdownNomeIdWhere(
    tabela: string,
    campo_id: string,
    campo_nome: string,
    wcampo: string,
    woperador: string,
    wvalor: string,
    parametros?: string
  ): Observable<any[]> {
    const dados = [{tabela, campo_id, campo_nome, wcampo, woperador, wvalor, parametros}];
    let dd: string;
    dd = this.url.dropdown + '/nomeidw';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public postDropdownSoNomeArray(dados: any[]): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sonomearray';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public postDropdownSoNome(dados: any): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sonome';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(dd, dados, httpOptions);
  }

  public postDropdownSoNome2(dados: any): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sonome2';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(dd, dados, httpOptions);
  }

  public postDropdownSoDataArray(dados: any[]): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sodataarray';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public postDropdownSoDataFormatadoArray(dados: any[]): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sodataformatarray';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public getDropdownNomeIdConcat(
    tabela: string,
    campo_id: string,
    campo_nome1: string,
    campo_nome2: string,
    params?: string): Observable<SelectItem[]> {
    let dd: string;
    dd = this.url.dropdown + '/dd3camposconcat'
      + '/' + tabela
      + '/' + campo_id
      + '/' + campo_nome1
      + '/' + campo_nome2;
    if (params) {
      dd += '/' + params;
    }
    this.dropdownSimples$ = this.http.get<SelectItem[]>(dd);
    return this.dropdownSimples$;
  }

  public getDropdownSoNome(tabela: string, campo_nome: string, params?: string): Observable<SelectItem[]> {
    let dd: string;
    dd = this.url.dropdown + '/sonome'
      + '/' + tabela
      + '/' + campo_nome;
    if (params) {
      dd += '/' + params;
    }
    this.dropdownSimples$ = this.http.get<SelectItem[]>(dd);
    return this.dropdownSimples$;
  }

  public transformaLabel(entrada: SelectItem[], num: number): SelectItem[] {
    const b: SelectItem[] = [];
    for (const a of entrada) {
      a.label = a.label?.substring(0, num);
      b.push(a);
    }
    return b;
  }

  public getDropdownMunReg(campo_id: string): Observable<SelectItem[]> {
    let dd: string;
    dd = this.url.dropdown + '/munreg/' + campo_id;
    this.dropdownSimples$ = this.http.get<SelectItem[]>(dd);
    return this.dropdownSimples$;
  }

  public postDropdownOficio(tipo: string, id?: number): Observable<SelectItem[]> {
    const dados = [{tipo, id}];
    let dd: string;
    dd = this.url.dropdown + '/oficiotipoid';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.dropdownSimples$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownSimples$;
  }

  public getDropdownOficioProcessoId(): Observable<SelectItem[]> {
    const url = this.url.dropdown + '/oficioprocessoid';
    this.dropdownSimples$ = this.http.get<SelectItem[]>(url);
    return this.dropdownSimples$;
  }

  public getDropdownOficioCodigo(): Observable<SelectItem[]> {
    const url = this.url.dropdown + '/oficiocodigo';
    this.dropdownSimples$ = this.http.get<SelectItem[]>(url);
    return this.dropdownSimples$;
  }

  public getDropdownTarefaAutores(): Observable<any[]> {
    const url = this.url.dropdown + '/tarefaautores';
    return this.http.get<any[]>(url);
  }

  public getDropdownEmendaMenuTodos(): Observable<any[]> {
    const url = this.url.dropdown + '/emendamenutodos';
    return this.http.get<SelectItem[]>(url);
  }

  public getDropdownEmendaMenu(campo: string): Observable<SelectItem[]> {
    const url = this.url.dropdown + '/emendamenu/' + campo;
    return this.http.get<SelectItem[]>(url);
  }

  public getDropdownTipoCadastroConcat(): Observable<any[]> {
    const url = this.url.dropdown + '/ddtipocadastroconcat';
    return this.http.get<any[]>(url);
  }

/*  public getDropdownSolicitacaoMenuTodos(): Observable<SolicitacaoDropdownMenuListarInterface> {
    const url = this.url.dropdown + '/solicitacaomenutodos';
    return this.http.get<SolicitacaoDropdownMenuListarInterface>(url);
  }*/

  public getDropdownResponsavel(): Observable<SelectItem[]> {
    const url = this.url.dropdown + '/responsavel';
    return this.http.get<SelectItem[]>(url);
  }

  /*public getDropdownCadastroMenuTodos(): Observable<CadastroMenuDropdown> {
    const url = this.url.dropdown + '/cadastromenutodos';
    return this.http.get<CadastroMenuDropdown>(url);
  }
*/
/*  public getDdSolicitacaoMenuTodos() {
    if (sessionStorage.getItem('solic-menu-dropdown')) {
      sessionStorage.removeItem('solic-menu-dropdown');
    }
    this.sub.push(this.getDropdownSolicitacaoMenuTodos()
      .pipe(take(1))
      .subscribe((dados) => {
          sessionStorage.setItem('solic-menu-dropdown', JSON.stringify(dados));
        },
        (err) => console.error(err),
        () => {
          this.onDestroy();
        }
      )
    );
  }*/

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


}
