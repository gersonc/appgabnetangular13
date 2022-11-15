import {Component,OnInit, ViewChild} from '@angular/core';
import {GraficoService} from "../_services/grafico.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-grafico-grafico',
  templateUrl: './grafico-grafico.component.html',
  styleUrls: ['./grafico-grafico.component.css']
})
export class GraficoGraficoComponent implements OnInit  {
  sub: Subscription[] = [];
  constructor(
    public gs: GraficoService
  ) { }



  ngOnInit(): void {
    this.sub.push(this.gs.tpgraf$.subscribe(
      vf => {
        this.reloadGraf(vf);
      })
    );
  }

  reloadGraf(vf) {


  }



}
