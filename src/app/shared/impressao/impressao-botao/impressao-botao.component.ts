import {Component, ElementRef, Input, OnInit, SimpleChanges} from '@angular/core';


type ImpressaoBotaoT = [string, HTMLTableElement];

@Component({
  selector: 'app-impressao-botao',
  templateUrl: './impressao-botao.component.html',
  styleUrls: ['./impressao-botao.component.css']
})
export class ImpressaoBotaoComponent implements OnInit {
  @Input() dados: ImpressaoBotaoT;


  constructor() { }

  ngOnInit(): void {
  }


  /*ngOnChanges(changes: SimpleChanges) {
    if (changes.dados.currentValue !== undefined && changes.dados.currentValue !== null) {
      // this.imprimir();
    }
  }*/

  imprimir() {
    const ref: HTMLTableElement = this.dados[1];
    const tit: string = this.dados[0];
    let printSection = document.createElement("div");
    printSection.id = "printSection";
    document.body.appendChild(printSection);
    printSection.innerHTML = "";
    printSection.appendChild(ref.cloneNode(true));
    window.print();
  }

}
