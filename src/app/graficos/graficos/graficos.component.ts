import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Observable, Subscription} from "rxjs";
import Chart from 'chart.js';
import * as printJS from 'print-js';
import {jsPDF} from "jspdf";
import {WindowsService} from "../../_layout/_service";
import {take} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../../_services";
import {GraficoI, GraficoInterface} from "../_models/grafico-i";


@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit, OnDestroy {


  sub: Subscription[] = [];
  mostraMenuInterno = true;
  graficos: GraficoI | null = null;
  data1: string = null;
  data2: string = null;
  data12: string = null;
  data22: string = null;
  idx = -1;
  modulo1: SelectItem = null;
  modulo: string = null;
  campo: string = null
  campo1: string = null;
  tipo: string = null
  tipo1: SelectItem = null;
  ativo = false;
  busca: any = null;
  dados: GraficoInterface = null;
  graf: CanvasRenderingContext2D;
  chart: Chart = null;
  arquivoNome: string = null;
  modal = false;

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

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  mudaModulo() {
    if (this.modulo1.value !== this.modulo) {
      this.limpaChar();
      this.modulo = this.modulo1.value;
      const busca = {modulo: this.modulo};
      this.getDados(busca);
    }

  }

  mudaCampo(i) {
    if (this.campo1 !== this.campo) {
      this.campo = this.campo1
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
        }
      }
    }
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
      }
    }
  }

  upDateDados() {
    this.chart.config.data = this.dados;
    if (this.chart.config.type === undefined || this.chart.config.type === null) {
      if (this.tipo !== undefined && this.tipo !== null) {
        this.chart.config.type = this.tipo;
      }
    }
    this.chart.update();
  }

  getDados(dados?: any) {
    const canvas = <HTMLCanvasElement> WindowsService.doc.getElementById('chart');
    this.graf = canvas.getContext("2d");

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
            sessionStorage.setItem('grafico-' + dados.modulo, JSON.stringify(this.graficos));
          }
        )
      );
    }
  }

  postListarAll(dados?: any): Observable<GraficoI> {
    const url = this.url.grafico + '/';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<GraficoI>(url, dados, httpOptions);
  }

  mostraMenu(ev?: boolean) {
    if (ev !== undefined) {
      this.mostraMenuInterno = ev;
    } else {
      this.mostraMenuInterno = !this.mostraMenuInterno;
    }
  }

  getAtivo(): boolean {
    return (this.graficos !== null && this.dados !== null && this.modulo !== null && this.campo !== null && this.tipo !== null && this.idx !== -1);
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
    grafp.fillStyle = "white";
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
      },
      plugins: [plugin],
    });
  }

  buscar() {
    if (this.data1 !== this.data12 || this.data2 !== this.data22) {
      if (sessionStorage.getItem('grafico-'+this.modulo)) {
        sessionStorage.removeItem('grafico-'+this.modulo);
      }
      delete this.dados;
      if (this.chart) {
        this.chart.destroy();
      }
      delete this.chart;
      this.data12 = this.data1;
      this.data22 = this.data2;
      const dados = {
        modulo: this.modulo,
        data1: this.data1,
        data2: this.data2
      };
      this.getDados(dados);
    }
  }


  limpaChar() {
    this.idx = -1;
    delete this.modulo;
    delete this.dados;
    delete this.tipo;
    delete this.campo;
    delete this.graficos;
    delete this.data1;
    delete this.data12;
    delete this.data2;
    delete this.data22;
    delete this.graf;
    if (this.chart) {
      this.chart.destroy();
    }
    delete this.chart;
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
    delete this.graf;
    delete this.chart;
    delete this.opcaoes;
    delete this.arquivoNome;
    this.ddModulos.forEach(d => {
      sessionStorage.removeItem('grafico-'+d.value);
    });
  }

}
