import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../../_services";
import {interval, Observable, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {GraficoI, GraficoInterface} from "../_models/grafico-i";
import {SelectItem} from "primeng/api";
import Chart from 'chart.js';
import {WindowsService} from "../../_layout/_service";

@Injectable({
  providedIn: 'root'
})
export class GraficoService {

  sub: Subscription[] = [];
  graficos: GraficoI | null = null;
  data1: string = null;
  data2: string = null;
  idx = -1;
  modulo: string = null;
  campo: string = null;
  tipo: string = null;
  ativo = false;
  busca: any = null;
  dados: GraficoInterface = null;
  graf: CanvasRenderingContext2D;
  chart: Chart = null;
  opcaoes: any = null;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  inicio() {
    const canvas = <HTMLCanvasElement> WindowsService.doc.getElementById('chart');
    this.graf = canvas.getContext("2d");
    this.opcaoes = {
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 50
        }
      },
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }*/
    };
  }

  setGraf() {
    this.chart = new Chart(this.graf, {
      type: this.tipo,
      data: this.dados,
      options: this.opcaoes
    });
  }

  upDateDados() {
    this.chart.config.data = this.dados;
    if (this.chart.config.type === null) {
      if (this.tipo !== null) {
        this.chart.config.type = this.tipo;
      }
    }
    this.chart.update();
  }

  geraCor(): string {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
  }

  postListarAll(dados?: any): Observable<GraficoI> {
    const url = this.url.grafico + '/';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<GraficoI>(url, dados, httpOptions);
  }

  getDados(dados?: any) {
    this.idx = -1;
    this.dados = null;
    this.tipo = null;
    this.campo = null;
    this.graficos = null;
    if (this.chart !== null) {
      this.chart.destroy();
      this.chart = null;
      this.graf = null;
    }
    if (sessionStorage.getItem('grafico-'+dados.modulo)) {
      if (this.graf === null) {
        this.inicio();
      }
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
            if (this.graf === null) {
              this.inicio();
            }
            sessionStorage.setItem('grafico-' + dados.modulo, JSON.stringify(this.graficos));
          }
        )
      );
    }
  }

  mudaModulo(m: string) {
    this.modulo = m;
    this.busca = {modulo: this.modulo};
    this.getDados(this.busca);
  }

  mudaCampo(c: string, i: number) {
    if (this.getAtivo()) {
      if(this.idx !== i) {
        this.campo = c;
        this.idx = i;
        this.dados = this.graficos.campos[i];
        this.upDateDados();
      } else {
        this.idx = i;
        this.campo = c;
      }
    } else {
      this.idx = i;
      this.campo = c;
      this.criaGrafico();
    }
  }

  mudaTipo(t: string) {
    if (this.getAtivo()) {
      if (this.tipo !== t) {
        this.tipo = t;
        this.chart.config.type = this.tipo;
        this.chart.destroy();
        this.setGraf();
      } else {
        this.tipo = t;
      }
    } else {
      this.tipo = t;
      this.criaGrafico();
    }
  }

 /* mudaTipoAux(t: string) {
    this.tipo = t;
    this.dados = this.graficos.campos[this.idx];
  }*/

  getAtivo(): boolean {
    return (this.graficos !== null && this.dados !== null && this.modulo !== null && this.campo !== null && this.tipo !== null && this.idx !== -1);
  }

  criaGrafico() {
    if (this.graficos !== null && this.modulo !== null && this.tipo !== null) {
      this.dados = this.graficos.campos[this.idx];
      if(this.chart === null) {
        this.setGraf();
      } else {
        this.upDateDados();
      }
    }
  }
}
