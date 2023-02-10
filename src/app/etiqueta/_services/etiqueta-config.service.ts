import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { UrlService } from "../../_services";
import { EtiquetaInterface } from "../_models";
import { EtiquetaDropdownI } from "../_models/etiqueta-dropdown-i";
import { HeaderService } from "../../_services/header.service";

@Injectable({
  providedIn: "root"
})
export class EtiquetaConfigService {

  etqForm: EtiquetaInterface = {};
  etqAcao: string;
  etqExecutado = false;
  formDisplay = false;
  etiquetas: EtiquetaInterface[];
  etiqueta: EtiquetaInterface;
  idx: number;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) {
  }

  listar(): Observable<EtiquetaInterface[]> {
    const url = this.url.etiquetaconfig + "/listar";
    return this.http.get<EtiquetaInterface[]>(url, HeaderService.tokenHeader);
  }

  incluir(et: EtiquetaInterface): Observable<any[]> {
    const url = this.url.etiquetaconfig + "/incluir";
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "application/json"
      })
    };
    return this.http.post<any[]>(url, et, httpOptions);
  }

  alterar(et: EtiquetaInterface): Observable<any[]> {
    const url = this.url.etiquetaconfig;
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "application/json"
      })
    };
    return this.http.put<any[]>(url, et, httpOptions);
  }

  excluir(etq_id: number): Observable<any[]> {
    const url = this.url.etiquetaconfig + "/" + etq_id;
    return this.http.delete<any[]>(url, HeaderService.tokenHeader);
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
    };
  }

  dropToList(et: EtiquetaDropdownI[]): EtiquetaInterface[] {
    return et.map((e) => {
      return {
        etq_id: e.etq_id,
        etq_marca: e.etq_marca,
        etq_modelo: e.etq_modelo,
        etq_margem_superior: e.etq_margem_superior,
        etq_margem_lateral: e.etq_margem_lateral,
        etq_distancia_vertical: e.etq_distancia_vertical,
        etq_distancia_horizontal: e.etq_distancia_horizontal,
        etq_altura: e.etq_altura,
        etq_largura: e.etq_largura,
        etq_linhas: e.etq_linhas,
        etq_colunas: e.etq_colunas,
        etq_folha_horz: e.etq_folha_horz,
        etq_folha_vert: e.etq_folha_vert
      };
    });
  }

  listToDrop(et: EtiquetaInterface[]): EtiquetaDropdownI[] {
    return et.map((e) => {
      return {
        label: e.etq_marca + " - " + e.etq_modelo,
        etq_id: e.etq_id,
        etq_marca: e.etq_marca,
        etq_modelo: e.etq_modelo,
        etq_margem_superior: e.etq_margem_superior,
        etq_margem_lateral: e.etq_margem_lateral,
        etq_distancia_vertical: e.etq_distancia_vertical,
        etq_distancia_horizontal: e.etq_distancia_horizontal,
        etq_altura: e.etq_altura,
        etq_largura: e.etq_largura,
        etq_linhas: e.etq_linhas,
        etq_colunas: e.etq_colunas,
        etq_folha_horz: e.etq_folha_horz,
        etq_folha_vert: e.etq_folha_vert
      };
    });
  }


}
