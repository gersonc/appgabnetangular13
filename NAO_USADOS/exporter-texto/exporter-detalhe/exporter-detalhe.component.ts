import {Component, Input, OnInit} from '@angular/core';
import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {nomeArquivo} from "../../functions/nome-arquivo";

@Component({
  selector: 'app-exporter-detalhe',
  templateUrl: './exporter-detalhe.component.html',
  styleUrls: ['./exporter-detalhe.component.css']
})
export class ExporterDetalheComponent implements OnInit {
  @Input() arquivoNome: string;
  constructor() { }

  ngOnInit(): void {
  }

  getPdf() {
    let tableElements: HTMLCollectionOf<Element> = document.getElementsByClassName('tabela');
    if (tableElements) {
      console.log('n tbls', tableElements.length);
      console.log('n tbls', tableElements);
    }

    if (tableElements.length > 0) {
      let doc = new jsPDF (
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );

      Array.from(tableElements).forEach(function(element: HTMLTableElement) {
        autoTable(doc, {
          html: element,
          headStyles: {
            fillColor: '#007bff',
            textColor: '#ffffff',
            halign: 'center',
            fontSize: 10,
            fontStyle: 'bold',
            lineWidth: 0.2
          },
        })
        // doc.addPage();
      });

      doc.save(nomeArquivo('pdf', this.arquivoNome));

    }
  }

}
