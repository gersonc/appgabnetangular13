import { Injectable } from '@angular/core';
import {pdfExporter} from 'quill-to-pdf';
import * as quillToWord from 'quill-to-word';
import * as quill from 'quill';
// import * as Delta from 'Delta';
// import {jsPDF} from "jspdf";
// import autoTable, {applyPlugin} from "jspdf-autotable";
import {PDFDocument} from "pdf-lib";
import { saveAs } from 'file-saver';
import {ColunasI} from "../_models/colunas-i";
import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable';
import {autoTable, applyPlugin, UserOptions } from 'jspdf-autotable';
import {PdfRelatorioI, PdfTabela} from "../_models/pdf-relatorio-i";
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
declare var html2canvas: any;
declare interface ColumnsInterface {
  title: string;
  dataKey: string;
}

applyPlugin(jsPDF);
@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  static toExportFileName(pdfFileName: string): string {
    return `${pdfFileName}_export_${new Date().getTime()}.pdf`;
  }

  public static tabelaToPdf(pdfFileName: string , colunas: ColunasI[], dados: any[]) {
    const columns: ColumnsInterface[] = colunas.map(col => ({title: col.header, dataKey: col.field}));
    let doc = new jsPDF (
      {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
      },
    ) as jsPDFCustom;

    /*autoTable({
      head: head,
      body: processo,
      startY: 20,
      pageBreak: 'avoid',
      styles: { cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8 },
      headStyles: {
        textColor: 255,
        fillColor: '#007bff',
        fontStyle: 'bold',
        fontSize: 10,
        lineWidth: 0,
        cellPadding: {
          top: 1,
          right: 0.5,
          bottom: 0.5,
          left: 2}
      },
      bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 },
      didDrawPage: (d) => {
        linha = d.cursor.y;
      },
    });*/



    doc.setFontSize(10);
    // @ts-ignore
    doc.autoTable(columns, dados);
    doc.save(`${pdfFileName}_export_${new Date().getTime()}.pdf`);



  }
}
