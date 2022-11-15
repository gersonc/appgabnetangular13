import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {GraficoService} from "../_services/grafico.service";

@Component({
  selector: 'app-grafico-menu',
  templateUrl: './grafico-menu.component.html',
  styleUrls: ['./grafico-menu.component.css']
})
export class GraficoMenuComponent implements OnInit {


  menuGrafico: SelectItem[] = [
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

  menuTipoGrafico: SelectItem[] = [
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

  grafVal: string | null = null;

  constructor(
    public gs: GraficoService,
  ) {
  }

  ngOnInit(): void {
  }

  escoleGrafico(ev: SelectItem) {
    const d = {modulo: ev.value};
    this.gs.getDados(d);
  }

  escolheTipoGrafico(ev: SelectItem) {
    this.gs.criaGrafico();
    this.gs.tpgraf.next(ev.value);
  }

  escolheCampo(ev) {
    this.gs.criaGrafico();
  }

  onAtivo() {
    this.gs.ativo = !this.gs.ativo;
  }

}
