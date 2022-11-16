import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {GraficoService} from "../_services/grafico.service";

@Component({
  selector: 'app-grafico-menu',
  templateUrl: './grafico-menu.component.html',
  styleUrls: ['./grafico-menu.component.css']
})
export class GraficoMenuComponent implements OnInit {


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
  modulo: SelectItem = null;
  tipo: SelectItem = null;
  campo: string = null;

  constructor(
    public gs: GraficoService,
  ) {
  }

  ngOnInit(): void {
  }

  mudaModulo() {
    this.tipo = null;
    this.campo = null;
    this.gs.mudaModulo(this.modulo.value);
  }

  mudaTipo(ev: SelectItem) {
    this.gs.mudaTipo(this.tipo.value);
  }

  mudaCampo(i: number) {
    this.gs.mudaCampo(this.campo, i)
  }

  onAtivo() {
    this.gs.ativo = !this.gs.ativo;
  }

}
