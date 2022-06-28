import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EmailTelefoneCelularI, getComunicacao} from "./email-telefone-celular-i";

@Component({
  selector: 'app-email-telefone-celular',
  templateUrl: './email-telefone-celular.component.html',
  styleUrls: ['./email-telefone-celular.component.css']
})
export class EmailTelefoneCelularComponent implements OnInit, OnChanges {
  @Input() valor?: any;
  @Input() field?: string | null;
  campo: EmailTelefoneCelularI
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.valor.currentValue !== null && changes.field.currentValue !== null) {
        this.campo = getComunicacao(this.field, this.valor);
      }
    }

  }

  ngOnInit(): void {
  }

}
