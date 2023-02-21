import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';


type ImpressaoBotaoT = [string, HTMLTableElement];

@Component({
  selector: 'app-impressao-botao',
  templateUrl: './impressao-botao.component.html',
  styleUrls: ['./impressao-botao.component.css']
})
export class ImpressaoBotaoComponent implements OnInit {
  @Input() dados: ImpressaoBotaoT;
  @Output() imprimindo = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }


  imprimir() {

    this.imprimindo.emit(true);
    window.addEventListener('afterprint', (event) => {
      const y = document.getElementById("printSection");
      if (y) {
        const c = document.getElementById('body');
        c.removeChild(y);
      }
      window.removeEventListener('afterprint', event => {});
    });
    // const ref: HTMLTableElement = this.dados[1];
    const ref: HTMLElement = document.getElementById("detalhecadastro");
    console.log('impressao', JSON.stringify(ref));
    const t = document.getElementById("printSection");
    if (t) {
      const b = document.getElementById('body');
      const throwawayNode = b.removeChild(t);
    }
    const tit: string = this.dados[0];
    const printSection = document.createElement("div");
    printSection.id = "printSection";
    document.body.appendChild(printSection);
    printSection.innerHTML = "";
    printSection.appendChild(ref.cloneNode(true));
    window.print();
    const y = document.getElementById("printSection");
    if (y) {
      const c = document.getElementById('body');
      c.removeChild(y);
      this.imprimindo.emit(false);
    }
  }

}
