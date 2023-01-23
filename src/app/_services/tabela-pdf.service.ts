import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {limpaTabelaCampoTexto} from "../shared/functions/limpa-tabela-campo-texto";

export interface ColumnsInterface {
  header: string;
  dataKey: string;
}


@Injectable({
  providedIn: 'root'
})

export class TabelaPdfService {


  constructor() { }

  public static getDataNomeArquivo(): string {
    const d = new Date();
    let h = '';
    h += (d.getDate() > 9) ? d.getDate().toString() : '0' + d.getDate().toString();
    h += (d.getMonth() > 9) ? d.getMonth().toString() : '0' + d.getMonth().toString();
    h += d.getFullYear().toString();
    h += (d.getHours() > 9) ? d.getHours().toString() : '0' + d.getHours().toString();
    h += (d.getMinutes() > 9) ? d.getMinutes().toString() : '0' + d.getMinutes().toString();
    h += (d.getSeconds() > 9) ? d.getSeconds().toString() : '0' + d.getSeconds().toString();
    return h;
  }

  public static tabelaPdf(nomeArquivo: string, titulo: string, colunas: any[], valores: any[], campoTexto: string[] = [], vertical = false) {
    if (campoTexto.length === 0) {
      TabelaPdfService.getTabelaPdf(nomeArquivo, titulo, colunas, valores, vertical);
    } else {
      TabelaPdfService.getTabelaPdf(
        nomeArquivo,
        titulo,
        colunas,
        limpaTabelaCampoTexto(colunas, campoTexto, valores),
        vertical
      );
    }
  }

  public static getTabelaPdf(nomeArquivo: string, titulo: string, colunas: any[], valores: any[], vertical = false) {
    const colums: ColumnsInterface[] = colunas.map(col => ({header: col.header, dataKey: col.field}));

    let doc: any|null = null;
    if (vertical) {
      doc = new jsPDF(
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );
    } else {
      doc = new jsPDF(
        {
          orientation: 'l',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );
    }

    const totalPagesExp = '{total_pages_count_string}';

    doc.setFontSize(15);
    doc.text(titulo.toUpperCase(), 15, 15);
    doc.setFontSize(9);

    autoTable(doc, {
      columns: colums,
      body: valores,
      startY: 16,
      styles: {
        cellPadding: {
          top: 0.5,
          right: 1,
          bottom: 0.5,
          left: 2
        },
        fontSize: 9,
        valign: 'middle'
      },
      headStyles: {
        textColor: 255,
        fillColor: '#007bff',
        fontStyle: 'bold',
        fontSize: 9,
        lineWidth: 0.1,
        cellPadding: {
          top: 1,
          right: 1,
          bottom: 0.5,
          left: 2
        }
      },
      bodyStyles: {
        fillColor: 255,
        textColor: 80,
        fontStyle: 'normal',
        fontSize: 9,
        lineWidth: 0.1,
        cellPadding: {
          top: 1,
          right: 1,
          bottom: 0.5,
          left: 2
        }
      },
      didDrawPage: function (hookData) {
        // Footer
        let str = 'Página ' + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + ' de ' + totalPagesExp;
        }
        doc.setFontSize(8);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const pageWidth = pageSize.width ? pageSize.width : doc.internal.pageSize.getWidth;
        doc.text(str, pageWidth - 34, pageHeight - 10);
        doc.setFontSize(9);
      }
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp)
    }

    const nomeArq = `${nomeArquivo}_gabnet_${TabelaPdfService.getDataNomeArquivo()}.pdf`;
    doc.save(nomeArq);
    doc = null;
  }

  public static autoTabela(titulo: string,colunas: any[], valores: any[]) {
    const colums: ColumnsInterface[] = [];
    colunas.forEach((c) => {
      colums.push({
        header: c.header.toString(),
        dataKey: c.field.toString()
      });
    });

    let doc = new jsPDF(
      {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );

    autoTable(doc, {
      columns: colums,
      body: valores,
      styles: { cellPadding: 0.5, fontSize: 8 }
    });

    doc.save('table.pdf');
    // @ts-ignore
    doc = null;
  }
}
