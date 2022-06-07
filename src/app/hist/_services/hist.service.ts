import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject, Subscription} from "rxjs";
import {HistFormI, HistI} from "../_models/hist-i";


@Injectable({
  providedIn: 'root'
})
export class HistService {


  constructor(private url: UrlService, private http: HttpClient) { }



  incluir(dados: HistFormI): Observable<any[]> {
    const envio: HistI = dados.hist;
    let url: string = '';
    if (dados.modulo === 'solicitacao') {
      url = this.url.historicoSolicitacao + '/';
    }
    if (dados.modulo === 'processo') {
      url = this.url.historicoProcesso + '/';
    }
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, envio, httpOptions);
  }

  alterar(dados: HistFormI): Observable<any[]> {
    const envio: HistI = dados.hist;
    let url: string = '';
    if (dados.modulo === 'solicitacao') {
      url = this.url.historicoSolicitacao + '/';
    }
    if (dados.modulo === 'processo') {
      url = this.url.historicoProcesso + '/';
    }
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]> (url, envio, httpOptions);
  }


  delete(dados: HistFormI): Observable<any[]> {
    const id: number = dados.hist.historico_id;
    let url: string = '';
    if (dados.modulo === 'solicitacao') {
      url = this.url.historicoSolicitacao + '/' + id;
    }
    if (dados.modulo === 'processo') {
      url = this.url.historicoProcesso + '/' + id;
    }
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.delete<any[]>(url, httpOptions);
  }

}
