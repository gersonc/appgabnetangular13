import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { CarregadorService } from '../../_services';
import { GraficosService } from '../_services/graficos.service';
import { GraficoInterface } from '../_models/grafico';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-graficos-solicitacao',
  templateUrl: './graficos-solicitacao.component.html',
  styleUrls: ['./graficos-solicitacao.component.css']
})
export class GraficosSolicitacaoComponent implements OnInit, OnDestroy {
  @ViewChild('hbar', { static: true }) public hbar: UIChart;
  sub: Subscription[] = [];
  campo: string = 'solicitacao_data2';
  tipoGraf: string = 'horizontalBar';
  massaDados: any[] = null;
  dados: GraficoInterface = null;
  resp: any[];
  ddTipoGraf: SelectItem[] = [];
  numregs: any = null;

  linhas: number = 25;
  alturaGrafico: string = null;
  titulos: string[] = [];
  titulo: string = 'Datas das solicitações';
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

    this.titulos['solicitacao_data2'] = 'Solicitações - Data das solicitações';
    this.titulos['solicitacao_assunto_nome'] = 'Solicitações - Assuntos';
    this.titulos['solicitacao_cadastrante_cadastro_nome'] = 'Solicitações - Cadastrantes';
    this.titulos['solicitacao_atendente_cadastro_nome'] = 'Solicitações - Atendentes';
    this.titulos['solicitacao_reponsavel_analize_nome'] = 'Solicitações - Responsáveis pela análise';
    this.titulos['cadastro_municipio_nome'] = 'Solicitações - Municípios';
    this.titulos['solicitacao_area_interesse_nome'] = 'Solicitações - Áreas de interesse';
    this.titulos['solicitacao_posicao'] = 'Solicitações - Posições';
  }

  getDados() {
    const dts = {modulo: 'solicitacao', data1: this.data1, data2: this.data2};
    this.sub.push(this.gs.postListarAll('modulo', dts)
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
          this.linhas = this.massaDados['numregs'][this.campo];
          this.alturaGrafico = this.gs.calculaAltura(this.massaDados['numregs'][this.campo]);
          console.log('load', this.numregs, this.linhas, this.alturaGrafico);
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
