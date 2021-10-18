import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../util/_services';
import {
  SolicitacaoDetalheInterface,
  SolicitacaoPaginacaoInterface,
  SolicitacaoCadastroAnalise,
  SolicitacaoAnalisarFormInterface,
  SolicitacaoInterface,
  SolicitacaoFormularioInterface, SolicitacaoAlterarInterface, SolicitacaoExcluirInterface, SolicitacaoBuscaInterface
} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  solicitacaoUrl = this.url.solicitacao;
  buscaSolicitacao$: Observable<SolicitacaoPaginacaoInterface>;
  solicitacaoDetalhe$: Observable<SolicitacaoDetalheInterface>;
  solicitacaoExcluir$: Observable<SolicitacaoExcluirInterface>;
  silicitacaoAnalise$: Observable<SolicitacaoCadastroAnalise>;
  solicitacao$: Observable<SolicitacaoInterface>;
  incluirResposta$: Observable<any[]>;
  alterarResposta$: Observable<any[]>;
  analisar$: Observable<any[]>;
  buscaSubject = new Subject();
  analise$: Observable<any[]>;
  busca$ = this.buscaSubject.asObservable();
  buscaState: any;
  buscaStateSN = false;
  listagemState: any;
  expandidoDados: any = false;
  cfg: any;
  cfgVersao: number;
  campos: string[];
  titulos: string[];
  camposTexto: string[];

  public expandido = new Subject();

  constructor(private url: UrlService, private http: HttpClient) { }

  buscaMenu() {
    this.buscaSubject.next();
  }

  definirCampo(): void {
    if (this.cfgVersao <= 2) {
      this.campos = [
        'solicitacao_id',
        'solicitacao_posicao',
        'solicitacao_aceita_sn',
        'solicitacao_cadastro_tipo_nome',
        'solicitacao_cadastro_nome',
        'solicitacao_data',
        'solicitacao_assunto_nome',
        'cadastro_municipio_nome',
        'cadastro_regiao_nome',
        'cadastro_email',
        'cadastro_email2',
        'cadastro_telefone',
        'cadastro_telcom',
        'cadastro_telefone2',
        'cadastro_celular',
        'cadastro_celular2',
        'cadastro_fax',
        'solicitacao_area_interesse_nome',
        'solicitacao_tipo_recebimento_nome',
        'processo_numero',
        'processo_status',
        'solicitacao_local_nome',
        'solicitacao_indicacao_sn',
        'solicitacao_indicacao_nome',
        'solicitacao_reponsavel_analize_nome',
        'solicitacao_atendente_cadastro_nome',
        'solicitacao_cadastrante_cadastro_nome',
        'solicitacao_data_atendimento',
        'historico_data',
        'historico_andamento',
        'historico_andamento_texto',
        'solicitacao_descricao',
        'solicitacao_aceita_recusada',
        'solicitacao_carta',
      ];
      this.titulos = [
        'ID',
        'POSIÇÃO',
        'SOL. ACEITA',
        'TP. SOLICITANTE',
        'SOLICITANTE',
        'DATA',
        'ASSUNTO',
        'MUNICÍPIO',
        'REGIÃO',
        'E-MAIL1',
        'E-MAIL2',
        'TELEFONE1',
        'TELEFONE2',
        'TELEFONE3',
        'CELULAR1',
        'CELULAR2',
        'FAX',
        'ÁREA DE INTERESSE',
        'TP. RECEBIMENTO',
        'Nº PROCESSO',
        'SIT. PROCESSO',
        'NÚCLEO',
        'INDICADO S/N',
        'INDICAÇÃO',
        'RESPONSÁVEL',
        'ATENDENTE',
        'CADASTRANTE',
        'DT. ATENDIMENTO',
        'PROC.HIS.DT.',
        'PROC. HIST. ANDAMENTO',
        'PROC. HIST. ANDAMENTO',
        'DESCRIÇÃO',
        'OBSERVAÇÕES',
        'RESPOSTA',
      ];
    } else {
      this.campos = [
        'solicitacao_id',
        'solicitacao_posicao',
        'solicitacao_cadastro_tipo_nome',
        'solicitacao_cadastro_nome',
        'solicitacao_data',
        'solicitacao_assunto_nome',
        'cadastro_municipio_nome',
        'cadastro_bairro',
        'cadastro_email',
        'cadastro_email2',
        'cadastro_telefone',
        'cadastro_telcom',
        'cadastro_telefone2',
        'cadastro_celular',
        'cadastro_celular2',
        'cadastro_fax',
        'solicitacao_area_interesse_nome',
        'solicitacao_orgao',
        'solicitacao_tipo_recebimento_nome',
        'solicitacao_indicacao_nome',
        'solicitacao_atendente_cadastro_nome',
        'solicitacao_cadastrante_cadastro_nome',
        'solicitacao_data_atendimento',
        'historico_data',
        'historico_andamento',
        'solicitacao_descricao',
        'solicitacao_aceita_recusada',
      ];
      this.titulos = [
        'ID',
        'POSIÇÃO',
        'TP. SOLICITANTE',
        'SOLICITANTE',
        'DATA',
        'ASSUNTO',
        'MUNICÍPIO',
        'BAIRRO',
        'E-MAIL1',
        'E-MAIL2',
        'TELEFONE1',
        'TELEFONE2',
        'TELEFONE3',
        'CELULAR1',
        'CELULAR2',
        'FAX',
        'ÁREA DE INTERESSE',
        'ORGÃO SOLICITADO',
        'N° OFÍCIO',
        'INDICAÇÃO',
        'ATENDENTE',
        'CADASTRANTE',
        'DT. ATENDIMENTO',
        'HIST. DATA',
        'HISTÓRICO ANDAMENTO',
        'DESCRIÇÃO',
        'OBSERVAÇÕES'
      ];
    }
    this.camposTexto = [
      'historico_andamento',
      'solicitacao_descricao',
      'solicitacao_aceita_recusada',
      'solicitacao_carta'
    ];
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('solicitacao-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('solicitacao-expandido'));
      sessionStorage.removeItem('solicitacao-expandido');
    }
    return resp;
  }

  excluirColunaExpandida() {
    if (sessionStorage.getItem('solicitacao-expandido')) {
      sessionStorage.removeItem('solicitacao-expandido');
    }
    if (sessionStorage.getItem('solicitacao-listagem')) {
      const resp = JSON.parse(sessionStorage.getItem('solicitacao-listagem'));
      if (resp.expandedRowKeys) {
        delete resp.expandedRowKeys;
        sessionStorage.setItem('solicitacao-listagem', JSON.stringify(resp));
      }
    }
  }

  gravaColunaExpandida(dados) {
    sessionStorage.setItem('solicitacao-expandido', JSON.stringify(dados));
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
            const cc: any[] = [];
            const tit = this.titulos[n].toString();
            let vf = false;
            let txtdelta: string = null;
            let txt: string = null;
            let tst = '';
            // cc.push(this.titulos[n].toString());
            if (m >= 0) {
              switch (v) {
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

  getArrayTitulo() {
    const arrTit: string[] = [];
    const n = this.campos.length;
    for (let i = 0; i < n; i++) {
      arrTit[this.campos[i]] = this.titulos[i];
    }
    arrTit['solicitacao_cadastro_id'] = 'CADASTRO ID';
    arrTit['processo_id'] = 'PROCESSO ID';

    return arrTit;
  }

  postSolicitacaoBusca(busca: SolicitacaoBuscaInterface): Observable<SolicitacaoPaginacaoInterface> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.solicitacaoUrl + '/listar';
    this.buscaSolicitacao$ = this.http.post<SolicitacaoPaginacaoInterface>(url, busca, httpOptions);
    return this.buscaSolicitacao$;
  }

  getSolicitacaoDetalhe(id: number): Observable<SolicitacaoDetalheInterface> {
    const ur = this.solicitacaoUrl + '/detalhe/'  + id ;
    this.solicitacaoDetalhe$ = this.http.get<SolicitacaoDetalheInterface>(ur);
    return this.solicitacaoDetalhe$;
  }

  getSolicitacaoAnalise(id: number): Observable<SolicitacaoCadastroAnalise> {
    const ur = this.url.solicitacao + '/analise/'  + id ;
    this.silicitacaoAnalise$ = this.http.get<SolicitacaoCadastroAnalise>(ur);
    return this.silicitacaoAnalise$;
  }

  postSolicitacaoAnalise(dados: SolicitacaoAnalisarFormInterface): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const ur = this.solicitacaoUrl + '/analise';
    this.analise$ = this.http.post<any[]>(ur, dados, httpOptions);
    return this.analise$;
  }

  getSolicitacaoId(id: number): Observable<SolicitacaoInterface> {
    const ur = this.solicitacaoUrl + '/'  + id;
    this.solicitacao$ = this.http.get<SolicitacaoInterface>(ur);
    return this.solicitacao$;
  }

  getSolicitacaoAlterar(id: number): Observable<SolicitacaoAlterarInterface> {
    const ur = this.url.solicitacao + '/'  + id;
    this.solicitacao$ = this.http.get<SolicitacaoAlterarInterface>(ur);
    return this.solicitacao$;
  }

  incluirSolicitacao(dados: SolicitacaoFormularioInterface): Observable<any> {
    let url: string;
    url = this.url.solicitacao + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.incluirResposta$ = this.http.post<any[]> (url, dados, httpOptions);
    return this.incluirResposta$;
  }

  alterarSolicitacao(dados: SolicitacaoAlterarInterface): Observable<any> {
    let url: string;
    url = this.url.solicitacao + '/alterar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    this.alterarResposta$ = this.http.post<any[]> (url, dados, httpOptions);
    return this.alterarResposta$;
  }

  getSolicitacaoExcluir(id: number): Observable<SolicitacaoExcluirInterface> {
    const ur = this.solicitacaoUrl + '/excluir/'  + id ;
    this.solicitacaoExcluir$ = this.http.get<SolicitacaoExcluirInterface>(ur);
    return this.solicitacaoExcluir$;
  }

  excluir(id: number): Observable<any> {
    if (!id) {
      return null;
    }
    const url = this.url.solicitacao + '/'  + id ;
    return this.http.delete(url);
  }
}
