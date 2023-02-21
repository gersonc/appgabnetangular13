import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as printJS from 'print-js';

@Component({
  selector: 'app-impressao-botao',
  templateUrl: './impressao-botao.component.html',
  styleUrls: ['./impressao-botao.component.css']
})
export class ImpressaoBotaoComponent implements OnInit {
  @Input() dados: string = '';
  @Output() imprimindo = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }


  imprimir() {
    printJS({
      printable: this.dados,
      type: 'html',
      css: 'assets/css/impressao.css',
      scanStyles: false
    });
  }

}
