import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ProcessoHistoricoInterface} from "../../processo/_models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoricoProcessoService {

  constructor(private url: UrlService, private http: HttpClient) { }

  incluir(dados: ProcessoHistoricoInterface): Observable<any[]> {
    const url = this.url.historicoProcesso + '/';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  alterar(dados: ProcessoHistoricoInterface): Observable<any[]> {
    const url = this.url.historicoProcesso + '/';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]> (url, dados, httpOptions);
  }

  delete(id: number): Observable<any[]> {
    const url = this.url.historicoProcesso + '/' + id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.delete<any[]>(url, httpOptions);
  }
}