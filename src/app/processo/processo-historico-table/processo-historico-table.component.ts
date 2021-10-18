import { Component, Input, OnInit } from "@angular/core";
import { ProcessoHistoricoInterface } from "../_models";

@Component({
  selector: 'app-processo-historico-table',
  templateUrl: './processo-historico-table.component.html',
  styleUrls: ['./processo-historico-table.component.css']
})
export class ProcessoHistoricoTableComponent implements OnInit {
  @Input() historico: ProcessoHistoricoInterface[];

  constructor() { }

  ngOnInit() {
  }

}
