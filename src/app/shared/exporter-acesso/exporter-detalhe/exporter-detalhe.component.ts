import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Input() classe = 'tabela';
  @Input() pdfOnOff = true;
  @Output() pdfOnOffChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  detalhePdf() {
    this.pdfOnOffChange.emit(false);
    const tableElements: HTMLCollectionOf<Element> = document.getElementsByClassName(this.classe);
    DetalhePdf(tableElements, this.arquivoNome);
  }

}
