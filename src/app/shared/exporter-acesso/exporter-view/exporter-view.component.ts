import {Component, Input, OnInit} from '@angular/core';
import {ExporterViewI} from "../../../_models/exporter-view-i";
import {limpaTexto150Null} from "../../functions/limpa-texto";
import {ExporterService} from "../../../_services/exporter.service";
import {Stripslashes} from "../../functions/stripslashes";

@Component({
  selector: 'app-exporter-view',
  templateUrl: './exporter-view.component.html',
  styleUrls: ['./exporter-view.component.css']
})
export class ExporterViewComponent implements OnInit {
  @Input() detalhe?: ExporterViewI | null;
  constructor(
    public es: ExporterService
  ) { }

  ngOnInit(): void {
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  limpaTexto150Nulo(str: string): string {
    return limpaTexto150Null(str);
  }

}
