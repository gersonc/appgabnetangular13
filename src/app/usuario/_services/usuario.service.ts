import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import { Usuario, UsuarioInterface } from '../_models/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  acao = 'listar';
  usuario?: UsuarioInterface;
  usuarioAlterar?: UsuarioInterface;
  usuario_acessoArray?: string[];

  acessoStr = [
    'cf_i',
    'cf_a',
    'as_i',
    'as_a',
    'mu_i',
    'mu_a',
    'us_i',
    'us_a',
    'us_d',
    'ca_i',
    'ca_a',
    'ca_d',
    'ca_l',
    'so_i',
    'so_a',
    'so_d',
    'so_l',
    'pr_df',
    'pr_if',
    'pr_l',
    'of_i',
    'of_df',
    'of_id',
    'of_l',
    'of_a',
    'hi_i',
    'hi_a',
    'hi_d',
    'ag_i',
    'ag_a',
    'ag_d',
    'pr_d',
    'of_d',
    'as_d',
    'mu_d',
    'ag_v',
    'a2_i',
    'a2_a',
    'a2_d',
    'a2_v',
    'te_i',
    'te_a',
    'te_d',
    'te_l',
    'co_i',
    'co_a',
    'co_d',
    'co_l',
    'ct_e',
    'ct_g',
    'cf_d',
    'em_i',
    'em_a',
    'em_d',
    'em_l',
    'he_i',
    'he_a',
    'he_d',
    'he_l',
    'cs_i',
    'cs_a',
    'cs_d',
    'cs_l',
    'pp_i',
    'pp_a',
    'pp_d',
    'pp_l',
    'ap_i',
    'ap_a',
    'ap_d',
    'ap_l',
    'pa_i',
    'pa_a',
    'pa_d',
    'pa_l',
    'sm_i',
    'ar_a',
    'ar_b',
    'ar_d',
    'ur_s',
    'so_an'
  ];
  acessoCompleto: string[] = [];


  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }

  listar(): Observable<UsuarioInterface[]> {
    const url = this.url.usuario + '/listar';
    return this.http.get<UsuarioInterface[]>(url);
  }

  incluir(dados: Usuario): Observable<any[]> {
    const url = this.url.usuario + '/incluir';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterar(dados: Usuario): Observable<any[]> {
    const url = this.url.usuario + '/alterar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  apagar(id: number): Observable<any[]> {
    const url = this.url.usuario + '/' + id;
    return this.http.delete<any[]>(url);
  }

  novoUsuario() {
    this.acessoCompleto = [];
    this.usuario = new Usuario();
  }

  lerAcesso(valor: string): string[] {
    this.usuario!.usuario_acesso2 = [];
    const r: string[] = [];
    for (let i = 0; i < 81; i++) {
      if (valor.charAt(i) === '1') {
        this.usuario!.usuario_acesso2[i] = this.acessoStr[i];
        this.acessoCompleto!.push(this.acessoStr[i]);
        r.push(this.acessoStr[i]);
      } else {

        this.acessoCompleto!.push(null);

        this.usuario!.usuario_acesso2[i] = null;
      }
    }
    return r;
  }

  escreverAcesso(valor: string[]): any {
    console.log('escreverAcesso1', valor);
    let r = '';
    this.acessoStr.forEach( (v) => {
      if (valor.indexOf(v) !== -1) {
        r = r + '1';
      } else {
        r = r + '0';
      }
    });
    console.log('escreverAcesso2', r);
    return r;
  }

  descreveAcesso(valor: string): string[] {
    const n = valor.length;
    const r: string[] = [];
    for (let i = 0; i < n; i++) {
      if (valor[i] === '1') {
        r.push(this.acessoStr[i]);
      }
    }
    return r;
  }



}
