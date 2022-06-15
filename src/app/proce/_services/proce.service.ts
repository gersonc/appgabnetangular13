import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";

import {Datatable, DatatableI} from "../../_models/datatable-i";
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TitulosService} from "../../_services/titulos.service";
import {take} from "rxjs/operators";

import {ProceBuscaI, ProceListarI, ProcePaginacaoInterface, proceProcessoCamposTexto} from "../_model/proc-i";
import {ProceDetalheI, ProceHistoricoI, ProceOficioI} from "../_model/proce-detalhe-i";
import {strToDelta} from "../../_models/parcer-delta";
import {HistAuxService} from "../../hist/_services/hist-aux.service";
import {HistFormI} from "../../hist/_models/hist-i";

@Injectable({
  providedIn: 'root'
})
export class ProceService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();

  processoUrl = this.url.proce;
  sub: Subscription[] = [];
  processos: ProceListarI[];
  selecionados: ProceListarI[] = [];
  Contexto: ProceListarI;
  busca?: ProceBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  procApagar?: ProceListarI;
  procAnalisar?: ProceListarI;
  expandido?: ProceListarI;
  expandidoSN = false;
  msgCtxH: boolean = true;

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private has: HistAuxService
  ) {
    this.criaTabela();
    this.processoUrl = this.url.proce;
  }

  buscaMenu() {
    this.buscaSubject.next(true);
  }

  criaTabela() {
    this.ts.titulosSN();
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'solicitacao_situacao,solicitacao_status_nome,cadastro_nome';
        this.tabela.camposTexto = proceProcessoCamposTexto;
        if (this.busca === undefined) {
          this.criaBusca();
        }

      }
    }
  }

  resetTabela() {
    this.tabela = undefined;
    this.criaTabela();
  }

  criaBusca() {
    if (this.busca === undefined) {
      this.busca = {
        todos: false,
        rows: this.tabela.rows
      };
    }
  }

  resetProceBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  onContextMenuSelect(evento) {
    this.Contexto = evento.data;
    /*if (Array.isArray(evento.data.historico_processo)) {
      if (evento.data.historico_processo.length > 0) {
        this.msgCtxH = true;
          this.has.histFormI = {
          modulo: 'processo',
          hist: {
            historico_processo_id: +evento.data.processo_id,
            historico_solicitacao_id: +evento.data.solicitacao_id
          }
        };
        console.log('onContextMenuSelect2', evento.data.historico_processo.length);
        this.has.histListI = {
          modulo: 'processo',
          hist: evento.data.historico_processo,
          registro_id: +evento.data.processo_id
        }

      } else {
        this.msgCtxH = false;
        console.log('this.msgCtxH1', this.msgCtxH);
      }
    } else {
      this.msgCtxH = false;
      console.log('this.msgCtxH', this.msgCtxH);
    }*/

  }

  onRowExpand(evento) {
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    let a = 0;
    const b: any[] = [];
    let ev = evento.data;
    this.has.histFormI = {
      hist: {
        historico_processo_id: +evento.data.processo_id,
        historico_solicitacao_id: +evento.data.solicitacao_id
      }
    };
    /*this.has.histListI = {
      modulo: 'processo',
      hist: evento.data.historico_processo,
      registro_id: +evento.data.processo_id
    }*/
    this.tabela.titulos.forEach((t, i, tt) => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].toString().length > 0) {
          const tit = t.titulo;
          let vf = false;
          let txtdelta: any = null;
          let txt: string = null;
          let tst = '';
          tst = ev[t.field].toString();
          b.push([tit, tst, vf, txt, txtdelta]);
          a++;
        }
      }
    });
    this.tabela.dadosExpandidos = b;
    this.expandidoSN = true;
  }

  onRowCollapse(ev) {
    this.tabela.dadosExpandidos = undefined;
    this.expandidoSN = false;
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      this.parseSession(tableSession);
    }
    this.stateSN = false;
    const t: any = JSON.parse(sessionStorage.getItem('proce-tabela'));
    const b: any = JSON.parse(sessionStorage.getItem('proce-busca'));
    this.parseTabela(t);
    this.parseBusca(b);
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
    this.stateSN = true;
    sessionStorage.setItem('proce-busca', JSON.stringify(this.busca));
    sessionStorage.setItem('proce-tabela', JSON.stringify(this.tabela));
  }

  parseTabela(t: any) {
    sessionStorage.removeItem('proce-tabela');
    this.tabela.rows = parseInt(t.rows, 10);
    this.tabela.first = parseInt(t.first, 10);
    this.tabela.sortOrder = parseInt(t.sortOrder, 10);
    this.tabela.sortField = t.sortField;
    this.tabela.todos = (t.todos.toString() === 'true');
    this.tabela.campos = t.campos;
    this.tabela.ids = (t.ids !== undefined) ? t.ids : undefined;
    this.tabela.totalRecords = parseInt(t.totalRecords, 10);
    this.tabela.currentPage = parseInt(t.currentPage, 10);
    this.tabela.pageCount = parseInt(t.pageCount, 10);
    this.tabela.titulos = t.titulos;
    this.tabela.camposTexto = t.camposTexto;
    this.tabela.total = t.total;
    if (t.dadosExpandidos !== undefined) {
      this.tabela.dadosExpandidos = t.dadosExpandidos;
    }
    if (t.todos === 'true' || t.todos === true) {
      this.busca.todos = true;
      this.tabela.todos = true;
    } else {
      this.busca.todos = false;
      this.tabela.todos = false;
    }
  }

  parseSession(js: any) {
    Object.keys(js).forEach((k) => {
      switch (k) {
        case 'first': {
          this.busca.first = parseInt(js[k], 10);
          break;
        }
        case 'rows': {
          this.busca.rows = parseInt(js[k], 10);
          break;
        }
        case 'sortOrder': {
          this.busca.sortOrder = parseInt(js[k], 10);
          break;
        }
        case 'currentPage': {
          this.tabela.currentPage = parseInt(js[k], 10);
          break;
        }
        case 'pageCount': {
          this.tabela.pageCount = parseInt(js[k], 10);
          break;
        }
        case 'expandedRowKeys': {
          this.tabela.expandedRowKeys = js[k];
          break;
        }
        case 'sortField': {
          if (js[k] !== undefined && js[k] !== '') {
            this.busca.sortField = js[k];
            break;
          }
        }
      }

    });
  }

  parseBusca(b: ProceBuscaI) {
    sessionStorage.removeItem('proce-busca');
    this.busca.solicitacao_situacao = (b.solicitacao_situacao !== undefined) ? b.solicitacao_situacao : undefined;
    this.busca.cadastro_tipo_id = (b.cadastro_tipo_id !== undefined) ? +b.cadastro_tipo_id : undefined;
    this.busca.cadastro_id = (b.cadastro_id !== undefined) ? +b.cadastro_id : undefined;
    this.busca.solicitacao_assunto_id = (b.solicitacao_assunto_id !== undefined) ? +b.solicitacao_assunto_id : undefined;
    this.busca.processo_status_id = (b.processo_status_id !== undefined) ? +b.processo_status_id : undefined;
    // this.busca.solicitacao_status_id = (b.solicitacao_status_id !== undefined)? +b.solicitacao_status_id : undefined;
    this.busca.cadastro_municipio_id = (b.cadastro_municipio_id !== undefined) ? +b.cadastro_municipio_id : undefined;
    this.busca.cadastro_regiao_id = (b.cadastro_regiao_id !== undefined) ? +b.cadastro_regiao_id : undefined;
    this.busca.solicitacao_local_id = (b.solicitacao_local_id !== undefined) ? +b.solicitacao_local_id : undefined;
    // this.busca.cadastro_bairro = (b.cadastro_bairro !== undefined)? b.cadastro_bairro : undefined;
    // this.busca.solicitacao_tipo_recebimento_id = (b.solicitacao_tipo_recebimento_id !== undefined)? +b.solicitacao_tipo_recebimento_id : undefined;
    this.busca.solicitacao_area_interesse_id = (b.solicitacao_area_interesse_id !== undefined) ? +b.solicitacao_area_interesse_id : undefined;
    this.busca.solicitacao_reponsavel_analize_id = (b.solicitacao_reponsavel_analize_id !== undefined) ? +b.solicitacao_reponsavel_analize_id : undefined;
    this.busca.solicitacao_data1 = (b.solicitacao_data1 !== undefined) ? b.solicitacao_data1 : undefined;
    this.busca.solicitacao_data2 = (b.solicitacao_data2 !== undefined) ? b.solicitacao_data2 : undefined;
    // this.busca.solicitacao_descricao = (b.solicitacao_descricao !== undefined)? b.solicitacao_descricao : undefined;
    this.busca.solicitacao_orgao = (b.solicitacao_orgao !== undefined) ? b.solicitacao_orgao : undefined;
    this.busca.processo_numero = (b.processo_numero !== undefined) ? b.processo_numero : undefined;
  }

  parceDetalhe(pro: ProceListarI): ProceDetalheI {
    let proceDetalhe: ProceDetalheI = {};
    proceDetalhe.processo = {
      processo_id: pro.processo_id,
      processo_numero: pro.processo_numero,
      processo_status_nome: pro.processo_status_nome,
      solicitacao_data: pro.solicitacao_data,
      solicitacao_assunto_nome: pro.solicitacao_assunto_nome,
      solicitacao_local_nome: pro.solicitacao_local_nome,
      solicitacao_area_interesse_nome: pro.solicitacao_area_interesse_nome,
      solicitacao_reponsavel_analize_nome: pro.solicitacao_reponsavel_analize_nome,
      solicitacao_descricao: pro.solicitacao_descricao,
      solicitacao_aceita_recusada: pro.solicitacao_aceita_recusada,
    };
    proceDetalhe.processo_titulo = this.ts.buscaTitulosDetalhe(Object.keys(proceDetalhe.processo));
    proceDetalhe.cadastro = {
      cadastro_tipo_nome: pro.cadastro_tipo_nome,
      cadastro_nome: pro.cadastro_nome,
      cadastro_endereco: pro.cadastro_endereco,
      cadastro_endereco_numero: pro.cadastro_endereco_numero,
      cadastro_endereco_complemento: pro.cadastro_endereco_complemento,
      cadastro_bairro: pro.cadastro_bairro,
      cadastro_municipio_nome: pro.cadastro_municipio_nome,
      cadastro_regiao_nome: pro.cadastro_regiao_nome,
      cadastro_cep: pro.cadastro_cep,
      cadastro_estado_nome: pro.cadastro_estado_nome,
      cadastro_telefone: pro.cadastro_telefone,
      cadastro_telefone2: pro.cadastro_telefone2,
      cadastro_celular: pro.cadastro_celular,
      cadastro_celular2: pro.cadastro_celular2,
      cadastro_telcom: pro.cadastro_telcom,
      cadastro_fax: pro.cadastro_fax,
      cadastro_email: pro.cadastro_email,
      cadastro_email2: pro.cadastro_email2,
      cadastro_rede_social: pro.cadastro_rede_social,
      cadastro_outras_midias: pro.cadastro_outras_midias,
      cadastro_data_nascimento: pro.cadastro_data_nascimento,
    };
    proceDetalhe.cadastro_titulo = this.ts.buscaTitulosDetalhe(Object.keys(proceDetalhe.cadastro));
    if (pro.oficios.length > 0) {
      proceDetalhe.oficios = [];
      let ko: string[] = [];
      pro.oficios.forEach(p => {
        const k = Object.keys(p);
        k.forEach(s => {
          if (ko.indexOf(s) === -1) { ko.push(s)}
        });
        let pp: ProceOficioI;
        pp = {
          oficio_id: p.oficio_id,
          oficio_processo_id: p.oficio_processo_id,
          oficio_codigo: p.oficio_codigo,
          oficio_numero: p.oficio_numero,
          oficio_prioridade_nome: p.oficio_prioridade_nome,
          oficio_convenio: p.oficio_convenio,
          oficio_data_emissao: p.oficio_data_emissao,
          oficio_data_recebimento: p.oficio_data_recebimento,
          oficio_orgao_solicitado_nome: p.oficio_orgao_solicitado_nome,
          oficio_descricao_acao: p.oficio_descricao_acao,
          oficio_data_protocolo: p.oficio_data_protocolo,
          oficio_protocolo_numero: p.oficio_protocolo_numero,
          oficio_orgao_protocolante_nome: p.oficio_orgao_protocolante_nome,
          oficio_protocolante_funcionario: p.oficio_protocolante_funcionario,
          oficio_prazo: p.oficio_prazo,
          oficio_tipo_andamento_nome: p.oficio_tipo_andamento_nome,
          oficio_status: p.oficio_status,
          oficio_valor_solicitado: p.oficio_valor_solicitado,
          oficio_valor_recebido: p.oficio_valor_recebido,
          oficio_data_pagamento: p.oficio_data_pagamento,
          oficio_data_empenho: p.oficio_data_empenho,
        };
        proceDetalhe.oficios.push(pp);

      });
      proceDetalhe.oficio_titulo = this.ts.buscaTitulosDetalhe(ko);
    }
    if (pro.historico_processo.length > 0) {
      proceDetalhe.historicos = [];
      pro.historico_processo.forEach(p => {
        let h: ProceHistoricoI = {
          historico_id: p.historico_id,
          historico_data: p.historico_data,
          historico_andamento: p.historico_andamento,
        };
        proceDetalhe.historicos.push(h);
      });
      proceDetalhe.historico_titulo = this.ts.buscaTitulosDetalhe(Object.keys(proceDetalhe.oficios[0]));
    }
    return proceDetalhe;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = cps;
    if (this.ts.titulos.length === 0) {
      this.ts.buscaTitulos(cps);
    } else {
      if (this.tabela.titulos === undefined || this.tabela.titulos.length === 0) {
        this.tabela.titulos = this.ts.buscaTitulos(cps);
      }
    }
  }

  proceBusca(): void {
    if (this.busca.rows === undefined) {
      this.busca.rows = this.tabela.rows;
    } else {
      this.tabela.rows = this.busca.rows;
    }
    if (this.busca.first === undefined) {
      this.busca.first = this.tabela.first;
    } else {
      this.tabela.first = this.busca.first;
    }
    if (this.busca.sortOrder === undefined) {
      this.busca.sortOrder = this.tabela.sortOrder;
    } else {
      this.tabela.sortOrder = this.busca.sortOrder;
    }
    if (this.busca.sortField === undefined) {
      this.busca.sortField = this.tabela.sortField;
    } else {
      this.tabela.sortField = this.busca.sortField;
    }
    if (this.busca.todos === undefined && this.tabela.todos === undefined) {
      this.busca.todos = false;
      this.tabela.todos = false;
    } else {
      if (this.busca.todos === undefined) {
        this.busca.sortField = this.tabela.sortField;
      } else {
        this.tabela.sortField = this.busca.sortField;
      }
    }
    this.tabela.ids = this.busca.ids;
    this.sub.push(this.postProceBusca(this.busca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.processos = dados.processos;
          this.tabela.total = dados.total;
          this.tabela.totalRecords = this.tabela.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.tabela.currentPage = (this.tabela.first + this.tabela.rows) / this.tabela.rows;
          this.tabela.pageCount = Math.ceil(this.tabela.totalRecords / this.tabela.rows);
        }
      })
    );
  }

  postProceBusca(busca: ProceBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.proce + '/listar';
    return this.http.post<ProcePaginacaoInterface>(url, busca, httpOptions);
  }

  /*  getSolicitacaoDetalhe(id: number) {
      const url = this.url.proce + '/detalhe/' + id;
      return this.http.get<SolicDetalheI>(url);
    }

    incluirSolicitacao(dados: SolicFormI): Observable<any> {
      let url: string;
      url = this.url.proce + '/incluir';
      const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
      return this.http.post<any[]>(url, dados, httpOptions);
    }

    alterarSolicitacao(dados: SolicFormI): Observable<any> {
      let url: string;
      url = this.url.proce + '/alterar';
      const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
      return this.http.put<any[]>(url, dados, httpOptions);
    }

    analisarSolicitacao(dados: SolicFormAnalisar): Observable<any> {
      let url: string;
      url = this.url.proce + '/analisar';
      const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
      return this.http.put<any[]>(url, dados, httpOptions);
    }*/

  excluirSolicitacao(id: number): Observable<any> {
    const url = this.url.proce + '/' + id;
    return this.http.delete<any>(url);
  }

  postVerificarNumOficio(dados: any): Observable<any> {
    let url: string;
    url = this.url.proce + '/verificanumoficio';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  recebeRegistro() {
    if (this.has.histFormI.acao === 'incluir') {
      const n: number = this.processos.findIndex(p => p.processo_id = this.has.histFormI.hist.historico_processo_id);
      if (Array.isArray(this.processos[n].historico_processo)) {
        this.processos[n].historico_processo.push(this.has.histFormI.hist);
      } else {
        this.processos[n].historico_processo = [this.has.histFormI.hist];
      }
    }
    if (this.has.histFormI.acao === 'alterar') {
      const n: number = this.processos.findIndex(p => p.processo_id = this.has.histFormI.hist.historico_processo_id);
      const m: number = this.processos[n].historico_processo.findIndex(hs => hs.historico_id = this.has.histFormI.hist.historico_id);
      this.processos[n].historico_processo.splice(m, 1, this.has.histFormI.hist);
    }
    if (this.has.histFormI.acao === 'apagar') {
      const n: number = this.processos.findIndex(p => p.processo_id = this.has.histFormI.hist.historico_processo_id);
      this.processos[n].historico_processo.splice(this.processos[n].historico_processo.findIndex(hs => hs.historico_id = this.has.histFormI.hist.historico_id), 1);
    }
  }

  montaHistorico(modulo: string, idx: number) {
    this.has.histFormI.modulo = modulo;
    this.has.histFormI.idx = idx;

    this.has.histListI = {
      idx: idx,
      modulo: modulo,
      hist: (modulo === 'processo') ? this.expandido.historico_processo : this.expandido.historico_solicitcao,
      registro_id: (modulo === 'processo') ? +this.expandido.processo_id : +this.expandido.solicitacao_id
    }
  }

  onDestroy(): void {
    sessionStorage.removeItem('proce-busca');
    sessionStorage.removeItem('proce-tabela');
    sessionStorage.removeItem('proce-table');
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.stateSN = false;
    this.has = null;
    this.sub.forEach(s => s.unsubscribe());
  }
}
