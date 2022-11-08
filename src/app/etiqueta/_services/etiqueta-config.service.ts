import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from "../../_services";
import { EtiquetaClass, EtiquetaInterface } from "../_models";

@Injectable({
  providedIn: 'root'
})
export class EtiquetaConfigService {

  etqForm: EtiquetaInterface = {};
  etqAcao: string;
  etqExecutado = false;
  formDisplay = false;

  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }

  listar(): Observable<EtiquetaInterface[]> {
    const url = this.url.etiquetaconfig + '/listar';
    return this.http.get<EtiquetaInterface[]>(url);
  }

  incluir(et: EtiquetaClass): Observable<any[]> {
    const url = this.url.etiquetaconfig + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, et, httpOptions);
  }

  alterar(et: EtiquetaClass): Observable<any[]> {
    const url = this.url.etiquetaconfig;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]> (url, et, httpOptions);
  }

  excluir(etq_id: number): Observable<any[]> {
    const url = this.url.etiquetaconfig + '/' + etq_id;
    return this.http.delete<any[]>(url)
  }

  novaEtiqueta(): EtiquetaInterface {
    return {
      etq_id: null,
      etq_marca: null,
      etq_modelo: null,
      etq_margem_superior: 0,
      etq_margem_lateral: 0,
      etq_distancia_vertical: 0,
      etq_distancia_horizontal: 0,
      etq_altura: 0,
      etq_largura: 0,
      etq_linhas: 0,
      etq_colunas: 0,
      etq_folha_horz: 0,
      etq_folha_vert: 0
    }
  }
}
