import { Injectable } from '@angular/core';
import {AuthenticationService, UrlService} from "../../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {VersaoService} from "../../../_services/versao.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DetalheService {
  sub: Subscription[] = [];
  id: number;
  mostraDetalhe: boolean = false;
  modulo: string;
  registro?: any = null;
  hurl: string = null;
  campo_id: string;

  constructor(
    public aut: AuthenticationService,
    public vs: VersaoService,
    private url: UrlService,
    private http: HttpClient
  ) { }

  /*getDetalhe(modulo: string, id?: any) {
    this.modulo = modulo;
    if(id !== undefined && id !== null) {
      this.id = id;
    }
    this.detalhe();
  }*/

  getBusca(modulo: string, id?: number) {
    const url = this.url.getModulo(modulo) + '/' + id;
    return this.http.get<any>(url);
  }

  /*detalhe() {
    this.sub.push(this.getBusca()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.registro = dados;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.mostraDetalhe = true;
        }
      })
    );
  }*/



  sair() {
    this.destroy();
    this.mostraDetalhe = false;
  }

  destroy() {
    this.sub.forEach(s => s.unsubscribe());
    delete this.id;
    delete this.modulo;
    delete this.registro;
    delete this.campo_id;
    delete this.hurl;
  }

}
