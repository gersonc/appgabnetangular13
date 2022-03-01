import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SolicitacaoHistoricoInterface} from "../../solocitacao/_models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoricoSolicitacaoService {

  constructor(private url: UrlService, private http: HttpClient) { }

  incluir(dados: SolicitacaoHistoricoInterface): Observable<any[]> {
    const url = this.url.historicoSolicitacao + '/';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  alterar(dados: SolicitacaoHistoricoInterface): Observable<any[]> {
    const url = this.url.historicoSolicitacao + '/';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]> (url, dados, httpOptions);
  }

  delete(id: number): Observable<any[]> {
    const url = this.url.historicoSolicitacao + '/' + id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.delete<any[]>(url, httpOptions);
  }
}
