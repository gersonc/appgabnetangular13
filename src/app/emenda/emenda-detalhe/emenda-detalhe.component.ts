import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EmendaListarI} from "../_models/emenda-listar-i";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {AuthenticationService} from "../../_services";
import {TitulosI} from "../../_models/titulo-i";

@Component({
  selector: 'app-emenda-detalhe',
  templateUrl: './emenda-detalhe.component.html',
  styleUrls: ['./emenda-detalhe.component.css']
})
export class EmendaDetalheComponent implements OnInit {
  @Input() emenda: EmendaListarI
  @Input() camposTexto: string[];
  @Input() camposCurrency: string[];
  @Input() titulos: TitulosI[];
  @Output() hideDetalhe = new EventEmitter<boolean>();

  constructor(
    public aut: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

}
