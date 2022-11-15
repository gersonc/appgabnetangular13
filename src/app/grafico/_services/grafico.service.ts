import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../../_services";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {GraficoI} from "../_models/grafico-i";
import {SelectItem} from "primeng/api";
import {UIChart} from "primeng/chart";

@Injectable({
  providedIn: 'root'
})
export class GraficoService {
  public tpgraf = new BehaviorSubject('');
  public tpgraf$ = this.tpgraf.asObservable();
  sub: Subscription[] = [];
  graficos: GraficoI | null = null;
  data1: string = null;
  data2: string = null;
  campo: string  = null;
  idx = -1;
  tipoGrafico: SelectItem = null;
  ativo = false;
  hbar: UIChart;

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
    if (sessionStorage.getItem('grafico-'+dados.modulo)) {
      this.graficos = JSON.parse(sessionStorage.getItem('grafico-'+dados.modulo));
    } else {
      this.sub.push(this.postListarAll(dados)
        .pipe(take(1))
        .subscribe((graficoData) => {
            this.graficos = graficoData;
          },
          (err) => {
            console.error(err);
          },
          () => {
            sessionStorage.setItem('grafico-' + dados.modulo, JSON.stringify(this.graficos))
          }
        )
      );
    }
  }

  criaGrafico() {
    if (this.graficos !== null && this.campo !== null && this.tipoGrafico !== null) {
      this.idx = this.graficos.campos.findIndex(d => d.campo === this.campo);

      console.log('idx', this.idx);
    }
  }

}
