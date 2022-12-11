import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient} from "@angular/common/http";
import {MensagemI} from "../_models/mensagem-i";

@Injectable({
  providedIn: 'root'
})
export class MensagemService {

  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }

  getMensagemNLidas() {
    const url = this.url.mensagem;
    return this.http.get<MensagemI[]>(url);
  }

}
