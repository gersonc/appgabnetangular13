import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../../_services";
import {Observable, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {GraficoCampoI, GraficoI} from "../_models/grafico-i";

@Injectable({
  providedIn: 'root'
})
export class GraficoService {
  sub: Subscription[] = [];
  massaDados: GraficoI | null = null;
  data1: string = null;
  data2: string = null;
  campo: string | null = null;
  grafico: GraficoCampoI | null = null;


  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  geraCor(): string {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
  }

  calculaAltura(nr: number): string {
    if (nr > 25) {
      nr = nr * 20;
    }
    return nr + 'px';
  }


  postListarAll(dados?: any): Observable<GraficoI> {
    console.log('aaaaaaaaaaaaaaaaa', dados);
    const url = this.url.grafico + '/';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<GraficoI>(url, dados, httpOptions);
  }





  getDados(dados?: any) {
    this.sub.push(this.postListarAll(dados)
      .pipe(take(1))
      .subscribe((graficoData) => {
          this.massaDados = graficoData;
        },
        (err) => {
          console.error(err);
        },
        () => {

          // this.grafico =  this.massaDados.campos[dados.modulo];
          // console.log('grafico', this.grafico);
          /*this.numregs = this.massaDados['numregs'];
          this.linhas = this.massaDados['numregs'][this.campo];
          this.alturaGrafico = this.gs.calculaAltura(this.massaDados['numregs'][this.campo]);
          setTimeout(() => {
            this.dados = this.massaDados[this.campo];
          },1000);
          this.cs.escondeCarregador();*/
        }
      )
    );
  }

}
