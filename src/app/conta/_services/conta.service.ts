import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import {
  ContaBuscaInterface,
  ContaDetalheInterface,
  ContaFormulario, ContaFormularioInterface,
  ContaInterface,
  ContaPaginacaoInterface
} from '../_models';
import { isArray } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  constructor(private url: UrlService, private http: HttpClient) { }
  ct: ContaFormularioInterface;
  expandidoDados: any = false;

  private expandido = new Subject();

  static recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('conta-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('conta-expandido'));
      sessionStorage.removeItem('conta-expandido');
    }
    return resp;
  }

  static gravaColunaExpandida(dados) {
    sessionStorage.setItem('conta-expandido', JSON.stringify(dados));
  }

  criarConta() {
    this.ct = new ContaFormulario();
  }

  resetConta() {
    delete this.ct;
    this.criarConta();
  }

  filtraConta(d: ContaFormulario): ContaFormulario {
    const and = new ContaFormulario();
    for (const key in and) {
      if (d[key] === false) {
        and[key] = 0;
        continue;
      }
      if (d[key] === true) {
        and[key] = 1;
        continue;
      }
      if (isArray(d[key])) {
        if (d[key].lenght > 0) {
          and[key] = d[key];
          continue;
        } else {
          delete d[key];
          delete and[key];
          continue;
        }
      }
      if (this.ct[key] === undefined) {
        delete and[key];
        delete d[key];
        continue;
      }
      if (d[key] === null) {
        delete d[key];
        delete and[key];
        continue;
      }
      and[key] = d[key];
    }
    return and;
  }

  incluirConta(dados: ContaFormulario): Observable<any[]> {
    const url = this.url.conta + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  postContaBusca(dados: ContaBuscaInterface): Observable<ContaPaginacaoInterface> {
    const url = this.url.conta + '/listar';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.post<ContaPaginacaoInterface>(url, dados, httpOptions);
  }

  getContaDetalhe(conta_id: number): Observable<ContaDetalheInterface> {
    const url = this.url.conta + '/detalhe/' + conta_id;
    return  this.http.get<ContaDetalheInterface>(url);
  }

  getContaAlterar(conta_id: number): Observable<ContaInterface> {
    const url = this.url.conta + '/alterar/' + conta_id;
    return this.http.get<ContaInterface>(url);
  }

  putContaAlterarDatatable(
    conta_id: number,
    conta_paga_id: number | boolean,
    conta_pagamento: string): Observable<any[]> {

    const dados = {
      'conta_id': conta_id,
      'conta_paga': conta_paga_id,
      'conta_pagamento': conta_pagamento
    };
    const url = this.url.conta + '/alterar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  putContaAlterar(conta_id: number, dados: ContaFormulario): Observable<any[]> {
    const url = this.url.conta + '/' + conta_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  deleteContaId(conta_id: number): Observable<any[]> {
    const url = this.url.conta + '/' + conta_id;
    return this.http.delete<any[]>(url);
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'conta_id',
      'conta_cedente',
      'conta_valor',
      'conta_vencimento',
      'conta_debito_automatico',
      'conta_local_nome',
      'conta_tipo',
      'conta_paga',
      'conta_pagamento',
      'conta_observacao'
    ];
    const titulo = [
      'Id',
      'Cedente',
      'Valor',
      'Dt. venc.',
      'Dbto. Aut.',
      'Núcleo',
      'Tipo',
      'Pago',
      'Dt. Pagto.',
      'Observações'
    ];
    let a = 0;
    const b: any[] = [];

    for (const v in ev) {
      if (ev[v] !== null) {
        if (ev[v].toString().length > 0) {
          const n = campo.indexOf(v);
          if (n >= 0) {
            const cc: string[] = [];
            cc.push(titulo[n].toString());
            /*switch (v) {
              case 'conta_debito_automatico' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'NÃO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'SIM';
                    break;
                  }
                  case false : {
                    ev[v] = 'NÃO';
                    break;
                  }
                  case true : {
                    ev[v] = 'SIM';
                    break;
                  }
                  default: {
                    ev[v] = 'NÃO';
                    break;
                  }
                }
                break;
              }
              case 'conta_tipo' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'FIXA';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'VARIÁVEL';
                    break;
                  }
                  case false : {
                    ev[v] = 'FIXA';
                    break;
                  }
                  case true : {
                    ev[v] = 'VARIÁVEL';
                    break;
                  }
                  default: {
                    ev[v] = 'FIXA';
                    break;
                  }
                }
                break;
              }
              case 'conta_paga' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'NÃO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'SIM';
                    break;
                  }
                  case false : {
                    ev[v] = 'NÃO';
                    break;
                  }
                  case true : {
                    ev[v] = 'SIM';
                    break;
                  }
                  default: {
                    ev[v] = 'NÃO';
                    break;
                  }
                }
                break;
              }
            }*/
            cc.push(ev[v].toString());
            b.push(cc);
            a++;
          }
        }
      }
    }
    const tamanho = b.length;
    let linhas: number = tamanho;
    let colunas = 2;
    if (tamanho > 10) {
      colunas = 2;
      linhas = Math.ceil(tamanho / 2);
      if (linhas > 10) {
        colunas = 3;
        linhas = Math.ceil(tamanho / 3);
        if (linhas > 10) {
          colunas = 4;
          linhas = Math.ceil(tamanho / 4);
        }
      }
    } else {
      linhas = Math.ceil(tamanho / 2);
    }

    let col: number;
    let lin: number;
    const idxC = [];

    let contador = 0;
    for (col = 1; col <= colunas; col++) {
      const idcL = [];
      for (lin = 1; lin <= linhas; lin++) {
        if (contador < tamanho) {
          idcL.push(b[contador]);
        }
        contador++;
      }
      idxC.push(idcL);
    }
    const largura = (100 / colunas).toFixed(2) + '%';
    idxC.push(largura.toString());
    this.expandido.next(idxC);
  }


}
