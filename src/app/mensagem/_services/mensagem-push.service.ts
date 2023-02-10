import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MensagemI} from "../_models/mensagem-i";
// import {AutenticacaoService} from "../../_services/autenticacao.service";
import {of} from "rxjs";
import { AutorizaService } from "../../_services/autoriza.service";

@Injectable({
  providedIn: 'root'
})
export class MensagemPushService {

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private aut: AutorizaService
  ) { }

  getMensagemNLidas() {
    if (this.aut.vfRefToken) {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.aut.token
        })
      };


      const url = this.url.msg;
      return this.http.get<MensagemI[]>(url, httpOptions);
    } else {
      return of([]);
    }

  }
}
