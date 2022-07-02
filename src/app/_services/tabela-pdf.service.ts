import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ColumnsInterface {
  header: string;
  dataKey: string;
}


@Injectable({
  providedIn: 'root'
})

export class TabelaPdfService {


  constructor() { }

  public static autoTabela2(nomeArquivo: string, titulo: string, colunas: any[], valores: any[]) {
    const colums: ColumnsInterface[] = colunas.map(col => ({header: col.header, dataKey: col.field}));
    /*colunas.forEach((c) => {
      colums.push({
        header: c.header.toString(),
        dataKey: c.field.toString()
      });
    });*/

    let doc: any|null = new jsPDF(
      {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );

    let pageNumber = doc.getNumberOfPages();

    doc.setFontSize(15);
    doc.text(titulo.toUpperCase(), 15, 15);
    doc.setFontSize(9);

    autoTable(doc,{
      columns: colums,
      body: valores,
      startY: 16,
      styles: { cellPadding: {
        top: 0.5,
          right: 0.5,
          bottom: 0.5,
          left: 2},
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
          right: 0.5,
          bottom: 0.5,
          left: 2}
      },
      bodyStyles: {
        fillColor: 255,
        textColor: 80,
        fontStyle: 'normal',
        fontSize: 9,
        lineWidth: 0.1
      }
    });
    const nomeArq = `${nomeArquivo}_gabnet_${new Date().getTime()}.pdf`;
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
