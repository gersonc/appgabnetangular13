import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../util/_services';
import { AndamentoProposicaoFormulario, AndamentoProposicaoFormularioInterface, AndamentoProposicaoListagemInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AndamentoProposicaoService {
  ap: AndamentoProposicaoFormularioInterface;

  constructor(private url: UrlService, private http: HttpClient) { }

  criarAndamentoProposicao() {
    this.ap = new AndamentoProposicaoFormulario();
  }

  resetAndamentoProposicao() {
    delete this.ap;
    this.criarAndamentoProposicao();
  }

  filtraAndamentoProposicao(): AndamentoProposicaoFormulario {
    const and = new AndamentoProposicaoFormulario();
    for (const key in and) {
      if (this.ap[key]) {
        if (this.ap[key] === null) {
          delete this.ap[key];
          delete and[key];
        } else {
          and[key] = this.ap[key];
        }
      } else {
        delete and[key];
      }
    }
    return and;
  }

  getAndamentoProposicaoListagem(proposicao_id: number): Observable<AndamentoProposicaoListagemInterface[]> {
    const url = this.url.andamentoproposicao + '/listar/' + proposicao_id;
    return this.http.get<AndamentoProposicaoListagemInterface[]>(url);
  }

  postAndamentoProposicaoIncluir(dados: AndamentoProposicaoFormulario): Observable<any[]> {
    const url = this.url.andamentoproposicao + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  putAndamentoProposicaoAlterar(dados: AndamentoProposicaoFormulario): Observable<any[]> {
    const url = this.url.andamentoproposicao;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  deleteAndamentoProposicao(id: number, id2 = 0): Observable<any[]> {
    const url = this.url.andamentoproposicao + '/' + id + '/' + id2;
    return this.http.delete<any[]>(url);
  }
}
