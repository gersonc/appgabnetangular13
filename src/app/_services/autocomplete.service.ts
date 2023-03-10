import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { SelectItem } from 'primeng/api';
import { HeaderService } from "./header.service";

@Injectable({
  providedIn: 'root' // just before your class
})
export class AutocompleteService {

  private autocompleteUrl = this.url.autocompleteservice;
  private acsimple$?: Observable<any[]>;
  private acLimpo$?: Observable<SelectItem[]>;

  constructor(private url: UrlService, private http: HttpClient ) { }

  getACSimples(tabela: string, campo_nome: string, str: string): Observable<any[]> {
    const ac = this.autocompleteUrl + '/acsimples'
      + '/' + tabela
      + '/' + campo_nome
      + '/' + str;
    this.acsimple$ = this.http.get<any[]>(ac, HeaderService.tokenHeader);
    return this.acsimple$;
  }

  getACSimples2(tabela: string, campo_nome: string, str: string): Observable<any[]> {
    const ac = this.autocompleteUrl + '/acsimples2';
    const httpOptions = {
      headers: new HttpHeaders({
        'GabNet': tabela + ',' + campo_nome + ',' + str,
        'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json'
      })
    };

    this.acsimple$ = this.http.get<any[]>(ac, httpOptions);
    return this.acsimple$;
  }

  getACSimples3(tabela: string, campo_nome: string, str: string): Observable<any[]> {
    str = encodeURI(str.toUpperCase());
    const ac = this.autocompleteUrl + '/acsimples3';
    const httpOptions = {
      headers: new HttpHeaders({
        'GabNet': tabela + ',' + campo_nome + ',' + str,
        'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json'
      })
    };
    this.acsimple$ = this.http.get<any[]>(ac, httpOptions);
    return this.acsimple$;
  }

  getAcNomeLimpo(str: string) {
    str = encodeURI(str.toUpperCase());
    const ac = this.autocompleteUrl + '/acnomelimpo';
    const httpOptions = {
      headers: new HttpHeaders({
        'GabNet': str,
        'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any[]>(ac, httpOptions);
  }

  acCadastroId(str: string) {
    str = encodeURI(str.toUpperCase());
    const ac = this.autocompleteUrl + '/accadastroid';
    const httpOptions = {
      headers: new HttpHeaders({
        'GabNet': str,
        'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<SelectItem[]>(ac, httpOptions);
  }

  acCadastroIdTipo(str: string, id: number) {
    str = encodeURI(str.toUpperCase());
    const ac = this.autocompleteUrl + '/accadastroidtipo';
    const httpOptions = {
      headers: new HttpHeaders({
        'GabNet': str + ',' + id,
        'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<SelectItem[]>(ac, httpOptions);
  }

  acCadastroIdContem(str: string, id?: number | null) {
    const busca: any = {
      texto: str,
      id: (id === undefined || id === null) ? null : id
    };
    const httpOptions = {headers: new HttpHeaders({
        'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json'
    })};
    const url = this.autocompleteUrl + '/accadastroidcontem';
    return this.http.post<SelectItem[]>(url, busca, httpOptions);
  }

  getAcIdNomeNomeLimpo(
    tabela: string,
    campo_id: string,
    campo_nome: string,
    campo_nome_limpo: string,
    str: string): Observable<SelectItem[]> {
      const ac = this.autocompleteUrl + '/acidnomelimpo';
      const dados = tabela + ',' + campo_id + ',' + campo_nome + ',' + campo_nome_limpo + ',' + str;
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
          'GabNet': dados
        })
      };
      this.acLimpo$ = this.http.get<SelectItem[]>(ac, httpOptions);
      return this.acLimpo$;
    }

  getAcIdNomeNomeLimpoTipo(
    tipo: number,
    tabela: string,
    campo_id: string,
    campo_nome: string,
    campo_nome_limpo: string,
    str: string): Observable<SelectItem[]> {
    const ac = this.autocompleteUrl + '/acidnomelimpotipo';
    const dados = tipo + ',' + tabela + ',' + campo_id + ',' + campo_nome + ',' + campo_nome_limpo + ',' + str;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'GabNet': dados
      })
    };
    this.acLimpo$ = this.http.get<SelectItem[]>(ac, httpOptions);
    return this.acLimpo$;
  }
}
