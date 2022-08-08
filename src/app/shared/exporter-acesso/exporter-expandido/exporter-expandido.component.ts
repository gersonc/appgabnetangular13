import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {CelulaI} from "../../../_models/celula-i";
import {ExporterService} from "../../../_services/exporter.service";
import {limpaTextoNull} from "../../functions/limpa-texto";
import {CAMPOSCOMUNICACAO} from "../../email-telefone-celular/email-telefone-celular-i";
import {Stripslashes} from "../../functions/stripslashes";

@Component({
  selector: 'app-exporter-expandido',
  templateUrl: './exporter-expandido.component.html',
  styleUrls: ['./exporter-expandido.component.css']
})
export class ExporterExpandidoComponent implements OnInit {
  @Input() celula: CelulaI;

  constructor(
    public es: ExporterService
  ) {
  }

  tipo = 100;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ce) {
      if (changes.celula.currentValue !== undefined) {
        if (!this.celula.txtVF) {
          this.tipo = this.es.getDestino(this.celula.field)
        }

      }
    }
  }

  getDestino(): boolean {
    return (CAMPOSCOMUNICACAO.indexOf(this.celula.field) !== -1) ;
  }

  mostraTexto() {
    this.celula.cphtml = Stripslashes(this.celula.cphtml);
    this.es.mostraTexto(this.celula);
  }

  limpaTextoNulo(str: any): any {
    return limpaTextoNull(str);
  }

  ngOnInit(): void {
  }

}
