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


  imprimir() {
    window.addEventListener('afterprint', (event) => {
      let y = document.getElementById("printSection");
      if (y) {
        let c = document.getElementById('body');
        c.removeChild(y);
      }
      window.removeEventListener('afterprint', event => {});
    });
    const ref: HTMLTableElement = this.dados[1];
    let t = document.getElementById("printSection");
    if (t) {
      let b = document.getElementById('body');
      let throwawayNode = b.removeChild(t);
    }
    const tit: string = this.dados[0];
    let printSection = document.createElement("div");
    printSection.id = "printSection";
    document.body.appendChild(printSection);
    printSection.innerHTML = "";
    printSection.appendChild(ref.cloneNode(true));
    window.print();
    let y = document.getElementById("printSection");
    if (y) {
      let c = document.getElementById('body');
      c.removeChild(y);
    }
  }

}
