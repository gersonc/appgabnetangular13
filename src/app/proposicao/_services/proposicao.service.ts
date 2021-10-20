import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import {
  ProposicaoBuscaInterface,
  ProposicaoDetalheInterface, ProposicaoFormulario,
  ProposicaoListagemInterface,
  ProposicaoPaginacaoInterface
} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ProposicaoService {
  incluirResposta$: Observable<any[]>;
  alterarResposta$: Observable<any[]>;
  analisar$: Observable<any[]>;
  delete$: Observable<any[]>;
  listagemState: any;
  expandidoDados: any = false;
  detalhe$: Observable<ProposicaoDetalheInterface>;
  proposicaoListagem$: Observable<ProposicaoPaginacaoInterface>;

  private expandido = new Subject();

  constructor(private url: UrlService, private http: HttpClient) { }

  postProposicaoBusca(dados: ProposicaoBuscaInterface): Observable<ProposicaoPaginacaoInterface> {
    const url = this.url.proposicao + '/listar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<ProposicaoPaginacaoInterface>(url, dados, httpOptions);
  }

  getProposicaoDetalhe(proposicao_id: number): Observable<ProposicaoDetalheInterface> {
    const url = this.url.proposicao + '/detalhe/' + proposicao_id;
    this.detalhe$ = this.http.get<ProposicaoDetalheInterface>(url);
    return this.detalhe$;
  }

  incluirProposicao(dados: ProposicaoListagemInterface): Observable<any[]> {
    const url = this.url.proposicao + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.incluirResposta$ = this.http.post<any[]> (url, dados, httpOptions);
    return this.incluirResposta$;
  }

  getProposicaoAlterar(proposicao_id: number): Observable<ProposicaoListagemInterface> {
    const url = this.url.proposicao + '/alterar/' + proposicao_id;
    return this.http.get<ProposicaoListagemInterface>(url);
  }

  putProposicaoAlterar(proposicao_id: number, dados: ProposicaoListagemInterface): Observable<any[]> {
    const url = this.url.proposicao + '/alterar/' + proposicao_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  getProposicaoExcluir(proposicao_id: number): Observable<ProposicaoListagemInterface> {
    const url = this.url.proposicao + '/apagar/' + proposicao_id;
    return this.http.get<ProposicaoListagemInterface>(url);
  }

  deleteProposicaoId(proposicao_id: number): Observable<any[]> {
    const url = this.url.proposicao + '/' + proposicao_id;
    return this.http.delete<any[]>(url);
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('proposicao-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('proposicao-expandido'));
      sessionStorage.removeItem('proposicao-expandido');
    }
    return resp;
  }

  gravaColunaExpandida(dados) {
    sessionStorage.setItem('proposicao-expandido', JSON.stringify(dados));
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'proposicao_id',
      'proposicao_tipo_nome',
      'proposicao_situacao_nome',
      'proposicao_data_apresentacao',
      'proposicao_numero',
      'proposicao_autor',
      'proposicao_area_interesse_nome',
      'proposicao_emenda_tipo_nome',
      'proposicao_parecer',
      'proposicao_relator',
      'proposicao_relator_atual',
      'proposicao_origem_nome',
      'proposicao_orgao_nome',
    ];
    const titulo = [
      'Id',
      'Tipo',
      'Situação',
      'Data de apresentação',
      'Número',
      'Autor',
      'Área de interesse',
      'Tipo de emenda',
      'Parecer',
      'Relator',
      'Relator atual',
      'Orgão de origem',
      'Orgão atual',
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
