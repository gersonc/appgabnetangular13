import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {nomeArquivo} from "./nome-arquivo";

export function DetalhePdf(tableElements: HTMLCollectionOf<Element>, arquivoNome: string) {
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

    doc.save(nomeArquivo('pdf', arquivoNome));

  }
}
