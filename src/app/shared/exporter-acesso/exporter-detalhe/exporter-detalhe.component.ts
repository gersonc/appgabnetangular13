import {Component, Input, OnInit} from '@angular/core';
/*import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {nomeArquivo} from "../../functions/nome-arquivo";*/
import {DetalhePdf} from "../../functions/detalhe-pdf";

@Component({
  selector: 'app-exporter-detalhe',
  templateUrl: './exporter-detalhe.component.html',
  styleUrls: ['./exporter-detalhe.component.css']
})
export class ExporterDetalheComponent implements OnInit {
  @Input() arquivoNome: string;
  @Input() classe: string = 'tabela';

  constructor() { }

  ngOnInit(): void {
  }

  detalhePdf() {
    let tableElements: HTMLCollectionOf<Element> = document.getElementsByClassName(this.classe);
    DetalhePdf(tableElements, this.arquivoNome);
  }

}
