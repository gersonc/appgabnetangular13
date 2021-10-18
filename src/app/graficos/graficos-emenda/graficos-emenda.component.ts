import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem, SelectItem } from "primeng/api";
import { CarregadorService } from "../../_services";
import { GraficosService } from "../_services/graficos.service";
import { GraficoInterface } from "../_models/grafico";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

import html2canvas from 'html2canvas';
declare var jsPDF: any;

@Component({
  selector: 'app-graficos-emenda',
  templateUrl: './graficos-emenda.component.html',
  styleUrls: ['./graficos-emenda.component.css']
})
export class GraficosEmendaComponent implements OnInit, OnDestroy {

  sub: Subscription[] = [];
  campo: string = 'emenda_data_solicitacao';
  tipoGraf: string = 'horizontalBar';
  massaDados: any[] = null;
  dados: GraficoInterface = null;
  resp: any[];
  ddTipoGraf: SelectItem[] = [];
  numregs: any = null;

  linhas: number = 25;
  alturaGrafico: string = null;
  titulos: string[] = [];
  titulo: string = 'Datas de solicitação';
  data1: string = null;
  data2: string = null;
  ptbr: any = null;

  constructor(
    private cs: CarregadorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gs: GraficosService
  ) { }

  ngOnInit(): void {
    this.ptbr = this.gs.configuraCalendario();
    this.getDropDown();
    this.getDados();
  }

  getDropDown() {
    const tp0: SelectItem = {
      label: 'BARRAS',
      value: 'bar'
    };
    const tp1: SelectItem = {
      label: 'DONUT',
      value: 'doughnut'
    };
    const tp2: SelectItem = {
      label: 'POLAR',
      value: 'polarArea'
    };
    const tp3: SelectItem = {
      label: 'TORTA',
      value: 'pie'
    };
    const tp4: SelectItem = {
      label: 'BARRAS HORZ.',
      value: 'horizontalBar'
    };

    this.ddTipoGraf.push(tp4);
    this.ddTipoGraf.push(tp0);
    this.ddTipoGraf.push(tp1);
    this.ddTipoGraf.push(tp2);
    this.ddTipoGraf.push(tp3);

    this.titulos['emenda_data_solicitacao'] = 'Emendas - Datas de solicitação';
    this.titulos['emenda_assunto_nome'] = 'Emendas - Assuntos';
    this.titulos['emenda_cadastro_tipo_nome'] = 'Emendas - Tipos de cadastros';
    this.titulos['emenda_tipo_emenda_nome'] = 'Emendas - Tipos de emendas';
    this.titulos['cadastro_municipio_nome'] = 'Emendas - Municípios';
    this.titulos['emenda_orgao_solicitado_nome'] = 'Emendas - Orgãos solicitados';
    this.titulos['emenda_ogu_nome'] = 'Emendas - O.G.U.';
    this.titulos['emenda_situacao'] = 'Emendas - Situações';
  }

  getDados() {
    const dts = {data1: this.data1, data2: this.data2};
    this.sub.push(this.gs.postListarAll('emenda', dts)
      .pipe(take(1))
      .subscribe((dados) => {
          this.massaDados = dados;
        },
        (err) => {
          console.error(err);
          this.cs.escondeCarregador();
        },
        () => {
          this.numregs = this.massaDados['numregs'];
          setTimeout(() => {
            this.dados = this.massaDados[this.campo];
          },1000);
          this.cs.escondeCarregador();
        }
      )
    );
  }

  onTipoGraficoChange(event) {
    if (this.linhas > 30) {
      this.tipoGraf = 'horizontalBar';
    } else {
      this.tipoGraf = event.value.toString();
    }
    this.dados = null;
    setTimeout(() => {
      this.dados = this.massaDados[this.campo];
    },1000);
  }

  onCampoClick(event) {
    this.titulo = this.titulos[this.campo];
    this.linhas = this.numregs[this.campo];
    if (this.linhas > 30) {
      this.tipoGraf = 'horizontalBar';
    }
    this.alturaGrafico = this.gs.calculaAltura(this.numregs[this.campo]);
    this.dados = null;
    setTimeout(() => {
      this.dados = this.massaDados[this.campo];
    },1000);
  }

  buscaData() {
    if (this.data1 || this.data2) {
      this.getDados();
    }
  }

  voltar() {
    this.router.navigate(['/grafico']);
  }

  imprimir(cte) {
    this.gs.imprimir(cte, this.titulo);
  }

  imprimir2(cte) {
    this.gs.imprimir2(cte, this.titulo, this.linhas);
  }

  printImg(cte) {
    this.gs.printImg(cte, this.titulo);
  }

  printImg2(cte) {
    this.gs.printImg2(cte, this.titulo, this.linhas);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
  }

}
