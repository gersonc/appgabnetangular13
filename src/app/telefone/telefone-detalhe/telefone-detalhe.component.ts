import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stripslashes} from "../../shared/functions/stripslashes";
import {TelefoneInterface} from "../_models/telefone";

@Component({
  selector: 'app-telefone-detalhe',
  templateUrl: './telefone-detalhe.component.html',
  styleUrls: ['./telefone-detalhe.component.css']
})
export class TelefoneDetalheComponent implements OnInit {
  @Output() hideDetalhe = new EventEmitter<boolean>();
  @Input() telefone: TelefoneInterface


  constructor() { }

  ngOnInit(): void {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

}
