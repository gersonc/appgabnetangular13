import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {EtiquetaInterface} from "../_models";
import {EtiquetaService} from "../_services";
import {LinhaI, TabelaI} from "../_models/etiqueta-print-i";
import {SelectItem} from "primeng/api";
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";
import {EtiquetaCadastroService} from "../_services/etiqueta-cadastro.service";
import * as printJS from 'print-js';

@Component({
  selector: 'app-etiqueta-print',
  templateUrl: './etiqueta-print.component.html',
  styleUrls: ['./etiqueta-print.component.css']
})
export class EtiquetaPrintComponent implements OnInit {
  @Output() hideEtiqueta = new EventEmitter<boolean>();
  @Input() tplistagem: number;
  ddEtiqueta: SelectItem[] = [];

  mostraListagem = false;
  imprimindoVF = false;

  tabelas: TabelaI[] = [];
  linhas: LinhaI[] = []
  etq: EtiquetaInterface;
  etqPPag = 0;
  sub: Subscription[] = [];
  numEtqInicial = 0;
  numEtqs = 0;
  numPaginas = 0;


  constructor(
    public es: EtiquetaService,
    private ecs: EtiquetaCadastroService,
    private dd: DdService,
  ) {
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('dropdown-etiqueta')) {
      this.sub.push(this.dd.getDd('dropdown-etiqueta')
        .pipe(take(1))
        .subscribe((dados) => {
            sessionStorage.setItem('dropdown-etiqueta', JSON.stringify(dados));
          },
          (err) => console.error(err),
          () => {
            this.carregaDD();
          }
        )
      );
    } else {
      this.carregaDD();
    }
  }

  carregaDD() {
    this.ddEtiqueta = JSON.parse(sessionStorage.getItem('dropdown-etiqueta'));
  }

  getEtiquetaConfig(etq_id: number) {
    this.sub.push(this.es.getConfigEtiqueta(etq_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.etq = dados;
        },
        error: err => console.log('erro', err.toString()),
        complete: () => {
          if (this.ecs.tplistagem !== 3) {
            this.montaTabela();
          } else {
            this.getCadastroEtiquetas();
          }

        }
      })
    );
  }

  getCadastroEtiquetas() {
    this.sub.push(this.es.postEtiquetas()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.ecs.cadastro = dados;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.montaTabela();
        }
      })
    );
  }

  montaTabela() {
    this.numEtqInicial = this.ecs.numEtqInicial
    this.numEtqs = this.ecs.cadastro.length;
    this.etqPPag = this.etq.etq_linhas * this.etq.etq_colunas;


    while (this.ecs.cadastro.length !== 0) {
      const tb: TabelaI = {
        linhas: []
      };
      while (tb.linhas.length < this.etq.etq_linhas) {
        const ln: LinhaI = {
          celulas: []
        };
        while (ln.celulas.length < this.etq.etq_colunas) {
          ln.celulas.push(this.ecs.cadastro.shift());
        }
        tb.linhas.push(ln);
      }
      this.tabelas.push(tb);
      if (this.ecs.cadastro.length === 0) {
        this.numPaginas = this.tabelas.length;
        this.mostraListagem = true;
      }
    }
  }

  secao(): any {
    return (this.imprimindoVF) ? null : {
        'border-width.px': 1,
        'border-color': 'red',
        'border-style': 'solid',
        'width.px': ((this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral)) * 3.78),
        'min-height.px': ((this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior)) * 3.78),
        'padding.px': 0,
        'margin-top.px': (this.etq.etq_margem_superior * 3.78),
        'margin-right.px': (this.etq.etq_margem_lateral * 3.78),
        'margin-left.px': (this.etq.etq_margem_lateral * 3.78)
      };
  }

  linha(): any {
    return (this.imprimindoVF) ? null : {
        'min-height.px': (this.etq.etq_altura * 3.78)
      };
  }

  cola(): any {
    return (this.imprimindoVF) ? null : {
        'min-width.px': (this.etq.etq_largura * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  colb(): any {
    return (this.imprimindoVF) ? null : {
        'width.px': (this.etq.etq_distancia_horizontal * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  colc(): any {
    return (this.imprimindoVF) ? null : {
      'min-width.px': (this.etq.etq_largura * 3.78),
      'height.px': (this.etq.etq_altura * 3.78),
      'padding-top.px': 3.78,
      'padding-right.px': 7.5,
      'padding-bottom.px': 3.78,
      'padding-left.px': 7.5
      };
  }

  cold(): any {
    return (this.imprimindoVF) ? null : {
        'min-width.px': (this.etq.etq_largura * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  cole(): any {
    return (this.imprimindoVF) ? null : {
        'min-width.px': (this.etq.etq_distancia_horizontal * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  getCss(): string {
    const css =
      `
@page {
  background: white;
  display: block;
}

@page[size="latter"] {
  width: 215.9mm;
  height: 279.4mm;
}
@page[size="latter"][layout="landscape"] {
       width: 279.4mm;
       height: 215.9mm;
     }

@page[size="A4"] {
       width: 21cm;
       height: 29.7cm;
     }

@page[size="A4"][layout="landscape"] {
       width: 29.7cm;
       height: 21cm;
     }
@page[size="A3"] {
       width: 29.7cm;
       height: 42cm;
     }
@page[size="A3"][layout="landscape"] {
       width: 42cm;
       height: 29.7cm;
     }
@page[size="A5"] {
       width: 14.8cm;
       height: 21cm;
     }
@page[size="A5"][layout="landscape"] {
       width: 21cm;
       height: 14.8cm;
     }
@media print {

  * {
    background: transparent !important;
    color:#000 !important;
    text-shadow: none !important;;
  }


  article.artigo {
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }


  section.etq-secao {
    font-size: 8.0pt!important;
    font-family: 'Verdana', sans-serif;
  }

  section.etq-secao {
    display: block;
    box-sizing: border-box;
    justify-items: center;
    page-break-after: always;
    break-after: page;
  }

  etq-tbody {
    display: block;
  }

  table {
    width: 100%;
    border-collapse:collapse;
    background-color: transparent;
    font-size: 8.0pt!important;
    font-family: 'Verdana', sans-serif;
  }


  td {
    box-sizing: border-box !important;
    border: 1pt solid black;
    overflow: hidden!important;
    text-overflow: clip!important;
  }

  article.artigo {
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }
  section.etq-secao {
    font-size: 8.0pt!important;
    font-family: "Verdana, Arial, Helvetica, sans-serif", 'sans-serif';
  }
  section.etq-secao {
    display: block;
    box-sizing: border-box;
    justify-items: center;
    page-break-after: always;
    break-after: page;
  }

  .etq-secao {
    width: ${(this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral))}mm;
    min-height: ${(this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior))}mm;
    padding: 0;
    margin-top: ${this.etq.etq_margem_superior}mm;
    margin-right: ${this.etq.etq_margem_lateral}mm;
    margin-left: ${this.etq.etq_margem_lateral}mm;
  }

  .linha {
    min-height: ${this.etq.etq_altura}mm;
  }

  .etq-tbody {
    display: block;
  }
  table.etq-tabela {
    width: 100%;
    border-collapse:collapse;
    background-color: transparent;
    font-size: 8.0pt!important;
    font-family: "Verdana, Arial, Helvetica, sans-serif", 'sans-serif';
  }

  .cola{
        width: ${this.etq.etq_largura}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .colb{
        width: ${this.etq.etq_distancia_horizontal}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .colc{
        width: ${this.etq.etq_largura}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .cold{
        width: ${this.etq.etq_largura}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .cole{
        width: ${this.etq.etq_distancia_horizontal}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }
  }
  `;

    return css;
  }

  imprimir() {
    console.log('css', this.getCss());
    this.imprimindoVF = true;
    printJS({printable: 'artigo', type: 'html', style: this.getCss(), scanStyles: false});
  }

  fechar() {
    this.hideEtiqueta.emit(true);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.ecs.cadastro = [];
    this.ecs.busca = null;
    this.ecs.tplistagem = 0;
  }

  secao2() {
    return (this.imprimindoVF) ?
      {
        'width.mm': (this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral)),
        'min-height.mm': (this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior)),
        'padding.mm': 0,
        'margin-top.mm': this.etq.etq_margem_superior,
        'margin-right.mm': this.etq.etq_margem_lateral,
        'margin-left.mm': this.etq.etq_margem_lateral,
        'font-size.pt': 8.0,
        'font-family': 'Verdana, Arial, Helvetica, sans-serif'
      } : {
        'border-width.px': 1,
        'border-color': 'red',
        'border-style': 'solid',
        'width.px': ((this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral)) * 3.78),
        'min-height.px': ((this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior)) * 3.78),
        'padding.px': 0,
        'margin-top.px': (this.etq.etq_margem_superior * 3.78),
        'margin-right.px': (this.etq.etq_margem_lateral * 3.78),
        'margin-left.px': (this.etq.etq_margem_lateral * 3.78)
      };

  }

  linha2(): any {
    return (this.imprimindoVF) ?
      {
        'min-height.mm': this.etq.etq_altura
      } : {
        'min-height.px': (this.etq.etq_altura * 3.78)
      };
  }

  cola2(): any {
    return (this.imprimindoVF) ?
      {
        'width.mm': this.etq.etq_largura,
        'height.mm': this.etq.etq_altura,
        'padding-top.mm': 1,
        'padding-right.mm': 2,
        'padding-bottom.mm': 1,
        'padding-left.mm': 2
      } : {
        'width.px': (this.etq.etq_largura * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  colb2(): any {
    return (this.imprimindoVF) ?
      {
        'width.mm': this.etq.etq_distancia_horizontal,
        'height.mm': this.etq.etq_altura,
        'padding-top.mm': 1,
        'padding-right.mm': 2,
        'padding-bottom.mm': 1,
        'padding-left.mm': 2
      } : {
        'width.px': (this.etq.etq_distancia_horizontal * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  colc2(): any {
    return (this.imprimindoVF) ?
      {
        'width.mm': this.etq.etq_largura,
        'height.mm': this.etq.etq_altura,
        'padding-top.mm': 1,
        'padding-right.mm': 2,
        'padding-bottom.mm': 1,
        'padding-left.mm': 2
      } : {
        'width.px': (this.etq.etq_largura * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  cold2(): any {
    return (this.imprimindoVF) ?
      {
        'width.mm': this.etq.etq_largura,
        'height.mm': this.etq.etq_altura,
        'padding-top.mm': 1,
        'padding-right.mm': 2,
        'padding-bottom.mm': 1,
        'padding-left.mm': 2
      } : {
        'width.px': (this.etq.etq_largura * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

  cole2(): any {
    return (this.imprimindoVF) ?
      {
        'width.mm': this.etq.etq_distancia_horizontal,
        'height.mm': this.etq.etq_altura,
        'padding-top.mm': 1,
        'padding-right.mm': 2,
        'padding-bottom.mm': 1,
        'padding-left.mm': 2
      } : {
        'width.px': (this.etq.etq_distancia_horizontal * 3.78),
        'height.px': (this.etq.etq_altura * 3.78),
        'padding-top.px': 3.78,
        'padding-right.px': 7.5,
        'padding-bottom.px': 3.78,
        'padding-left.px': 7.5
      };
  }

}
