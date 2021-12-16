import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { SelectItemGroup } from 'primeng/api';
import { UrlService } from './url.service';


@Injectable({
  providedIn: 'root' // just before your class
})
export class DropdownService {

  private dropdownSimples$: Observable<SelectItem[]> | undefined;
  private dropdownAgrupado$: Observable<SelectItemGroup> | undefined;
  private dropdownAgrupados$: Observable<SelectItemGroup[]> | undefined;
  private dropdownArray$: Observable<any[]> | undefined;

  constructor(
    private http: HttpClient,
    private url: UrlService
  ) {
  }

  public getDropdownSimple(tabela: string, campo_id: string, campo_nome: string, campo_sort: string ): Observable<SelectItem[]> {
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
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
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

  public getDropdownNomeId(tabela: string, campo_id: string, campo_nome: string, params?: string ): Observable<SelectItem[]> {
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
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public postDropdownSoNome(dados: any): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sonome';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
    return this.http.post<any[]>(dd, dados, httpOptions);
  }

  public postDropdownSoNome2(dados: any): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sonome2';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
    return this.http.post<any[]>(dd, dados, httpOptions);
  }

  public postDropdownSoDataArray(dados: any[]): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sodataarray';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public postDropdownSoDataFormatadoArray(dados: any[]): Observable<any[]> {
    let dd: string;
    dd = this.url.dropdown + '/sodataformatarray';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
    this.dropdownArray$ = this.http.post<any[]>(dd, dados, httpOptions);
    return this.dropdownArray$;
  }

  public getDropdownNomeIdConcat(
    tabela: string,
    campo_id: string,
    campo_nome1: string,
    campo_nome2: string,
    params?: string ): Observable<SelectItem[]> {
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

  public getDropdownSoNome(tabela: string, campo_nome: string, params?: string ): Observable<SelectItem[]> {
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
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};
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


}
