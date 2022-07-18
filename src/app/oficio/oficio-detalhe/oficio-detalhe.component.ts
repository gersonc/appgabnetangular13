import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OficioListarI} from "../_models/oficio-listar-i";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-oficio-detalhe',
  templateUrl: './oficio-detalhe.component.html',
  styleUrls: ['./oficio-detalhe.component.css']
})
export class OficioDetalheComponent implements OnInit {
  @Input() oficio: OficioListarI
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
