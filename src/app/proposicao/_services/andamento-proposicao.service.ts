import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import {AndamentoProposicaoFormI, AndamentoProposicaoI, AndPropI} from "../_models/andamento-proposicao-i";

@Injectable({
  providedIn: 'root'
})
export class AndamentoProposicaoService {
  apListar: AndamentoProposicaoI[] | null = null;
  ap: AndamentoProposicaoI | null = null;
  proposicao_id = 0;
  idx = -1;
  andPropForm: AndPropI | null = null;
  andPropList: AndPropI | null = null;

  constructor(private url: UrlService, private http: HttpClient) { }

  criarAndamentoProposicao() {
    this.andPropForm = {};
  }

  resetAndamentoProposicao() {
    this.andPropForm = null;
    this.criarAndamentoProposicao();
  }


  incluir(dados: AndamentoProposicaoFormI): Observable<any[]> {
    const url = this.url.andamentoproposicao;
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  alterar(dados: AndamentoProposicaoFormI): Observable<any[]> {
    const url = this.url.andamentoproposicao;
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  delete(id: number, id2 = 0): Observable<any[]> {
    const url = this.url.andamentoproposicao + '/apagar/' + id + '/' + id2;
    return this.http.delete<any[]>(url, { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})});
  }

  apagar(id: number): Observable<any[]> {
    const url = this.url.andamentoproposicao + '/' + id ;
    return this.http.delete<any[]>(url, { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})});
  }
}
