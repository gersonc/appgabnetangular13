import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style'
import {ExcelParcer} from "../shared/functions/excel-parcer";
import { saveAs } from 'file-saver';
import {ColunasI} from "../_models/colunas-i";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public static criaExcelFile(excelFileName: string, dados: any[], selectedColumns: ColunasI[]): void {
    const d: any = ExcelParcer(dados, selectedColumns);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(d[0], {skipHeader: true});
    XLSX.utils.book_append_sheet( wb, ws, excelFileName);
    ws["!cols"] = d[1];
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    ExcelService.saveAsExcelFile(excelBuffer, excelFileName);
  }

  static saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }



  public static exportAsExcelFile(excelFileName: string, json: any[], selectedColumns: ColunasI[]): void {
    const titulos: any[] = [];
    selectedColumns.forEach((d) => {
      titulos[d.field]= d.header;
    });
    const keys = Object.keys(titulos);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([keys], {header: titulos, skipHeader: true});
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    XLSX.utils.sheet_add_json(ws, json, {header: keys, origin: 'A2', skipHeader: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( wb, ws, excelFileName);
    XLSX.writeFile(wb, ExcelService.toExportFileName(excelFileName));
  }

  public static exportAsExcelFileBig(excelFileName: string, json: any[], selectedColumns: ColunasI[]): void {
    const titulos: any[] = [];
    selectedColumns.forEach((d) => {
      titulos[d.field]= d.header;
    });
    // const keys = Object.keys(titulos);
    //const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([keys], {header: titulos, skipHeader: true});
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {skipHeader: true});
    // XLSX.utils.sheet_add_json(ws, json, {header: keys, origin: 'A2', skipHeader: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( wb, ws, excelFileName);
    XLSX.writeFile(wb, ExcelService.toExportFileName(excelFileName));
  }



  public static exportAsExcelFile2(excelFileName: string, json: any[], tit: any[]): void {
    const cp = Object.keys(json[0]);
    const meuTit: string[] = [];
    cp.forEach((cc) => {
      // @ts-ignore
      meuTit.push(tit[cc]);
    });
    const tabela = [];
    json.forEach( (linha: any) => {
      tabela.push(Object.values(linha));
    });
    tabela.unshift(meuTit);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tabela);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( wb, ws, excelFileName);
    XLSX.writeFile(wb, ExcelService.toExportFileName(excelFileName));
  }
}
