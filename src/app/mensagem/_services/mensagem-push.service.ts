import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient} from "@angular/common/http";
import {MensagemI} from "../_models/mensagem-i";

@Injectable({
  providedIn: 'root'
})
export class MensagemPushService {

  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }

  getMensagemNLidas() {
    const url = this.url.msg;
    return this.http.get<MensagemI[]>(url);
  }
}
