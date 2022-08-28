import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContaI} from "../_models/conta-i";
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";

@Component({
  selector: 'app-conta-detalhe',
  templateUrl: './conta-detalhe.component.html',
  styleUrls: ['./conta-detalhe.component.css']
})
export class ContaDetalheComponent implements OnInit {
  @Input() conta: ContaI;
  @Output() hideDetalhe = new EventEmitter<boolean>();
  formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  pdfOnOff = true;
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

  formataValor(n: number): string {
    return this.formatterBRL.format(n);
  }

}
