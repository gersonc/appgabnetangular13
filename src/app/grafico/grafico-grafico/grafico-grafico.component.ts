import {Component, OnInit} from '@angular/core';
import {GraficoService} from "../_services/grafico.service";
import {Subscription} from "rxjs";
import {WindowsService} from "../../_layout/_service";
@Component({
  selector: 'app-grafico-grafico',
  templateUrl: './grafico-grafico.component.html',
  styleUrls: ['./grafico-grafico.component.css']
})
export class GraficoGraficoComponent implements OnInit  {
  ctx: CanvasRenderingContext2D;
  sub: Subscription[] = [];

  constructor(
    public gs: GraficoService
  ) { }

  ngOnInit(): void {
    this.gs.inicio();
  }

  reloadGraf(vf) {
  }


}
