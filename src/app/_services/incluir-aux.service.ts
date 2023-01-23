import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../_services';
import {IncluirAux} from '../_models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncluirAuxService {

  private a$?: Observable<any[]>;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  incluir(tabela: string, campo: string, valor: string, tamanho = 0): Observable<any[]> {
    let url: string;
    url = this.url.aux + '/incluir';
    const aux = {
      tabela: tabela,
      campo: campo,
      valor: valor,
      tamanho: tamanho
    };
    console.log('aux->', aux.toString());
    const c = aux.toString();
    this.a$ = this.http.post<any[]>(url, aux, { headers: new HttpHeaders().set('Content-Type', 'application/json')});
    return this.a$;
  }


}
