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
  proposicao_id: number = 0;
  idx: number = -1;
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
    const url = this.url.andamentoproposicao + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  alterar(dados: AndamentoProposicaoFormI): Observable<any[]> {
    const url = this.url.andamentoproposicao;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  delete(id: number, id2 = 0): Observable<any[]> {
    const url = this.url.andamentoproposicao + '/' + id + '/' + id2;
    return this.http.delete<any[]>(url);
  }
}
