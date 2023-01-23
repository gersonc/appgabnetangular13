import { Injectable } from '@angular/core';
import {ColunasI} from "../_models/colunas-i";
import jsPDF from 'jspdf'
import {autoTable, applyPlugin, UserOptions } from 'jspdf-autotable';
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
declare let html2canvas: any;
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
    const doc = new jsPDF (
      {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
      },
    ) as jsPDFCustom;

    doc.setFontSize(10);
    // @ts-ignore
    doc.autoTable(columns, dados);
    doc.save(`${pdfFileName}_export_${new Date().getTime()}.pdf`);



  }
}
