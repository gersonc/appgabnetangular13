import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import Chart from 'chart.js';
import * as printJS from 'print-js';
import {jsPDF} from "jspdf";
import {Observable, Subscription} from "rxjs";
import {WindowsService} from "../../../_layout/_service";
import {SelectItem} from "primeng/api";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {take} from "rxjs/operators";
import {UrlService} from "../../../_services";
import {GraficoI, GraficoInterface} from "../../../graficos/_models/grafico-i";


@Component({
  selector: 'app-graf',
  templateUrl: './graf.component.html',
  styleUrls: ['./graf.component.css']
})
export class GrafComponent implements OnInit, OnChanges {
  @Output() hideGrafico = new EventEmitter<boolean>();
  @Input() busca: any;
  @Input() modulo: string;
  isOpen = false;
  showGrafico = true;
  sub: Subscription[] = [];
  wd = '3rem';
  graficos: GraficoI | null = null;
  data1: string = null;
  data2: string = null;
  idx = -1;
  campof: SelectItem = null;
  campo: string = null;
  tipof: SelectItem = null;
  tipo: string = null;
  ativo = false;
  dados: GraficoInterface = null;
  // graf: CanvasRenderingContext2D = null;
  chart: Chart = null;
  opcaoes = {
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
  arquivoNome: string = null;
  ddModulos: SelectItem[] = [
    {
      label: 'Cadastro',
      value: 'cadastro'
    },{
      label: 'Solicitação',
      value: 'solicitacao'
    }
    ,{
      label: 'Ofício',
      value: 'oficio'
    }
    ,{
      label: 'Processo',
      value: 'processo'
    }
    ,{
      label: 'Emenda',
      value: 'emenda'
    }
  ];
  ddTipo: SelectItem[] = [
    {
      label: 'BARRAS',
      value: 'bar'
    }, {
      label: 'DONUT',
      value: 'doughnut'
    }, {
      label: 'POLAR',
      value: 'polarArea'
    }, {
      label: 'TORTA',
      value: 'pie'
    }, {
      label: 'BARRAS HORZ.',
      value: 'horizontalBar'
    }
  ];
  showSN = true;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.busca) {
      this.busca['modulo'] = this.modulo;
      this.getDados(this.busca);
    }
  }

  mostraMenu(): void {
    this.isOpen = !this.isOpen;
  }

  escondeGrafico() {
    this.hideGrafico.emit(false);
  }

  fechar() {
    this.showSN = false;
  }

  setGraf() {
    if (this.getAtivo()) {
      // delete this.graf;
      this.chart.destroy();
      delete this.chart;
      const canvas = <HTMLCanvasElement> WindowsService.doc.getElementById('chart');
      const graf: CanvasRenderingContext2D = canvas.getContext("2d");
      graf.fillStyle = "white";
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
      this.chart = new Chart(graf, {
        type: this.tipo,
        data: this.dados,
        options: this.opcaoes,
        plugins: [plugin],
      });
    }

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
    url = this.url.getModulo(dados.modulo) + '/grafico';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<GraficoI>(url, dados, httpOptions);
  }

  getDados(dados?: any) {
      this.sub.push(this.postListarAll(dados)
        .pipe(take(1))
        .subscribe((graficoData) => {
            this.showSN = true;
            this.graficos = graficoData;
          },
          (err) => {
            console.error(err);
          },
          () => {
            this.toggle();
          }
        )
      );
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.wd = (this.isOpen) ? '20rem' : '3rem';
  }

  getAtivo(): boolean {
    return (this.graficos !== null && this.dados !== null && this.modulo !== null && this.campo !== null && this.tipo !== null && this.idx !== -1);
  }

  mudaTipo(ev: SelectItem) {
    this.tipo = ev.value;
    this.setGraf();
  }

  mudaCampo(ev: string, i: number) {
    this.idx = i;
    this.campo = ev;
    this.dados = this.graficos.campos[this.idx];
    this.upDateDados()
    // this.setGraf();
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

}
