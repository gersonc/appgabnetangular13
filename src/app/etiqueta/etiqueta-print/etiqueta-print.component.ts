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
    this.sub.push(this.es.getConfigEtiqueta(etq_id).subscribe({
        next: (dados) => {
          this.etq = dados;
          console.log('getConfigEtiqueta', dados);
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
          //this.total = +dados.total.num;
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
      let tb: TabelaI = {
        linhas: []
      };
      while (tb.linhas.length < this.etq.etq_linhas) {
        let ln: LinhaI = {
          celulas: []
        };
        while (ln.celulas.length !== this.etq.etq_colunas) {
          ln.celulas.push(this.ecs.cadastro.shift());
        }
        tb.linhas.push(ln);
      }
      this.tabelas.push(tb);
      // t++;
      if (this.ecs.cadastro.length === 0) {
        this.mostraListagem = true;
        console.log('this.tabelas', this.tabelas);
      }
    }
  }

  secao() {
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
    /*return (this.imprimindoVF) ?
      {
        width: (this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral)) + 'mm',
        minHeight: (this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior)) + 'mm',
        padding: 0,
        marginTop: this.etq.etq_margem_superior + 'mm',
        marginRight: this.etq.etq_margem_lateral + 'mm',
        marginLeft: this.etq.etq_margem_lateral + 'mm'
      } : {
        'width': ((this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral)) * 3.78) + 'px',
        'min-height': ((this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior)) * 3.78) + 'px',
        'padding': 0,
        'margin-top': (this.etq.etq_margem_superior * 3.78) + 'px',
        'margin-right': (this.etq.etq_margem_lateral * 3.78) + 'px',
        'margin-left': (this.etq.etq_margem_lateral * 3.78) + 'px'
      };*/
  }

  /*secao() {
    return (this.imprimindoVF) ?
      {
        width: (this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral)) + 'mm',
        minHeight: (this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior)) + 'mm',
        padding: 0,
        marginTop: this.etq.etq_margem_superior + 'mm',
        marginRight: this.etq.etq_margem_lateral + 'mm',
        marginLeft: this.etq.etq_margem_lateral + 'mm'
      } : {
        width: ((this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral)) * 3.78) + 'px',
        minHeight: ((this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior)) * 3.78) + 'px',
        padding: 0,
        marginTop: (this.etq.etq_margem_superior * 3.78) + 'px',
        marginRight: (this.etq.etq_margem_lateral * 3.78) + 'px',
        marginLeft: (this.etq.etq_margem_lateral * 3.78) + 'px'
      };
  }*/

  linha(): any {
    return (this.imprimindoVF) ?
      {
        'min-height.mm': this.etq.etq_altura
      } : {
        'min-height.px': (this.etq.etq_altura * 3.78)
      };
  }

  cola(): any {
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

  colb(): any {
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
      }  ;
  }

  colc(): any {
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

  cold(): any {
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

  cole(): any {
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


  imprimir() {
    this.imprimindoVF = true;
    printJS({ printable: 'artigo', type: 'html' });
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


}
