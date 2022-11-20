import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';

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
export class GrafComponent implements OnInit, OnChanges, OnDestroy {
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
  data12: string = null;
  data22: string = null;null;
  idx = -1;
  campo: string = null
  campo1: string = null;
  tipo: string = null
  tipo1: SelectItem = null;
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
    this.isOpen = false;
    this.wd =  '3rem'
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
    return (
      this.graficos !== undefined &&
      this.graficos !== null &&
      this.dados !== undefined &&
      this.dados !== null &&
      this.modulo !== undefined &&
      this.modulo !== null &&
      this.campo !== undefined &&
      this.campo !== null &&
      this.tipo !== undefined &&
      this.tipo !== null &&
      this.idx !== -1);
  }

  mudaTipo() {
    if (this.tipo1.value !== this.tipo) {
      this.tipo = this.tipo1.value;
      if (this.campo !== undefined && this.campo !== null) {
        if (this.chart !== undefined && this.chart !== null) {
          this.chart.destroy();
          delete this.chart;
        }
        this.chart = null;
        const canvas = <HTMLCanvasElement>WindowsService.doc.getElementById('chart');
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
        this.isOpen = false;
        this.wd =  '3rem'
      }
    }
  }

  mudaCampo(i) {
    if (this.campo !== this.campo1) {
      this.campo = this.campo1;
      this.idx = i;
      delete this.dados;
      this.dados = null;
      this.dados = this.graficos.campos[this.idx];
      if (this.tipo !== undefined && this.tipo !== null) {
        if (this.chart !== undefined && this.chart !== null) {
          this.upDateDados();
        } else {
          const canvas = <HTMLCanvasElement>WindowsService.doc.getElementById('chart');
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
          this.isOpen = false;
          this.wd =  '3rem'
        }
      }
    }
  }

  mouseEnter() {
    if (this.graficos !== undefined && this.graficos !== null && !this.isOpen) {
      this.isOpen = true;
      this.wd =  '20rem';
    }
  }
  mouseleave() {
    this.isOpen = false;
    this.wd =  '3rem';
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

  ngOnDestroy() {
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
    delete this.chart;
    delete this.opcaoes;
    delete this.arquivoNome;
  }

}
