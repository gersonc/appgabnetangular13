import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../util/_services';
import {
  TelefoneBuscaInterface,
  TelefoneDetalheInterface,
  TelefoneFormulario,
  TelefoneInterface,
  TelefonePaginacaoInterface
} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {
  tl: TelefoneInterface | undefined;
  expandidoDados: any = false;

  private expandido = new Subject();

  constructor(private url: UrlService, private http: HttpClient) { }

  criarTelefone() {
    this.tl = new TelefoneFormulario();
  }

  resetTelefone() {
    delete this.tl;
    this.criarTelefone();
  }

  filtraTelefone(): TelefoneFormulario {
    const and = new TelefoneFormulario();
    for (const key in and) {
      // @ts-ignore
      if (this.tl[key]) {
        // @ts-ignore
        if (this.tl[key] === null) {
          // @ts-ignore
          delete this.tl[key];
          // @ts-ignore
          delete and[key];
        } else {
          // @ts-ignore
          and[key] = this.tl[key];
        }
      } else {
        // @ts-ignore
        delete and[key];
      }
    }
    if (!and['telefone_resolvido']) {
      // @ts-ignore
      and['telefone_resolvido'] = +0;
    }
    return and;
  }

  incluirTelefone(dados: TelefoneFormulario): Observable<any[]> {
    const url = this.url.telefone + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }


  postTelefoneBusca(dados: TelefoneBuscaInterface): Observable<TelefonePaginacaoInterface> {
    const url = this.url.telefone + '/listar';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.post<TelefonePaginacaoInterface>(url, dados, httpOptions);
  }

  getTelefoneDetalhe(telefone_id: number): Observable<TelefoneDetalheInterface> {
    const url = this.url.telefone + '/detalhe/' + telefone_id;
    return  this.http.get<TelefoneDetalheInterface>(url);
  }

  getTelefoneAlterar(telefone_id: number): Observable<TelefoneInterface> {
    const url = this.url.telefone + '/alterar/' + telefone_id;
    return this.http.get<TelefoneInterface>(url);
  }

  putTelefoneAlterar(telefone_id: number, dados: TelefoneFormulario): Observable<any[]> {
    const url = this.url.telefone + '/' + telefone_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  deleteTelefoneId(telefone_id: number): Observable<any[]> {
    const url = this.url.telefone + '/' + telefone_id;
    return this.http.delete<any[]>(url);
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('telefone-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(<string>sessionStorage.getItem('telefone-expandido'));
      sessionStorage.removeItem('telefone-expandido');
    }
    return resp;
  }

  gravaColunaExpandida(dados: any) {
    sessionStorage.setItem('telefone-expandido', JSON.stringify(dados));
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'telefone_assunto',
      'telefone_data',
      'telefone_ddd',
      'telefone_de',
      'telefone_id',
      'telefone_local_nome',
      'telefone_observacao',
      'telefone_para',
      'telefone_resolvido',
      'telefone_telefone',
      'telefone_tipo',
      'telefone_usuario_nome'
    ];
    const titulo = [
      'Assunto',
      'Data',
      'DDD',
      'De',
      'Id',
      'Núcleo',
      'Observações',
      'Para',
      'Resolvido',
      'Telefone',
      'Convenio',
      'Tipo',
      'Atendente'
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
            switch (v) {
              case 'telefone_tipo' : {
                switch (ev[v]) {
                  case 1 : {
                    ev[v] = 'RECEBIDO';
                    break;
                  }
                  case 2 : {
                    ev[v] = 'FEITA';
                    break;
                  }
                  default: {
                    ev[v] = 'FEITO';
                    break;
                  }
                }
                break;
              }
              case 'telefone_resolvido' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'RESOLVIDO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'NÃO RESOLVIDO';
                    break;
                  }
                  default: {
                    ev[v] = 'NÃO RESOLVIDO';
                    break;
                  }
                }
                break;
              }
            }
            cc.push(ev[v].toString());
            b.push(cc);
            a++;
          }
        }
      }
    }
    const tamanho = b.length;
    let linhas: number = tamanho;
    let colunas = 1;
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
