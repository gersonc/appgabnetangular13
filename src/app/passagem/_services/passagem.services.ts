import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { DropdownService, UrlService } from '../../_services';
import {
  PassagemBuscaInterface,
  PassagemDetalheInterface,
  PassagemFormulario, PassagemFormularioInterface,
  PassagemInterface,
  PassagemPaginacaoInterface
} from '../_models';
import { SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PassagemService {
  pf: PassagemFormularioInterface;
  expandidoDados: any = false;

  private expandido = new Subject();

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private dd: DropdownService
    ) { }

  criarPassagem() {
    this.pf = new PassagemFormulario();
  }

  resetPassagem() {
    delete this.pf;
    this.criarPassagem();
  }

  filtraPassagem(): PassagemFormulario {
    const and = new PassagemFormulario();
    for (const key in and) {
      if (this.pf[key] === false) {
        and[key] = 0;
        continue;
      }
      if (this.pf[key] === true) {
        and[key] = 1;
        continue;
      }
      if (Array.isArray(this.pf[key])) {
        if (this.pf[key].lenght > 0) {
          and[key] = this.pf[key];
          continue;
        } else {
          delete this.pf[key];
          delete and[key];
          continue;
        }
      }
      if (this.pf[key] === undefined) {
        delete and[key];
        delete this.pf[key];
        continue;
      }
      if (this.pf[key] === null) {
        delete this.pf[key];
        delete and[key];
        continue;
      }
      and[key] = this.pf[key];
    }
    return and;
  }

  incluirPassagem(dados: PassagemFormulario): Observable<any[]> {
    const url = this.url.passagem + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  postPassagemBusca(dados: PassagemBuscaInterface): Observable<PassagemPaginacaoInterface> {
    const url = this.url.passagem + '/listar';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.post<PassagemPaginacaoInterface>(url, dados, httpOptions);
  }

  getPassagemDetalhe(passagem_id: number): Observable<PassagemDetalheInterface> {
    const url = this.url.passagem + '/detalhe/' + passagem_id;
    return  this.http.get<PassagemDetalheInterface>(url);
  }

  getPassagemAlterar(passagem_id: number): Observable<PassagemInterface> {
    const url = this.url.passagem + '/alterar/' + passagem_id;
    return this.http.get<PassagemInterface>(url);
  }

  putPassagemAlterarDatatable(
    passagem_id: number,
    passagem_voado_sn: number): Observable<any[]> {

    const dados = {
      'passagem_id': passagem_id,
      'passagem_voado_sn': passagem_voado_sn
    };
    const url = this.url.passagem + '/alterar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  putPassagemAlterar(passagem_id: number, dados: PassagemFormulario): Observable<any[]> {
    const url = this.url.passagem + '/' + passagem_id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  deletePassagemId(passagem_id: number): Observable<any[]> {
    const url = this.url.passagem + '/' + passagem_id;
    return this.http.delete<any[]>(url);
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('passagem-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('passagem-expandido'));
      sessionStorage.removeItem('passagem-expandido');
    }
    return resp;
  }

  gravaColunaExpandida(dados) {
    sessionStorage.setItem('passagem-expandido', JSON.stringify(dados));
  }

  montaColunaExpandida2(ev: any[]) {
    const campo = [
      'passagem_id',
      'passagem_data',
      'passagem_hora',
      'passagem_beneficiario',
      'passagem_aerolinha_nome',
      'passagem_trecho',
      'passagem_voo',
      'passagem_localizador',
      'passagem_valor',
      'passagem_voado_sn',
      'passagem_observacao'
    ];
    const titulo = [
      'Id',
      'Data',
      'Horário',
      'Beneficiário',
      'Companhia Aérea',
      'Trecho',
      'Voo',
      'Lacalizador',
      'Valor',
      'Voado',
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

    let passagemdor = 0;
    for (col = 1; col <= colunas; col++) {
      const idcL = [];
      for (lin = 1; lin <= linhas; lin++) {
        if (passagemdor < tamanho) {
          idcL.push(b[passagemdor]);
        }
        passagemdor++;
      }
      idxC.push(idcL);
    }
    const largura = (100 / colunas).toFixed(2) + '%';
    idxC.push(largura.toString());
    this.expandido.next(idxC);
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'passagem_id',
      'passagem_data',
      'passagem_hora',
      'passagem_beneficiario',
      'passagem_aerolinha_nome',
      'passagem_trecho',
      'passagem_voo',
      'passagem_localizador',
      'passagem_valor',
      'passagem_voado_sn',
      'passagem_observacao'
    ];
    const titulo = [
      'Id',
      'Data',
      'Horário',
      'Beneficiário',
      'Companhia Aérea',
      'Trecho',
      'Voo',
      'Lacalizador',
      'Valor',
      'Voado',
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
            cc.push(ev[v].toString());
            b.push(cc);
            a++;
          }
        }
      }
    }
    /*const tamanho = b.length;
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

    let passagemdor = 0;
    for (col = 1; col <= colunas; col++) {
      const idcL = [];
      for (lin = 1; lin <= linhas; lin++) {
        if (passagemdor < tamanho) {
          idcL.push(b[passagemdor]);
        }
        passagemdor++;
      }
      idxC.push(idcL);
    }
    const largura = (100 / colunas).toFixed(2) + '%';
    idxC.push(largura.toString());
    this.expandido.next(idxC);*/
    this.expandido.next(b);
  }

  carregaDropdownMenu() {
    sessionStorage.removeItem('passagem_beneficiario-dropdown');
    const busca  = {tabela: 'passagem', campo_nome: 'passagem_beneficiario'};
    this.dd.postDropdownSoNome(busca)
      .pipe(take(1))
      .subscribe((dados) => {
          sessionStorage.setItem('passagem_beneficiario-dropdown', JSON.stringify(dados));
        },
        error1 => {
          console.log('erro');
        }
    );

    sessionStorage.removeItem('passagem_aerolinha-dropdown');
    const busca2 = {tabela: 'passagem', campo_id: 'passagem_aerolinha_id', campo_nome: 'passagem_aerolinha_nome'};
    this.dd.postDropdownNomeId(busca2)
      .pipe(take(1))
      .subscribe((dados) => {
          sessionStorage.setItem('passagem_aerolinha-dropdown', JSON.stringify(dados));
        },
        error1 => {
          console.log('erro');
        }
    );
 }


}
