import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { UrlService } from "../../_services";
import {
  TarefaAtualizarForm,
  TarefaBuscaInterface,
  TarefaForm,
  TarefaListarInterface,
  TarefaPaginacaoInterface
} from "../_models";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  tf: TarefaForm;
  taf: TarefaAtualizarForm;
  titulos: any[] = null;

  constructor(private url: UrlService, private http: HttpClient) { }

  criaNovaTarefa() {
    this.tf = new TarefaForm();
  }

  criaNovaTarefaAtualizar() {
    this.taf = new TarefaAtualizarForm();
  }

  carregaAlterar(tar: TarefaListarInterface) {
    this.tf.tarefa_id = tar.tarefa_id;
    this.tf.tarefa_usuario_autor_id = tar.tarefa_usuario_autor_id;
    this.tf.tarefa_data = tar.tarefa_data;
    this.tf.tarefa_hora = tar.tarefa_hora;
    this.tf.tarefa_titulo = tar.tarefa_titulo;
    this.tf.tarefa_tarefa = tar.tarefa_tarefa;
    /*
    this.tf.tarefa_usuario_id = [];
    tar.usuario_situacao.forEach( t => {
      this.tf.tarefa_usuario_id.push(t.tu_usuario_id);
    } )
    */
  }

  resetTarefa() {
    delete this.tf;
    this.criaNovaTarefa();
  }

  resetTarefaAtualizar() {
    delete this.taf;
    this.criaNovaTarefaAtualizar();
  }

  putTarefaAtualizar(dados: TarefaAtualizarForm): Observable<any[]> {
    const url = this.url.tarefa + '/atualizar';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  postTarefaBusca(dados: TarefaBuscaInterface): Observable<TarefaPaginacaoInterface> {
    const url = this.url.tarefa + '/listar';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.post<TarefaPaginacaoInterface>(url, dados, httpOptions);
  }

  postTarefaIncluir(dados: TarefaForm): Observable<any[]> {
    const url = this.url.tarefa + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  putTarefaAlterar(dados: TarefaForm): Observable<any[]> {
    const url = this.url.tarefa + '/alterar';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  putTarefaSituacao(tfId: number, tfSitId: number, tpListagem: string): Observable<any[]> {
    const dados = {
      tarefa_id: tfId,
      tarefa_situacao_id: tfSitId,
      tipo_listagem: tpListagem
    };
    const url = this.url.tarefa + '/situacao';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  putTarefaUsusarioSituacao(tfId: number, tusId: number, tusSitId: number, tpListagem: string): Observable<any[]> {
    const dados = {
      tus_tarefa_id: tfId,
      tus_id: tusId,
      tus_situacao_id: tusSitId,
      tipo_listagem: tpListagem
    };
    const url = this.url.tarefa + '/user';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  deleteTarefa(tfId: number): Observable<any[]> {
    const url = this.url.tarefa + '/' + tfId;
    // const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.delete<any[]>(url);
  }

  // @ts-ignore
  getTitulos() {
    if (!this.titulos) {
      if (!sessionStorage.getItem('tarefa-titulo')) {
        this.getTarefaTitulo()
          .pipe(take(1))
          .subscribe((dados) => {
              this.titulos = dados;
            },
            error1 => {
              console.log('erro');
              return false;
            },
            () => {
              sessionStorage.setItem('tarefa-titulo', JSON.stringify(this.titulos));
              return this.titulos;
            }
          );
      } else {
        this.titulos = JSON.parse(sessionStorage.getItem('tarefa-titulo'));
        if (!this.titulos) {
          this.getTarefaTitulo()
            .pipe(take(1))
            .subscribe((dados) => {
                this.titulos = dados;
              },
              error1 => {
                console.log('erro');
                return false;
              },
              () => {
                sessionStorage.setItem('tarefa-titulo', JSON.stringify(this.titulos));
                return this.titulos;
              }
            );
        }
        return this.titulos;
      }
    } else {
      return this.titulos;
    }
  }

  getTarefaTitulo(): Observable<any[]> {
    const url = this.url.tarefa + '/titulo';
    return this.http.get<any[]>(url);
  }
}
