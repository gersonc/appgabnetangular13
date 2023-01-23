import {Component, Input, OnInit} from '@angular/core';

type ImpressaoBotaoT = [string, HTMLTableElement];
@Component({
  selector: 'app-exporter-impressao-detalhe',
  templateUrl: './exporter-impressao-detalhe.component.html',
  styleUrls: ['./exporter-impressao-detalhe.component.css']
})
export class ExporterImpressaoDetalheComponent implements OnInit {
  @Input() dados: ImpressaoBotaoT;

  constructor() { }

  ngOnInit(): void {
  }

  imprimir() {
    const ref: HTMLTableElement = this.dados[1];
    const tit: string = this.dados[0];
    const printSection = document.createElement("div");
    printSection.id = "printSection";
    document.body.appendChild(printSection);
    printSection.innerHTML = "";
    printSection.appendChild(ref.cloneNode(true));
    window.print();
  }

}
