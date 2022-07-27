import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EmendaListarI} from "../_models/emenda-listar-i";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-emenda-detalhe',
  templateUrl: './emenda-detalhe.component.html',
  styleUrls: ['./emenda-detalhe.component.css']
})
export class EmendaDetalheComponent implements OnInit {
  @Input() emenda: EmendaListarI
  @Output() hideDetalhe = new EventEmitter<boolean>();

  real = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

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
