import {Component, Input, OnInit} from '@angular/core';
import {CelulaI} from "../../../_models/celula-i";
import {ExporterService} from "../../../_services/exporter.service";
import {limpaTextoNull} from "../../functions/limpa-texto";

@Component({
  selector: 'app-exporter-celula',
  templateUrl: './exporter-celula.component.html',
  styleUrls: ['./exporter-celula.component.css']
})
export class ExporterCelulaComponent implements OnInit {
  @Input() celula: CelulaI;
  constructor(
    public es: ExporterService
  ) { }

  mostraTexto() {
    this.es.mostraTexto(this.celula);
  }

  limpaTextoNulo(str: any): any {
    return limpaTextoNull(str);
  }

  ngOnInit(): void {
  }

}
