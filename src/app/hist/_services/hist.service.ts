import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject, Subscription} from "rxjs";
import {HistFormI, HistI} from "../_models/hist-i";
import {HistAuxService} from "./hist-aux.service";


@Injectable({
  providedIn: 'root'
})
export class HistService {


  constructor(
    private url: UrlService,
    private http: HttpClient,
    public has: HistAuxService
  ) { }



  incluir(dados: HistFormI): Observable<any[]> {
    console.log('dados', dados);
    const envio: HistI = dados.hist;
    let url: string = '';
    if (dados.modulo === 'solicitacao') {
      url = this.url.historicoSolicitacao;
    }
    if (dados.modulo === 'processo') {
      url = this.url.historicoProcesso;
    }
    if (dados.modulo === 'emenda') {
      url = this.url.historicoEmenda;
    }
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    console.log('url', url);
    return this.http.post<any[]> (url, envio, httpOptions);
  }

  alterar(dados: HistFormI): Observable<any[]> {
    const envio: HistI = dados.hist;
    let url: string = '';
    if (dados.modulo === 'solicitacao') {
      url = this.url.historicoSolicitacao;
    }
    if (dados.modulo === 'processo') {
      url = this.url.historicoProcesso;
    }
    if (dados.modulo === 'emenda') {
      url = this.url.historicoEmenda;
    }
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]> (url, envio, httpOptions);
  }


  delete(id: number, modulo: string): Observable<any[]> {
    let url: string = '';
    if (modulo === 'solicitacao') {
      url = this.url.historicoSolicitacao + '/' + id;
    }
    if (modulo === 'processo') {
      url = this.url.historicoProcesso + '/' + id;
    }
    if (modulo === 'emenda') {
      url = this.url.historicoEmenda + '/' + id;
    }
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.delete<any[]>(url, httpOptions);
  }

}
