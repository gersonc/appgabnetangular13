import { Component, Input, OnInit } from "@angular/core";
import { ProcessoOficioInterface } from "../_models";

@Component({
  selector: 'app-processo-oficio-table',
  templateUrl: './processo-oficio-table.component.html',
  styleUrls: ['./processo-oficio-table.component.css']
})
export class ProcessoOficioTableComponent implements OnInit {
  @Input() oficio: ProcessoOficioInterface[];

  constructor() { }

  ngOnInit() {
  }


}
