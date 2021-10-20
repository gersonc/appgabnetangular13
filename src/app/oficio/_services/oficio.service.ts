import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import {
  OficioBuscaInterface,
  OficioDetalheInterface,
  OficioFormularioInterface,
  OficioInterface,
  OficioPaginacaoInterface
} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class OficioService {

  incluirResposta$: Observable<any[]>;
  alterarResposta$: Observable<any[]>;
  analisar$: Observable<any[]>;
  delete$: Observable<any[]>;
  listagemState: any;
  detalhe$: Observable<OficioDetalheInterface>;
  oficioListagem$: Observable<OficioPaginacaoInterface>;
  codigo$: Observable<string>;
  processo$: Observable<any[]>;
  getalterar$: Observable<OficioInterface>;
  getAnalisar$: Observable<OficioInterface>;
  expandidoDados: any = false;

  private expandido = new Subject();
  private camposTexto: string[];

  constructor(private url: UrlService, private http: HttpClient) { }

  getNovoCodigo(processo_id) {
    let url: string;
    url = this.url.oficio + '/codigo/' + processo_id;
    this.codigo$ = this.http.get<string>(url);
    return this.codigo$;
  }

  incluirOficio(dados: OficioFormularioInterface): Observable<any[]> {
    const url = this.url.oficio + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.incluirResposta$ = this.http.post<any[]> (url, dados, httpOptions);
    return this.incluirResposta$;
  }

  getProcessoId(processo_id): Observable<any[]> {
    const url = this.url.oficio + '/processo/' + processo_id;
    this.processo$ = this.http.get<any[]>(url);
    return this.processo$;
  }

  postOficioBusca(dados: OficioBuscaInterface): Observable<OficioPaginacaoInterface> {
    const url = this.url.oficio + '/listar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.oficioListagem$ = this.http.post<OficioPaginacaoInterface>(url, dados, httpOptions);
    return this.oficioListagem$;
  }

  getOficioDetalhe(oficio_id: number): Observable<OficioDetalheInterface> {
    const url = this.url.oficio + '/detalhe/' + oficio_id;
    this.detalhe$ = this.http.get<OficioDetalheInterface>(url);
    return this.detalhe$;
  }

  getOficioAlterar(oficio_id: number): Observable<OficioInterface> {
    const url = this.url.oficio + '/alterar/' + oficio_id;
    this.getalterar$ = this.http.get<OficioInterface>(url);
    return this.getalterar$;
  }

  putOficioAlterar(oficio_id: number, dados: OficioFormularioInterface): Observable<any[]> {
    const url = this.url.oficio + '/alterar/' + oficio_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.alterarResposta$ = this.http.put<any[]>(url, dados, httpOptions);
    return this.alterarResposta$;
  }

  getOficioIdAnalisar(oficio_id: number): Observable<OficioInterface> {
    const url = this.url.oficio + '/analisar/' + oficio_id;
    this.getAnalisar$ = this.http.get<OficioInterface>(url);
    return this.getAnalisar$;
  }

  putOficioAnalisar(oficio_id: number, dados: any): Observable<any[]> {
    const url = this.url.oficio + '/analisar/' + oficio_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.analisar$ = this.http.put<any[]>(url, dados, httpOptions);
    return this.analisar$;
  }

  deleteOficioId(oficio_id: number): Observable<any[]> {
    const url = this.url.oficio + '/' + oficio_id;
    this.delete$ = this.http.delete<any[]>(url);
    return this.delete$;
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('oficio-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('oficio-expandido'));
      sessionStorage.removeItem('oficio-expandido');
    }
    return resp;
  }

  gravaColunaExpandida(dados) {
    sessionStorage.setItem('oficio-expandido', JSON.stringify(dados));
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'oficio_id',
      'oficio_processo_numero',
      'oficio_codigo',
      'oficio_status',
      'oficio_numero',
      'oficio_convenio',
      'solicitacao_reponsavel_analize_nome',
      'oficio_data_emissao',
      'oficio_tipo_solicitante_nome',
      'oficio_cadastro_nome',
      'oficio_municipio_nome',
      'oficio_assunto_nome',
      'oficio_area_interesse_nome',
      'oficio_orgao_solicitado_nome',
      'oficio_orgao_protocolante_nome',
      'oficio_protocolo_numero',
      'oficio_data_protocolo',
      'oficio_protocolante_funcionario',
      'solicitacao_local_nome',
      'oficio_data_empenho',
      'oficio_valor_solicitado',
      'oficio_valor_recebido',
      'oficio_data_pagamento',
      'oficio_data_recebimento',
      'oficio_prazo',
      'oficio_prioridade_nome',
      'oficio_tipo_andamento_nome',
      'oficio_tipo_recebimento_nome',
      'oficio_solicitacao_descricao',
      'oficio_descricao_acao'

    ];
    const titulo = [
      'Id',
      'Nº processo',
      'Codigo',
      'Situação',
      'Número',
      'Convenio',
      'Resp. analise',
      'Dt. emissão',
      'Tp. solicitante',
      'Solicitante',
      'Município',
      'Assunto',
      'Área de interesse',
      'Org. solicitado',
      'Org. protocolante',
      'Nº protocolo',
      'Dt. Prorocolo',
      'Protocolo funcionário',
      'Núcleo',
      'Dt. empenho',
      'Vl. solicitado',
      'Vl. recebido',
      'Dt. pagamento',
      'Dt. recebimento',
      'Prazo',
      'Prioridade',
      'Tp. andamento',
      'Tp. recebimento',
      'Solicitação',
      'Desc. ofício'
    ];

    this.camposTexto = [
      'oficio_descricao_acao',
      'oficio_solicitacao_descricao',
    ];

    let a = 0;
    const b: any[] = [];

    for (const v in ev) {
      if (ev[v] !== null) {
        if (ev[v].toString().length > 0) {
          const n = campo.indexOf(v);
          const m = this.camposTexto.indexOf(v);
          if (n >= 0) {
            const cc: any[] = [];
            const tit = titulo[n].toString();
            let vf = false;
            let txtdelta: string = null;
            let txt: string = null;
            let tst = '';
            // cc.push(this.titulos[n].toString());
            if (m >= 0) {
              switch (v) {
                case 'oficio_solicitacao_descricao' : {
                  tst = (ev['oficio_solicitacao_descricao_texto']) ? ev['oficio_solicitacao_descricao_texto'] : ev['oficio_solicitacao_descricao'];
                  txt = (ev['oficio_solicitacao_descricao_texto']) ? ev['oficio_solicitacao_descricao_texto'] : null;
                  txtdelta = (ev['oficio_solicitacao_descricao_delta']) ? ev['oficio_solicitacao_descricao_delta'] : null;
                  vf = true;
                  break;
                }
                case 'oficio_descricao_acao' : {
                  tst = (ev['oficio_descricao_acao_texto']) ? ev['oficio_descricao_acao_texto'] : ev['oficio_descricao_acao'];
                  txt = (ev['oficio_descricao_acao_texto']) ? ev['oficio_descricao_acao_texto'] : null;
                  txtdelta = (ev['oficio_descricao_acao_delta']) ? ev['oficio_descricao_acao_delta'] : null;
                  vf = true;
                  break;
                }
              }
              /*cc.push(ev[v].toString());
              b.push(cc);
              a++;*/
            } else {
              tst = ev[v].toString();
            }
            b.push([tit, tst, vf, txt, txtdelta]);
            a++;
            }
        }
      }
    }
    /*const tamanho = b.length;
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
    this.expandido.next(idxC);*/
    this.expandido.next(b);
  }


}
