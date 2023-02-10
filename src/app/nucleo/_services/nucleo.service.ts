import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from "../../_services";
import { LocalClass, LocalInterface } from "../_models/nucleo";
import {SelectItem} from "primeng/api";
import { HeaderService } from "../../_services/header.service";

@Injectable({
  providedIn: 'root'
})
export class NucleoService {
  nuForm: LocalInterface = null;
  nuAcao: string;
  nuExecutado = false;
  nuMostraBt = true;
  formDisplay = false;
  formularioSN = false;
  ddUsuario_id: SelectItem[] = [];
  ddnucleo: SelectItem[] = [];
  locais: LocalInterface[] = [];
  idx = -1;

  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }

  newNucleo(): LocalInterface {
    return {
      local_id: 0,
      local_nome: null,
      local_endereco: null,
      local_telefone: null,
      local_responsavel_usuario_id: null,
      local_responsavel_usuario_nome: null,
      local_color: null
    };
  }

  fechaForm() {
    this.formDisplay = false;
    this.formularioSN = false;
  }

  listar(): Observable<LocalInterface[]> {
    const url = this.url.nucleo + '/listar';
    // @ts-ignore
    return this.http.get<LocalInterface[]>(url, HeaderService.tokenHeader);
  }

  incluir(et: LocalInterface): Observable<any[]> {
    const url = this.url.nucleo + '/incluir';
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.post<any[]> (url, et, httpOptions);
  }

  alterar(nu: LocalInterface): Observable<any[]> {
    const url = this.url.nucleo;
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.put<any[]> (url, nu, httpOptions);
  }

  excluir(local_id: number): Observable<any[]> {
    const url = this.url.nucleo + '/' + local_id;
    return this.http.delete<any[]>(url, HeaderService.tokenHeader)
  }

  ngDestroy() {
    delete this.nuForm;
    delete this.nuAcao;
    delete this.nuExecutado;
    delete this.nuMostraBt;
    delete this.formDisplay;
    delete this.formularioSN;
    delete this.ddUsuario_id;
    delete this.ddnucleo;
    delete this.locais;
    delete this.idx;
  }
}
