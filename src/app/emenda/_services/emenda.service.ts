import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../util/_services';
import {
  EmendaBuscaInterface,
  EmendaDetalheInterface,
  EmendaFormularioInterface,
  EmendaInterface, EmendaListarInterface,
  EmendaPaginacaoInterface
} from '../_models';
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EmendaService {

  emendaExcluir: EmendaListarInterface = null;
  expandidoDados: any = false;

  private expandido = new Subject();

  constructor(private url: UrlService, private http: HttpClient) { }


  incluirEmenda(dados: EmendaFormularioInterface): Observable<any[]> {
    const url = this.url.emenda + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  postEmendaBusca(dados: EmendaBuscaInterface): Observable<EmendaPaginacaoInterface> {
    const url = this.url.emenda + '/listar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<EmendaPaginacaoInterface>(url, dados, httpOptions);
  }


  getTitulos(): void {
    let titulos: any[];
    if (!sessionStorage.getItem('emenda-titulos')) {
      this.getEmendaTitulo()
        .pipe(take(1))
        .subscribe((dados) => {
            titulos = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('emenda-titulos', JSON.stringify(titulos));
          }
        );
    }
  }

  getEmendaTitulo(): Observable<any[]> {
    const url = this.url.emenda + '/titulo';
    return this.http.get<any[]>(url);
  }

  putEmendaAlterar(emenda_id: number, dados: EmendaFormularioInterface): Observable<any[]> {
    const url = this.url.emenda + '/alterar/' + emenda_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  putEmendaAtualizar(emenda_id: number, dados: any): Observable<any[]> {
    const url = this.url.emenda + '/atualizar/' + emenda_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  deleteEmendaId(emenda_id: number): Observable<any[]> {
    const url = this.url.emenda + '/' + emenda_id;
    return this.http.delete<any[]>(url);
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('emenda-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('emenda-expandido'));
      sessionStorage.removeItem('emenda-expandido');
    }
    return resp;
  }

  gravaColunaExpandida(dados) {
    sessionStorage.setItem('emenda-expandido', JSON.stringify(dados));
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'emenda_id',
      'emenda_cadastro_tipo_nome',
      'emenda_cadastro_nome',
      'emenda_autor_tipo_nome',
      'emenda_autor_nome',
      'emenda_situacao',
      'emenda_numero',
      'emenda_funcional_programatica',
      'emenda_orgao_solicitado_nome',
      'emenda_numero_protocolo',
      'emenda_assunto_nome',
      'emenda_data_solicitacao',
      'emenda_processo',
      'emenda_tipo_emenda_nome',
      'emenda_ogu_nome',
      'emenda_valor_solicitadado',
      'emenda_valor_empenhado',
      'emenda_data_empenho',
      'emenda_numero_empenho',
      'emenda_crnr',
      'emenda_gmdna',
      'emenda_observacao_pagamento',
      'emenda_data_pagamento',
      'emenda_valor_pago',
      'emenda_numero_ordem_bancaria',
      'emenda_local_nome',
      'emenda_uggestao',
      'emenda_siconv',
      'emenda_regiao',
      'emenda_contrato',
      'emenda_porcentagem',
      'cadastro_cpfcnpj',
      'cadastro_municipio_nome'
    ];
    const titulo = [
      'ID',
      'TIPO DE SOLICITANTE',
      'SOLICITANTE',
      'TIPO DE AUTOR',
      'AUTOR',
      'SITUAÇÃO',
      'NÚM EMENDA',
      'FUNC. PROGRAMÁTICA',
      'ORGÃO SOLICITADO',
      'NUM. PROTOCOLO',
      'ASSUNTO',
      'DT. SOLICITAÇÃO',
      'CONTRATO/PROCESSO',
      'TIPO DE EMENDA',
      'O.G.U.',
      'VL. SOLICITADO',
      'VL. EMPENHADO',
      'DT. EMPENHO',
      'NUM EMPENHO',
      'CR.NR.',
      'GND/MA',
      'INFO. PGTO',
      'DT. PAGAMENTO',
      'VL PAGAMENTO',
      'ORD. BANCÁRIA',
      'NÚCLEO',
      'UG/GESTÃO',
      'SICONV',
      'REGIÃO',
      'CONTRATO CAIXA',
      '% CONCLUIDA',
      'CPF/CNPJ',
      'MUNICÍPIO'
    ];
    let a = 0;
    const b: any[] = [];

    for (const v in ev) {
      if (ev[v] !== null) {
        if (ev[v].toString().length > 0 && ev[v].toString() != '0') {
          const n = campo.indexOf(v);
          if (n >= 0) {
            const cc: string[] = [];
            cc.push(titulo[n].toString());
            if (v === 'emenda_valor_solicitadado' || v === 'emenda_valor_empenhado' || v === 'emenda_valor_pago'){
              ev[v] = 'R$ ' + ev[v].toString().replace('.', ',');
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
