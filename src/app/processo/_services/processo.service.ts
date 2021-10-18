import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../util/_services';
import { ProcessoBuscaInterface, ProcessoDetalheInterface, ProcessoPaginacaoInterface } from '../_models';


@Injectable({
  providedIn: 'root'
})
export class ProcessoService {
  processoListagem$: Observable<ProcessoPaginacaoInterface>;
  processoDetalhe$: Observable<ProcessoDetalheInterface>;
  analisar$: Observable<any[]>;
  excluir$: Observable<any[]>;
  private expandido = new Subject();
  campos = [
    'processo_id',
    'processo_numero',
    'processo_status_nome',
    'processo_carta',
    'cadastro_tipo_nome',
    'cadastro_nome',
    'cadastro_endereco',
    'cadastro_endereco_numero',
    'cadastro_endereco_complemento',
    'cadastro_bairro',
    'cadastro_municipio_nome',
    'cadastro_regiao_nome',
    'cadastro_cep',
    'cadastro_estado_nome',
    'cadastro_telefone',
    'cadastro_telefone2',
    'cadastro_celular',
    'cadastro_celular2',
    'cadastro_telcom',
    'cadastro_fax',
    'cadastro_email',
    'cadastro_email2',
    'cadastro_rede_social',
    'cadastro_outras_midias',
    'cadastro_data_nascimento',
    'cadastro_grupo_nome',
    'solicitacao_data',
    'solicitacao_assunto_nome',
    'solicitacao_indicacao_sn',
    'solicitacao_indicacao_nome',
    'solicitacao_orgao',
    'solicitacao_local_nome',
    'solicitacao_tipo_recebimento_nome',
    'solicitacao_area_interesse_nome',
    'solicitacao_descricao',
    'solicitacao_aceita_recusada',
    'solicitacao_posicao'
  ];
  titulos = [
    'Id',
    'Nº processo',
    'Situação',
    'Carta',
    'Tp. solicitante',
    'Solicitante',
    'Endereço',
    'End. Número',
    'End. Complemento',
    'Bairro',
    'Município',
    'Região',
    'Cep',
    'Estado',
    'Telefone1',
    'Telefone2',
    'Celular1',
    'Celular2',
    'Celular3',
    'Fax',
    'E-mail1',
    'E-mail2',
    'Facebook',
    'Outras Midias',
    'Dt, Nascimento / Fundação',
    'Grupo',
    'Data',
    'Assunto',
    'Indicação S/N',
    'Indicação',
    'Orgão Solicitado',
    'Núcleo',
    'Tp. Recebimento',
    'Área de interesse',
    'Descrição',
    'Observações',
    'Posição'
  ];

  camposTexto = [
    'processo_carta',
    'historico_andamento',
    'solicitacao_descricao',
    'solicitacao_aceita_recusada',
    'solicitacao_carta'
  ];

  constructor(private url: UrlService, private http: HttpClient) { }

  postProcessoBusca(dados: ProcessoBuscaInterface): Observable<ProcessoPaginacaoInterface> {
    const url = this.url.processo + '/listar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.processoListagem$ = this.http.post<ProcessoPaginacaoInterface>(url, dados, httpOptions);
    return this.processoListagem$;
  }

  getProcessoDetalhe(processo_id: number): Observable<ProcessoDetalheInterface> {
    const url = this.url.processo + '/detalhe/' + processo_id;
    this.processoDetalhe$ = this.http.get<ProcessoDetalheInterface>(url);
    return this.processoDetalhe$;
  }

  putProcessoAnalisar(pro_id: number, acao: string): Observable<any[]> {
    const dados = {processo_id: pro_id, analise: acao};
    const url = this.url.processo + '/analisar/' + acao;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.analisar$ = this.http.put<any[]>(url, dados, httpOptions);
    return this.analisar$;
  }

