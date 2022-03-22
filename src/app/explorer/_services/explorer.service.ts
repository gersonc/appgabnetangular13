import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient} from "@angular/common/http";
import {PastaListagem} from "../_models/arquivo-pasta.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {

  pastaListagem: PastaListagem[] = [];
  pastaFuturo: PastaListagem  ;
  pastaAtual: PastaListagem;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  gerListagem(id = 0) {
    const n = (id > 0) ? '/' + id : '';
    const url = this.url.explorer + '/listar' + n;
  }
}
