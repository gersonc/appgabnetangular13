import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Endereco} from "./model/endereco";
import {validarCEP, validarEndereco} from "./utils";
import {map, switchMap} from "rxjs/operators";
import {BASE_URL} from "./model/constantes";
import {CEPError} from "./model/cep-error";
import {CEPErrorCode} from "./model/cep-error-code";

@Injectable({
  providedIn: 'root'
})
export class ViacepService {

  constructor(private http: HttpClient) { }

  /**
   * Busca o endereço a partir do CEP
   *
   * @param cep
   */
  buscarPorCep(cep: string): Observable<Endereco> {
    return of(cep).pipe(
      validarCEP(),
      switchMap(cepValido =>
        this.http.get<Endereco>(`${BASE_URL}/${cepValido}/json`)
      ),
      map((endereco) => {
        if ('cep' in endereco) {
          return endereco;
        }
        throw new CEPError(CEPErrorCode.CEP_NAO_ENCONTRADO);
      })
    );
  }

  /**
   * Faz a busca aproximada
   *
   * @param uf
   * @param municipio
   * @param logradouro
   */
  buscarPorEndereco(
    uf: string,
    municipio: string,
    logradouro: string
  ): Observable<Endereco[]> {
    return of({ uf, municipio, logradouro }).pipe(
      validarEndereco(),
      switchMap(() =>
        this.http.get<Endereco[]>(
          `${BASE_URL}/${uf}/${municipio}/${logradouro}/json`
        )
      )
    );
  }
}