  deleteProcesso(pro_id: number): Observable<any[]> {
    const url = this.url.processo + '/excluir/' + pro_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.excluir$ = this.http.delete<any[]>(url, httpOptions);
    return this.excluir$;
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  montaColunaExpandida2(ev: any[]) {
    const campo = [
      'processo_id',
      'processo_numero',
      'processo_status_id',
      'processo_status_nome',
      'processo_cadastro_id',
      'processo_solicitacao_id',
      'processo_carta',
      'cadastro_tipo_nome',
      'cadastro_nome',
      'cadastro_endereco',
      'cadastro_endereco_numero',
      'cadastro_endereco_complemento',
      'cadastro_bairro',
      'cadastro_municipio_nome',
      'cadastro_regiao_nome',
      'cadastro_cep',
      'cadastro_estado_nome',
      'cadastro_telefone',
      'cadastro_telefone2',
      'cadastro_celular',
      'cadastro_celular2',
      'cadastro_telcom',
      'cadastro_fax',
      'cadastro_email',
      'cadastro_email2',
      'cadastro_rede_social',
      'cadastro_outras_midias',
      'cadastro_data_nascimento',
      'solicitacao_data',
      'solicitacao_assunto_nome',
      'solicitacao_indicacao_sn',
      'solicitacao_indicacao_nome',
      'solicitacao_orgao',
      'solicitacao_local_nome',
      'solicitacao_tipo_recebimento_nome',
      'solicitacao_area_interesse_nome',
      'solicitacao_descricao',
      'solicitacao_aceita_recusada',
      'solicitacao_posicao',
      'solicitacao_aceita_sn'
    ];
    const titulo = [
      'Id',
      'Nº processo',
      'Situação',
      'Situação',
      'Solicitante',
      'Carta',
      'Tp. solicitante',
      'Solicitante',
      'Endereço',
      'End. Número',
      'End. Complemento',
      'Bairro',
      'Município',
      'Região',
      'Cep',
      'Estado',
      'Telefone1',
      'Telefone2',
      'Celular1',
      'Celular2',
      'Celular3',
      'Fax',
      'E-mail1',
      'E-mail2',
      'Facebook',
      'Outras Midias',
      'Dt, Nascimento / Fundação',
      'Data',
      'Assunto',
      'Indicação S/N',
      'Indicação',
      'Orgão Solicitado',
      'Núcleo',
      'Tp. Recebimento',
      'Área de interesse',
      'Descrição',
      'Observações',
      'Posição',
      'Aceita S/N'
    ];

    const camposTexto = [
      'historico_andamento',
      'solicitacao_descricao',
      'solicitacao_aceita_recusada',
      'solicitacao_carta'
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

  montaColunaExpandida(ev: any[]) {
    let a = 0;
    const b: any[] = [];

    for (const v in ev) {
      if (ev[v] !== null) {
        if (ev[v].toString().length > 0) {
          const n = this.campos.indexOf(v);
          const m = this.camposTexto.indexOf(v);
          if (n >= 0) {
            console.log('n-->', n);
            const cc: any[] = [];
            const tit = this.titulos[n].toString();
            let vf = false;
            let txtdelta: string = null;
            let txt: string = null;
            let tst = '';
            // cc.push(this.titulos[n].toString());
            if (m >= 0) {
              switch (v) {
                case 'processo_carta' : {
                  tst = (ev['processo_carta_texto']) ? ev['processo_carta_texto'] : ev['processo_carta'];
                  txt = (ev['processo_carta_texto']) ? ev['processo_carta_texto'] : null;
                  txtdelta = (ev['processo_carta_delta']) ? ev['processo_carta_delta'] : null;
                  vf = true;
                  break;
                }
                case 'solicitacao_descricao' : {
                  tst = (ev['solicitacao_descricao_texto']) ? ev['solicitacao_descricao_texto'] : ev['solicitacao_descricao'];
                  txt = (ev['solicitacao_descricao_texto']) ? ev['solicitacao_descricao_texto'] : null;
                  txtdelta = (ev['solicitacao_descricao_delta']) ? ev['solicitacao_descricao_delta'] : null;
                  vf = true;
                  break;
                }
                case 'solicitacao_aceita_recusada' : {
                  tst = (ev['solicitacao_aceita_recusada_texto']) ? ev['solicitacao_aceita_recusada_texto'] : ev['solicitacao_aceita_recusada'];
                  txt = (ev['solicitacao_aceita_recusada_texto']) ? ev['solicitacao_aceita_recusada_texto'] : null;
                  txtdelta = (ev['solicitacao_aceita_recusada_delta']) ? ev['solicitacao_aceita_recusada_delta'] : null;
                  vf = true;
                  break;
                }
                case 'solicitacao_carta' : {
                  tst = (ev['solicitacao_carta_texto']) ? ev['solicitacao_carta_texto'] : ev['solicitacao_carta'];
                  txt = (ev['solicitacao_carta_texto']) ? ev['solicitacao_carta_texto'] : null;
                  txtdelta = (ev['solicitacao_carta_delta']) ? ev['solicitacao_carta_delta'] : null;
                  vf = true;
                  break;
                }
                case 'historico_andamento' : {
                  tst = (ev['historico_andamento_texto']) ? ev['historico_andamento_texto'] : ev['historico_andamento'];
                  txt = (ev['historico_andamento_texto']) ? ev['historico_andamento_texto'] : null;
                  txtdelta = (ev['historico_andamento_delta']) ? ev['historico_andamento_delta'] : null;
                  vf = true;
                  break;
                }

              }
            } else {
              tst = ev[v].toString();
            }
            b.push([tit, tst, vf, txt, txtdelta]);
            a++;
          }
        }
      }
    }
    console.log('b---->', b);
    this.expandido.next(b);
  }


}
