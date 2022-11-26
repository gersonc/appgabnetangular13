import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MensagemFormI} from "../_models/mensagem-form-i";

@Injectable({
  providedIn: 'root'
})
export class MensagemFormService {

  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }

  incluir(msg: MensagemFormI) {
    const url = this.url.mensagem + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, msg, httpOptions);
  }
}
