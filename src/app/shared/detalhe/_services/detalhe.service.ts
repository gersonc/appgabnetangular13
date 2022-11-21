import { Injectable } from '@angular/core';
import {AuthenticationService, UrlService} from "../../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {VersaoService} from "../../../_services/versao.service";

@Injectable({
  providedIn: 'root'
})
export class DetalheService {

  mostraDetalhe: boolean = false;
  id: number;
  campo_id: string = null;
  modulo: string;
  registro?: any = null;
  hurl: string = null;

  constructor(
    public aut: AuthenticationService,
    public vs: VersaoService,
    private url: UrlService,
    private http: HttpClient,
  ) { }

  getDetalhe(modulo: string, id: number, campo_id?: string) {
    this.modulo = modulo;
    this.id = id;
    if(campo_id !== undefined && campo_id !== null) {
      this.campo_id = campo_id;
    } else {
    }
  }

  postBusca(busca: any) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.solic + '/listar';
    return this.http.post<any>(url, busca, httpOptions);
  }

  detalhe() {

  }

  montaBusca() {
    if (this.campo_id === undefined || this.campo_id === null) {

    }
  }

}
