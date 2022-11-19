import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../../_services";
import {Observable, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {GraficoI, GraficoInterface} from "../_models/grafico-i";
import Chart from 'chart.js';
import * as printJS from 'print-js';
import {jsPDF} from "jspdf";
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
  arquivoNome: string = null;
  modal = false;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) {

  }

  inicio() {
    const canvas = <HTMLCanvasElement> WindowsService.doc.getElementById('chart');
    this.graf = canvas.getContext("2d");
    this.graf.fillStyle = "blue";
    this.opcaoes = {
      plugins: {
        customCanvasBackgroundColor: {
          color: 'rgb(255, 255, 255)',
        }
      },
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 50
        }
      },
      maintainAspectRatio: false,
    };
  }

  setGraf() {
    const plugin = {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#ffffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };
    this.chart = new Chart(this.graf, {
      type: this.tipo,
      data: this.dados,
      options: this.opcaoes,
      plugins: [plugin],
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

  postListarAll(dados?: any): Observable<GraficoI> {
    let url = '';
    if (this.modal) {
      url = this.url[dados.modulo] + '/grafico';
    } else {
      url = this.url.grafico + '/';
    }
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
      this.graficos = JSON.parse(sessionStorage.getItem('grafico-'+dados.modulo));
      if (this.graf === null) {
        this.inicio();
      }

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

  getArquivoNome():string {
    let tmpDate = new Date();
    let tmpNome = this.modulo + '-' + this.campo + '-';
    return tmpNome + '-' + tmpDate.toISOString().split('T')[0] + '.png';
  }

  getArquivoNome2():string {
    let tmpDate = new Date();
    let tmpNome = this.modulo + '-' + this.campo + '-';
    return tmpNome + '-' + tmpDate.toISOString().split('T')[0] + '.pdf';
  }


  getImg() {
    let x = <HTMLAnchorElement> WindowsService.doc.getElementById('chartimg');
    x.href = this.chart.toBase64Image();
    x.download = this.getArquivoNome();
    x.click();
  }

  getPrintPdf(vf: boolean = false) {
    const canvas2 = <HTMLCanvasElement> WindowsService.doc.getElementById('chartp');
    const grafp = canvas2.getContext("2d");

    let chartp = new Chart(grafp, {
      type: this.tipo,
      data: this.dados,
      options: {
        plugins: {
          customCanvasBackgroundColor: {
            color: 'rgb(255, 255, 255)',
          }
        },
        layout: {
          padding: {
            left: 50,
            right: 50,
            top: 50,
            bottom: 50
          }
        },
        maintainAspectRatio: false,
        animation: {
          onComplete: (animation) => {
            if (vf) {
              var img = animation.animationObject.chart.toBase64Image();
              printJS({printable: img, type: 'image'})
            } else {
              var newCanvasImg = animation.animationObject.chart.toBase64Image();
              var doc = new jsPDF('landscape');
              doc.addImage(newCanvasImg, 'PNG', 10, 10, 280, 150 );
              doc.save(this.getArquivoNome2());
            }
          }
        }
      }
    });

  }

  onDestroy() {
    this.sub.forEach(s => s.unsubscribe());
    delete this.graficos;
    delete this.data1;
    delete this.data2;
    delete this.idx;
    delete this.modulo;
    delete this.campo;
    delete this.tipo;
    delete this.ativo;
    delete this.busca;
    delete this.dados;
    delete this.graf;
    delete this.chart;
    delete this.opcaoes;
    delete this.arquivoNome;
  }


}
