import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Endereco, EnderecoPesquisa } from "./model/endereco";
import { HttpClient } from "@angular/common/http";
import { ViacepValidacaoService } from "./viacep-validacao.service";
import { CEPErrorMsg } from "./model/constantes";
import { UrlService } from "../../_services";

@Injectable({
  providedIn: 'root'
})
export class ViacepService {

  constructor(
    private us: UrlService,
    private http: HttpClient,
    private vl: ViacepValidacaoService
  ) { }

  buscarPorCep(cep: string): Observable<Endereco> {
    const n: number = this.vl.validarCEP(cep);
    if (n < 100) {
      const e: Endereco = {
        erro: true,
        erromsg: CEPErrorMsg[n]
      }
      return of(e);
    } else {
      const url = this.us.viacep + cep + '/json/';
      return this.http.get<Endereco>(url);
    }
  }

  buscarPorEndereco(uf: string, municipio: string, logradouro: string): Observable<Endereco[]> {
    const b: EnderecoPesquisa = {
      uf: uf,
      municipio: municipio,
      logradouro: logradouro
    };
    const n: number = this.vl.validarEndereco(b);
    if (n < 100) {
      const e: Endereco = {
        erro: true,
        erromsg: CEPErrorMsg[n]
      }
      const es: Endereco[] = [
        e
      ];
      return of(es);
    } else {
      const url = this.us.viacep + uf.toLowerCase() + '/' + municipio.toLowerCase() + '/' + logradouro.toLowerCase() + '/json/';
      return this.http.get<Endereco[]>(url);
    }
  }



}
