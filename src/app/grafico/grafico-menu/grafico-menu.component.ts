import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {GraficoService} from "../_services/grafico.service";
import {GraficoCampoI} from "../_models/grafico-i";

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
    },
    {
      label: 'Solicitação',
      value: 'solicitacao'
    }
  ];

  grafVal: string | null = null;

  constructor(
    public gs: GraficoService,
  ) {
  }


  escoleGrafico(ev: SelectItem) {
    console.log('ev', ev );
    const d = {modulo: ev.value};
    this.gs.getDados(d);
  }


  ngOnInit(): void {
  }

}
